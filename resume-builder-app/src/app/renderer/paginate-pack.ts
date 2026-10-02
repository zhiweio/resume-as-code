import { usablePageHeight } from './constants'

/**
 * Block-level page packer.
 *
 * Break-point model follows the same preference order as paged.js and the
 * TeX page builder: keep rules first (a heading never strands at a page
 * bottom), then break-cost ranking among the feasible points (section
 * boundary < entry boundary < inside an entry), with a page-fullness
 * badness term so equally legal breaks favor the fuller page.
 */

/** Semantic role of a block, stamped by the renderer via data-block-part. */
export type BlockPart =
  | 'sec-head'
  | 'head'
  | 'bullet'
  | 'keywords'
  | 'full'
  | 'row'

export interface BlockMeta {
  /** Position in the flat block list. */
  index: number
  /** Measured height in place (including the block's own paddingTop). */
  height: number
  /** The block's own inline paddingTop; stripped when the block leads a page. */
  paddingTop: number
  sectionId: string | null
  /** True for the first block of a section (kept out of continuation styling). */
  sectionStart: boolean
  subsectionId: string | null
  part: BlockPart
  /** Hard keep rule: the block must not be the last one on a page. */
  keepWithNext: boolean
}

export interface PackOptions {
  usableHeight?: number
  allowSectionSplit?: boolean
  allowSubsectionSplit?: boolean
  /** Padding a continuation block gets when it leads a page (budgeted exactly). */
  continuationPaddingPx?: number
}

export interface PageData {
  startIdx: number
  endIdx: number
}

/** Extra height of the continuation top rule (0.5px) added by print CSS. */
export const CONTINUATION_BORDER_PX = 0.5

// Break penalties, TeX club/widow magnitude, in strict dominance tiers:
// keep-rule violation > nearly-empty page > single orphan/widow > pair >
// clean boundaries. Keep-rule violations must dominate the page-fullness
// badness term (capped at BADNESS_CAP).
const PENALTY_ENTRY_BOUNDARY = 50
const PENALTY_KEYWORDS_SPLIT = 200
const PENALTY_ORPHAN_2 = 300
const PENALTY_WIDOW_2 = 300
const PENALTY_ORPHAN_1 = 3000
const PENALTY_WIDOW_1 = 3000
const PENALTY_UNDERFULL = 4000
const PENALTY_KEEP_WITH_NEXT = 5000
const BADNESS_SCALE = 100
const BADNESS_CAP = 2000
/** A non-final page holding less than this share of usable height reads as
 * broken (paged.js never leaves a near-empty fragmentainer either). */
const UNDERFULL_RATIO = 0.5

function resolvePackOptions(options?: PackOptions): Required<PackOptions> {
  return {
    usableHeight: options?.usableHeight ?? usablePageHeight(),
    allowSectionSplit: options?.allowSectionSplit ?? true,
    allowSubsectionSplit: options?.allowSubsectionSplit ?? true,
    continuationPaddingPx: options?.continuationPaddingPx ?? 0,
  }
}

/** Height of a block when it leads a page (spacing re-styled by render). */
export function leadingBlockHeight(
  meta: BlockMeta,
  continuationPaddingPx: number,
): number {
  const stripped = meta.height - meta.paddingTop
  if (meta.index === 0 || meta.sectionStart) return stripped
  // Continuation blocks trade their padding for the continuation padding
  // plus the 0.5px top rule (only when continuation styling is active).
  const continuation =
    continuationPaddingPx > 0
      ? continuationPaddingPx + CONTINUATION_BORDER_PX
      : 0
  return stripped + continuation
}

// ── Fusion ──────────────────────────────────────────────────────────────────

type UnitKind =
  | 'sec-head'
  | 'head'
  | 'bullet'
  | 'keywords'
  | 'row'
  | 'full'
  | 'entry'
  | 'section'

interface PackUnit {
  kind: UnitKind
  blocks: BlockMeta[]
  sectionId: string | null
  subsectionId: string | null
  /** 1-based position within the bullet run, for orphan/widow penalties. */
  bulletIndex?: number
  bulletRunLength?: number
}

function unitOf(meta: BlockMeta): PackUnit {
  return {
    kind: meta.part,
    blocks: [meta],
    sectionId: meta.sectionId,
    subsectionId: meta.subsectionId,
  }
}

function bulletRunOf(meta: BlockMeta[]): PackUnit[] {
  return meta.map((m, k) => ({
    kind: 'bullet' as const,
    blocks: [m],
    sectionId: m.sectionId,
    subsectionId: m.subsectionId,
    bulletIndex: k + 1,
    bulletRunLength: meta.length,
  }))
}

function fuseEntries(units: PackUnit[]): PackUnit[] {
  const fused: PackUnit[] = []
  let i = 0
  while (i < units.length) {
    const u = units[i]
    const fusable =
      u.subsectionId !== null &&
      (u.kind === 'head' ||
        u.kind === 'bullet' ||
        u.kind === 'keywords' ||
        u.kind === 'full')
    if (!fusable) {
      fused.push(u)
      i++
      continue
    }
    const group = [u]
    let j = i + 1
    while (j < units.length && units[j].subsectionId === u.subsectionId) {
      group.push(units[j])
      j++
    }
    fused.push({
      kind: 'entry',
      blocks: group.flatMap((g) => g.blocks),
      sectionId: u.sectionId,
      subsectionId: u.subsectionId,
    })
    i = j
  }
  return fused
}

function fuseSections(units: PackUnit[]): PackUnit[] {
  const fused: PackUnit[] = []
  let i = 0
  while (i < units.length) {
    const u = units[i]
    if (u.sectionId === null) {
      fused.push(u)
      i++
      continue
    }
    const group = [u]
    let j = i + 1
    while (j < units.length && units[j].sectionId === u.sectionId) {
      group.push(units[j])
      j++
    }
    fused.push({
      kind: 'section',
      blocks: group.flatMap((g) => g.blocks),
      sectionId: u.sectionId,
      subsectionId: null,
    })
    i = j
  }
  return fused
}

/** Group fine-grained blocks into atomic units per the split options. */
function fuseUnits(meta: BlockMeta[], opts: Required<PackOptions>): PackUnit[] {
  const granular: PackUnit[] = []
  let i = 0
  while (i < meta.length) {
    if (meta[i].part === 'bullet') {
      let j = i
      while (
        j < meta.length &&
        meta[j].part === 'bullet' &&
        meta[j].subsectionId === meta[i].subsectionId
      )
        j++
      granular.push(...bulletRunOf(meta.slice(i, j)))
      i = j
      continue
    }
    granular.push(unitOf(meta[i]))
    i++
  }

  const entryLevel = opts.allowSubsectionSplit
    ? granular
    : fuseEntries(granular)
  return opts.allowSectionSplit ? entryLevel : fuseSections(entryLevel)
}

/** Progressively finer units for force-splitting an oversized fused unit. */
function splitUnit(unit: PackUnit, opts: Required<PackOptions>): PackUnit[] {
  if (unit.kind === 'section') {
    return fuseUnits(unit.blocks, { ...opts, allowSectionSplit: true })
  }
  if (unit.kind === 'entry') {
    return fuseUnits(unit.blocks, {
      ...opts,
      allowSectionSplit: true,
      allowSubsectionSplit: true,
    })
  }
  return [unit]
}

// ── Costs ───────────────────────────────────────────────────────────────────

function unitHeight(
  unit: PackUnit,
  leadsPage: boolean,
  continuationPaddingPx: number,
): number {
  const [first, ...rest] = unit.blocks
  let total = leadsPage
    ? leadingBlockHeight(first, continuationPaddingPx)
    : first.height
  for (const b of rest) total += b.height
  return total
}

function fillBadness(filled: number, usableHeight: number): number {
  const remaining = Math.max(0, usableHeight - filled)
  const badness = BADNESS_SCALE * Math.pow(remaining / usableHeight, 3)
  return Math.min(BADNESS_CAP, Math.round(badness))
}

/** Break cost between two units on the same page, Infinity if forbidden. */
function breakPenalty(last: PackUnit, next: PackUnit): number {
  const lastBlock = last.blocks[last.blocks.length - 1]
  if (lastBlock.keepWithNext) return PENALTY_KEEP_WITH_NEXT
  if (last.sectionId !== next.sectionId) return 0 // section boundary

  if (last.kind === 'bullet') {
    const i = last.bulletIndex ?? 1
    const n = last.bulletRunLength ?? 1
    if (i === n) {
      // Tail of the run: keywords split-off vs a clean entry boundary.
      return next.kind === 'keywords'
        ? PENALTY_KEYWORDS_SPLIT
        : PENALTY_ENTRY_BOUNDARY
    }
    const orphan = i === 1 ? PENALTY_ORPHAN_1 : i === 2 ? PENALTY_ORPHAN_2 : 0
    const carried = n - i
    const widow =
      carried === 1 ? PENALTY_WIDOW_1 : carried === 2 ? PENALTY_WIDOW_2 : 0
    return Math.max(orphan, widow)
  }

  // Entry rows, keyword lines, whole fused entries: a mid-section boundary.
  return PENALTY_ENTRY_BOUNDARY
}

/**
 * Pick the page-end unit index among [startUnit, lastPlaced] minimizing
 * keep-rule penalties plus page-fullness badness. Later breaks win ties.
 * Returns the chosen index, or null when every candidate violates a
 * keep-with-next rule (the caller decides whether to relax or force-split).
 */
function chooseBreak(
  units: PackUnit[],
  startUnit: number,
  lastPlaced: number,
  usableHeight: number,
  continuationPaddingPx: number,
): { index: number; keepWithNextViolation: boolean } | null {
  let filled = 0
  let clean: number | null = null
  let cleanCost = Infinity
  let any: number | null = null
  let anyCost = Infinity
  for (let e = startUnit; e < lastPlaced; e++) {
    filled += unitHeight(units[e], e === startUnit, continuationPaddingPx)
    const penalty = breakPenalty(units[e], units[e + 1])
    const underfull =
      filled < usableHeight * UNDERFULL_RATIO ? PENALTY_UNDERFULL : 0
    const cost = penalty + underfull + fillBadness(filled, usableHeight)
    const violation = penalty >= PENALTY_KEEP_WITH_NEXT
    if (violation) {
      if (cost <= anyCost) {
        anyCost = cost
        any = e
      }
    } else if (cost <= cleanCost) {
      cleanCost = cost
      clean = e
    }
  }
  if (clean !== null) return { index: clean, keepWithNextViolation: false }
  if (any !== null) return { index: any, keepWithNextViolation: true }
  return null
}

// ── Packing ─────────────────────────────────────────────────────────────────

function unitRange(units: PackUnit[], from: number, to: number): PageData {
  const first = units[from].blocks[0]
  const lastUnit = units[to - 1]
  const lastBlock = lastUnit.blocks[lastUnit.blocks.length - 1]
  return { startIdx: first.index, endIdx: lastBlock.index + 1 }
}

/** Pack metadata blocks into pages. Pure; the seam for headless tests. */
export function packBlockMetas(
  meta: BlockMeta[],
  options?: PackOptions,
): PageData[] {
  if (meta.length === 0) return [{ startIdx: 0, endIdx: 0 }]

  const opts = resolvePackOptions(options)
  let units = fuseUnits(meta, opts)
  const pages: PageData[] = []
  let pageStart = 0

  while (pageStart < units.length) {
    let filled = 0
    let j = pageStart

    while (j < units.length) {
      const h = unitHeight(
        units[j],
        j === pageStart,
        opts.continuationPaddingPx,
      )
      if (j > pageStart && filled + h > opts.usableHeight) break
      if (
        j === pageStart &&
        h > opts.usableHeight &&
        units[j].blocks.length > 1
      ) {
        // An oversized fused unit would be clipped: force-split it and retry
        // (css-break-3 relaxation — break-inside yields before content loss).
        units.splice(j, 1, ...splitUnit(units[j], opts))
        continue
      }
      filled += h
      j++
    }

    if (j === units.length) {
      pages.push(unitRange(units, pageStart, j))
      break
    }

    // Overflow before units[j]: choose the best page end among the placed
    // units. When only keep-with-next violations remain and the overflowing
    // unit is still fused, force-split it instead (paged.js relaxes the same
    // way: avoid rules yield before content is stranded).
    const choice = chooseBreak(
      units,
      pageStart,
      j,
      opts.usableHeight,
      opts.continuationPaddingPx,
    )
    if (
      (choice === null || choice.keepWithNextViolation) &&
      units[j].blocks.length > 1
    ) {
      units.splice(j, 1, ...splitUnit(units[j], opts))
      continue
    }
    if (choice === null) {
      // Degenerate page (should not happen): flush progress to guarantee
      // termination.
      pages.push(unitRange(units, pageStart, j))
      pageStart = j
      continue
    }
    pages.push(unitRange(units, pageStart, choice.index + 1))
    pageStart = choice.index + 1
  }

  return pages
}

// ── DOM adapter ─────────────────────────────────────────────────────────────

export function measureBlockHeight(el: HTMLElement): number {
  return Math.max(el.offsetHeight, el.scrollHeight)
}

function parseBlockPart(value: string | undefined): BlockPart {
  switch (value) {
    case 'sec-head':
    case 'head':
    case 'bullet':
    case 'keywords':
    case 'row':
      return value
    default:
      return 'full'
  }
}

export function buildBlockMeta(blocks: HTMLElement[]): BlockMeta[] {
  return blocks.map((el, index) => ({
    index,
    height: measureBlockHeight(el),
    paddingTop: Number.parseFloat(el.style.paddingTop) || 0,
    sectionId: el.dataset.sectionId ?? null,
    sectionStart: el.dataset.sectionStart === 'true',
    subsectionId: el.dataset.subsectionId ?? null,
    part: parseBlockPart(el.dataset.blockPart),
    keepWithNext: el.dataset.keepWithNext === 'true',
  }))
}

/** Measure DOM blocks and pack them into pages. */
export function packBlocksToPages(
  blocks: HTMLElement[],
  options?: PackOptions,
): PageData[] {
  return packBlockMetas(buildBlockMeta(blocks), options)
}

/** Test helper: pack blocks described by height metadata without a DOM. */
export interface MockBlock {
  height: number
  paddingTop?: number
  sectionId?: string | null
  sectionStart?: boolean
  subsectionId?: string | null
  part?: BlockPart
  keepWithNext?: boolean
}

export function packMockBlocks(
  blocks: MockBlock[],
  options?: PackOptions,
): PageData[] {
  const meta: BlockMeta[] = blocks.map((b, index) => ({
    index,
    height: b.height,
    paddingTop: b.paddingTop ?? 0,
    sectionId: b.sectionId ?? null,
    sectionStart: b.sectionStart ?? false,
    subsectionId: b.subsectionId ?? null,
    part: b.part ?? 'full',
    keepWithNext: b.keepWithNext ?? false,
  }))
  return packBlockMetas(meta, options)
}
