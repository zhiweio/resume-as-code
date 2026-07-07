import { Paper } from './constants'

/** A4 usable content height at 96 dpi. */
export const USABLE_HEIGHT = Paper.heightPx - Paper.marginPx * 2

export interface PageData {
  startIdx: number
  endIdx: number
}

interface BlockMeta {
  index: number
  height: number
  sectionId: string | null
}

interface SingleUnit {
  type: 'single'
  index: number
  height: number
}

interface SectionUnit {
  type: 'section'
  sectionId: string
  indices: number[]
  heights: number[]
  totalHeight: number
}

type PackUnit = SingleUnit | SectionUnit

export function measureBlockHeight(el: HTMLElement): number {
  return Math.max(el.offsetHeight, el.scrollHeight)
}

function shouldStartNewPage(
  blockHeight: number,
  currentHeight: number,
  pageHasBlocks: boolean,
  atomic: boolean,
): boolean {
  if (!pageHasBlocks) return false

  const remaining = USABLE_HEIGHT - currentHeight
  if (currentHeight + blockHeight > USABLE_HEIGHT) return true
  if (atomic && blockHeight > remaining) return true

  return false
}

function buildBlockMeta(blocks: HTMLElement[]): BlockMeta[] {
  return blocks.map((el, index) => ({
    index,
    height: measureBlockHeight(el),
    sectionId: el.dataset.sectionId ?? null,
  }))
}

function buildPackUnits(meta: BlockMeta[]): PackUnit[] {
  const units: PackUnit[] = []
  let i = 0

  while (i < meta.length) {
    if (!meta[i].sectionId) {
      units.push({
        type: 'single',
        index: meta[i].index,
        height: meta[i].height,
      })
      i++
      continue
    }

    const sectionId = meta[i].sectionId
    const indices: number[] = []
    const heights: number[] = []

    while (i < meta.length && meta[i].sectionId === sectionId) {
      indices.push(meta[i].index)
      heights.push(meta[i].height)
      i++
    }

    const totalHeight = heights.reduce((sum, height) => sum + height, 0)
    units.push({
      type: 'section',
      sectionId,
      indices,
      heights,
      totalHeight,
    })
  }

  return units
}

/**
 * Pack measured blocks into pages.
 *
 * Rules:
 * - Sub-sections are atomic (never split).
 * - When a whole section fits in the remaining space on the current page, keep it
 *   together on that page.
 * - Otherwise pack sub-sections greedily so trailing page space is used first.
 */
export function packBlocksToPages(blocks: HTMLElement[]): PageData[] {
  if (blocks.length === 0) return [{ startIdx: 0, endIdx: 0 }]

  const units = buildPackUnits(buildBlockMeta(blocks))
  const pages: PageData[] = []
  let pageStartIdx = 0
  let currentHeight = 0

  const startNewPage = (nextIdx: number) => {
    if (nextIdx > pageStartIdx) {
      pages.push({ startIdx: pageStartIdx, endIdx: nextIdx })
    }
    pageStartIdx = nextIdx
    currentHeight = 0
  }

  for (const unit of units) {
    if (unit.type === 'single') {
      const pageHasBlocks = unit.index > pageStartIdx
      if (
        shouldStartNewPage(unit.height, currentHeight, pageHasBlocks, false)
      ) {
        startNewPage(unit.index)
      }
      currentHeight += unit.height
      continue
    }

    const firstIdx = unit.indices[0]
    const fitsInRemaining = currentHeight + unit.totalHeight <= USABLE_HEIGHT

    if (fitsInRemaining) {
      const pageHasBlocks = firstIdx > pageStartIdx
      if (
        shouldStartNewPage(unit.totalHeight, currentHeight, pageHasBlocks, true)
      ) {
        startNewPage(firstIdx)
      }
      currentHeight += unit.totalHeight
      continue
    }

    for (let j = 0; j < unit.indices.length; j++) {
      const idx = unit.indices[j]
      const height = unit.heights[j]
      const pageHasBlocks = idx > pageStartIdx
      if (shouldStartNewPage(height, currentHeight, pageHasBlocks, true)) {
        startNewPage(idx)
      }
      currentHeight += height
    }
  }

  if (pageStartIdx < blocks.length) {
    pages.push({ startIdx: pageStartIdx, endIdx: blocks.length })
  }

  return pages
}
