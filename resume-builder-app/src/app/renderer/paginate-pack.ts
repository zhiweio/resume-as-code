import { Paper, usablePageHeight } from './constants'

/** A4 usable content height at default 40px margins. */
export const USABLE_HEIGHT = usablePageHeight()

export interface PageData {
  startIdx: number
  endIdx: number
}

export interface PackOptions {
  usableHeight?: number
  allowSectionSplit?: boolean
  allowSubsectionSplit?: boolean
}

export const DEFAULT_PACK_OPTIONS: Required<PackOptions> = {
  usableHeight: USABLE_HEIGHT,
  allowSectionSplit: true,
  allowSubsectionSplit: false,
}

interface BlockMeta {
  index: number
  height: number
  sectionId: string | null
  subsectionId: string | null
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

function resolvePackOptions(options?: PackOptions): Required<PackOptions> {
  return { ...DEFAULT_PACK_OPTIONS, ...options }
}

function shouldStartNewPage(
  blockHeight: number,
  currentHeight: number,
  pageHasBlocks: boolean,
  atomic: boolean,
  usableHeight: number,
): boolean {
  if (!pageHasBlocks) return false

  const remaining = usableHeight - currentHeight
  if (currentHeight + blockHeight > usableHeight) return true
  if (atomic && blockHeight > remaining) return true

  return false
}

function buildBlockMeta(blocks: HTMLElement[]): BlockMeta[] {
  return blocks.map((el, index) => ({
    index,
    height: measureBlockHeight(el),
    sectionId: el.dataset.sectionId ?? null,
    subsectionId: el.dataset.subsectionId ?? null,
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

function packSectionUnit(
  unit: SectionUnit,
  state: {
    pageStartIdx: number
    currentHeight: number
    pages: PageData[]
    usableHeight: number
    allowSectionSplit: boolean
  },
): { pageStartIdx: number; currentHeight: number } {
  const { usableHeight, allowSectionSplit } = state
  let { pageStartIdx, currentHeight } = state

  const startNewPage = (nextIdx: number) => {
    if (nextIdx > pageStartIdx) {
      state.pages.push({ startIdx: pageStartIdx, endIdx: nextIdx })
    }
    pageStartIdx = nextIdx
    currentHeight = 0
  }

  const firstIdx = unit.indices[0]
  const fitsInRemaining = currentHeight + unit.totalHeight <= usableHeight

  if (!allowSectionSplit) {
    const pageHasBlocks = firstIdx > pageStartIdx
    if (
      shouldStartNewPage(
        unit.totalHeight,
        currentHeight,
        pageHasBlocks,
        true,
        usableHeight,
      )
    ) {
      startNewPage(firstIdx)
    }
    currentHeight += unit.totalHeight
    return { pageStartIdx, currentHeight }
  }

  if (fitsInRemaining) {
    const pageHasBlocks = firstIdx > pageStartIdx
    if (
      shouldStartNewPage(
        unit.totalHeight,
        currentHeight,
        pageHasBlocks,
        true,
        usableHeight,
      )
    ) {
      startNewPage(firstIdx)
    }
    currentHeight += unit.totalHeight
    return { pageStartIdx, currentHeight }
  }

  for (let j = 0; j < unit.indices.length; j++) {
    const idx = unit.indices[j]
    const height = unit.heights[j]
    const pageHasBlocks = idx > pageStartIdx
    if (
      shouldStartNewPage(
        height,
        currentHeight,
        pageHasBlocks,
        true,
        usableHeight,
      )
    ) {
      startNewPage(idx)
    }
    currentHeight += height
  }

  return { pageStartIdx, currentHeight }
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
export function packBlocksToPages(
  blocks: HTMLElement[],
  options?: PackOptions,
): PageData[] {
  if (blocks.length === 0) return [{ startIdx: 0, endIdx: 0 }]

  const { usableHeight, allowSectionSplit } = resolvePackOptions(options)
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
        shouldStartNewPage(
          unit.height,
          currentHeight,
          pageHasBlocks,
          false,
          usableHeight,
        )
      ) {
        startNewPage(unit.index)
      }
      currentHeight += unit.height
      continue
    }

    const result = packSectionUnit(unit, {
      pageStartIdx,
      currentHeight,
      pages,
      usableHeight,
      allowSectionSplit,
    })
    pageStartIdx = result.pageStartIdx
    currentHeight = result.currentHeight
  }

  if (pageStartIdx < blocks.length) {
    pages.push({ startIdx: pageStartIdx, endIdx: blocks.length })
  }

  return pages
}

/** Test helper: pack blocks described by height metadata without a DOM. */
export function packMockBlocks(
  blocks: Array<{
    height: number
    sectionId?: string
    subsectionId?: string
  }>,
  options?: PackOptions,
): PageData[] {
  const elements = blocks.map((block) => ({
    offsetHeight: block.height,
    scrollHeight: block.height,
    dataset: {
      sectionId: block.sectionId ?? '',
      subsectionId: block.subsectionId ?? '',
    },
  })) as HTMLElement[]

  return packBlocksToPages(elements, options)
}
