import { describe, expect, it } from 'vitest'
import {
  CONTINUATION_BORDER_PX,
  leadingBlockHeight,
  packMockBlocks,
  type BlockMeta,
  type MockBlock,
  type PageData,
} from './paginate-pack'
import { PAPER_SIZES, usablePageHeight } from './constants'

// ── Fixtures ────────────────────────────────────────────────────────────────
// Fine-grained block shapes emitted by ResumeRenderer. Heights keep the page
// arithmetic readable (usableHeight 100 unless stated).

function secHead(sectionId: string, height = 12): MockBlock {
  return {
    height,
    sectionId,
    sectionStart: true,
    part: 'sec-head',
    keepWithNext: true,
  }
}

function head(
  sectionId: string,
  subsectionId: string,
  height = 20,
  paddingTop = 0,
): MockBlock {
  return {
    height,
    paddingTop,
    sectionId,
    subsectionId,
    part: 'head',
    keepWithNext: true,
  }
}

function bullet(
  sectionId: string,
  subsectionId: string,
  height = 10,
): MockBlock {
  return { height, sectionId, subsectionId, part: 'bullet' }
}

function keywords(
  sectionId: string,
  subsectionId: string,
  height = 8,
): MockBlock {
  return { height, sectionId, subsectionId, part: 'keywords' }
}

function row(sectionId: string, height = 14): MockBlock {
  return { height, sectionId, part: 'row' }
}

/** One fine-grained entry: head + n bullets (+ keywords). */
function entry(
  sectionId: string,
  id: string,
  bullets: number,
  withKeywords = false,
  paddingTop = 0,
): MockBlock[] {
  const sub = `${sectionId}-${id}`
  const blocks = [head(sectionId, sub, 20, paddingTop)]
  for (let i = 0; i < bullets; i++) blocks.push(bullet(sectionId, sub))
  if (withKeywords) blocks.push(keywords(sectionId, sub))
  return blocks
}

function section(
  sectionId: string,
  entries: Array<{ id: string; bullets: number; keywords?: boolean }>,
): MockBlock[] {
  return [
    secHead(sectionId),
    ...entries.flatMap((e, i) =>
      entry(sectionId, e.id, e.bullets, e.keywords ?? false, i === 0 ? 0 : 6),
    ),
  ]
}

/** Map PageData ranges back to the mock blocks for structural assertions. */
function pagesOf(blocks: MockBlock[], pages: PageData[]): MockBlock[][] {
  return pages.map((p) => blocks.slice(p.startIdx, p.endIdx))
}

function parts(blocks: MockBlock[]): string[] {
  return blocks.map((b) => b.part ?? 'full')
}

/** Assert pages tile the block list in order with no empty pages. */
function expectFullOrderedCoverage(
  blocks: MockBlock[],
  pages: PageData[],
): void {
  expect(pages.length).toBeGreaterThan(0)
  expect(pages[0].startIdx).toBe(0)
  expect(pages[pages.length - 1].endIdx).toBe(blocks.length)
  for (let i = 0; i < pages.length; i++) {
    expect(pages[i].endIdx).toBeGreaterThan(pages[i].startIdx)
    if (i > 0) expect(pages[i].startIdx).toBe(pages[i - 1].endIdx)
  }
}

// ── Basic placement ─────────────────────────────────────────────────────────

describe('basic placement', () => {
  it('packs a single block on one page', () => {
    expect(packMockBlocks([{ height: 200 }])).toEqual([
      { startIdx: 0, endIdx: 1 },
    ])
  })

  it('returns a single empty page for empty input', () => {
    expect(packMockBlocks([])).toEqual([{ startIdx: 0, endIdx: 0 }])
  })

  it('fills pages greedily at clean boundaries', () => {
    const pages = packMockBlocks(
      [{ height: 60 }, { height: 60 }, { height: 60 }],
      { usableHeight: 100 },
    )
    expect(pages).toEqual([
      { startIdx: 0, endIdx: 1 },
      { startIdx: 1, endIdx: 2 },
      { startIdx: 2, endIdx: 3 },
    ])
  })

  it('never emits an empty page', () => {
    const pages = packMockBlocks([{ height: 100 }, { height: 100 }], {
      usableHeight: 100,
    })
    expect(pages).toHaveLength(2)
    for (const p of pages) expect(p.endIdx).toBeGreaterThan(p.startIdx)
  })
})

// ── Keep-with-next ──────────────────────────────────────────────────────────

describe('keep-with-next', () => {
  it('never leaves a section header stranded at a page bottom', () => {
    const blocks = [{ height: 60 }, secHead('work'), row('work'), row('work')]
    // usable 85: 60+12 fits, +14 overflows → the header must move to page 2
    // with the rows instead of ending page 1.
    const pages = packMockBlocks(blocks, { usableHeight: 85 })
    expectFullOrderedCoverage(blocks, pages)
    const pageBlocks = pagesOf(blocks, pages)
    expect(parts(pageBlocks[0])).toEqual(['full'])
    expect(parts(pageBlocks[1])).toEqual(['sec-head', 'row', 'row'])
  })

  it('keeps an entry head attached to its bullets', () => {
    const blocks = [{ height: 70 }, ...entry('work', 'e1', 3)]
    const pages = packMockBlocks(blocks, { usableHeight: 100 })
    const pageBlocks = pagesOf(blocks, pages)
    // 70 + 20 fits, +10 bullet overflows; the head must move with the bullets.
    expect(parts(pageBlocks[0])).toEqual(['full'])
    expect(parts(pageBlocks[1])).toEqual(['head', 'bullet', 'bullet', 'bullet'])
  })

  it('keeps a lone empty-section header at the document end', () => {
    const blocks = [{ height: 50 }, secHead('empty')]
    expect(packMockBlocks(blocks, { usableHeight: 100 })).toEqual([
      { startIdx: 0, endIdx: 2 },
    ])
  })
})

// ── Orphan / widow control ──────────────────────────────────────────────────

describe('orphan and widow control', () => {
  it('never strands a single carried bullet at a page top when avoidable', () => {
    // 45 + 20 = 65, b1 → 75, tall b2 (60) overflows. Breaking after b1 would
    // carry a single bullet (widow 3000); header-only breaks are underfull
    // (4000). The least-bad legal break still keeps the head with b1.
    const blocks = [
      { height: 45 },
      head('work', 'w1'),
      bullet('work', 'w1'),
      bullet('work', 'w1', 60),
    ]
    const pages = packMockBlocks(blocks, { usableHeight: 100 })
    const pageBlocks = pagesOf(blocks, pages)
    expectFullOrderedCoverage(blocks, pages)
    const tail = pageBlocks[0][pageBlocks[0].length - 1]
    expect(tail.part).not.toBe('head')
    expect(tail.part).not.toBe('sec-head')
  })

  it('prefers carrying two bullets over one to the next page', () => {
    const blocks = [
      { height: 30 },
      head('work', 'w1'),
      bullet('work', 'w1'),
      bullet('work', 'w1'),
      bullet('work', 'w1'),
      bullet('work', 'w1'),
    ]
    // usable 80: page 1 fills 30+20+10+10+10 = 80 exactly (b3 last), overflow
    // at b4. After b3: widow 1 carried (3000). After b2: pair penalties (300).
    // After b1: orphan 1 (3000). The pair break wins.
    const pages = packMockBlocks(blocks, { usableHeight: 80 })
    const pageBlocks = pagesOf(blocks, pages)
    expect(parts(pageBlocks[0])).toEqual(['full', 'head', 'bullet', 'bullet'])
    expect(parts(pageBlocks[1])).toEqual(['bullet', 'bullet'])
  })

  it('keeps keywords with the entry when everything fits one page', () => {
    const blocks = [{ height: 40 }, ...entry('work', 'e1', 2, true)]
    // 40 + 20 + 10 + 10 + 8 = 88 → one page.
    expect(packMockBlocks(blocks, { usableHeight: 100 })).toHaveLength(1)
  })
})

// ── Break-point preference ──────────────────────────────────────────────────

describe('break-point preference', () => {
  it('prefers a section boundary over a fuller mid-section entry boundary', () => {
    // work: 12 + 20 + 10 + 10 = 52; projects: 12 + 26 + 10 + 10 = 58.
    // usable 100: page 1 can hold work + projects' first bullet (100 exact),
    // a fuller break at entry level (penalty 50), or stop after work
    // (section boundary, penalty 0, 52% full). The section boundary wins.
    const blocks = [
      ...section('work', [{ id: 'a', bullets: 2 }]),
      ...section('projects', [{ id: 'b', bullets: 2 }]),
    ]
    const pages = packMockBlocks(blocks, { usableHeight: 100 })
    const pageBlocks = pagesOf(blocks, pages)
    expectFullOrderedCoverage(blocks, pages)
    expect(pageBlocks).toHaveLength(2)
    expect(pageBlocks[0][pageBlocks[0].length - 1].sectionId).toBe('work')
    expect(pageBlocks[1][0].part).toBe('sec-head')
  })

  it('splits subsections greedily at entry boundaries when a section does not fit', () => {
    const blocks = [
      { height: 990 },
      ...section('projects', [
        { id: 'a', bullets: 1 },
        { id: 'b', bullets: 1 },
      ]),
    ]
    const pages = packMockBlocks(blocks, { usableHeight: 1043 })
    expect(pages).toEqual([
      { startIdx: 0, endIdx: 1 },
      { startIdx: 1, endIdx: blocks.length },
    ])
  })

  it('budgets continuation styling into leading heights', () => {
    const meta = (
      over: Partial<BlockMeta> & { index: number; height: number },
    ): BlockMeta => ({
      paddingTop: 0,
      sectionId: 'projects',
      sectionStart: true,
      subsectionId: null,
      part: 'sec-head',
      keepWithNext: true,
      ...over,
    })
    // Measured heights include the block's own padding; a page-leading
    // section start renders with padding stripped.
    expect(
      leadingBlockHeight(meta({ index: 4, height: 12, paddingTop: 6 }), 5),
    ).toBe(6)
    // A non-section-start block (a carried bullet) gains continuation padding
    // plus the 0.5px rule when it leads a page.
    expect(
      leadingBlockHeight(
        meta({
          index: 9,
          height: 10,
          sectionStart: false,
          part: 'bullet',
          subsectionId: 'p-b',
        }),
        5,
      ),
    ).toBe(10 + 5 + CONTINUATION_BORDER_PX)
    // Document-leading blocks and section starts never pay the continuation
    // surcharge.
    expect(
      leadingBlockHeight(meta({ index: 0, height: 10, paddingTop: 4 }), 5),
    ).toBe(6)
  })

  it('applies continuation budget when a carried bullet leads the next page', () => {
    const blocks = [
      { height: 30 },
      secHead('work'),
      head('work', 'w1'),
      bullet('work', 'w1'),
      bullet('work', 'w1'),
    ]
    // In place: 30+12+20+10+10 = 82 > 81 → overflow at the last bullet.
    // Every early break is underfull or a keep violation, so the break lands
    // after bullet 1 and bullet 2 leads page 2 with the continuation budget.
    const pages = packMockBlocks(blocks, {
      usableHeight: 81,
      continuationPaddingPx: 5,
    })
    expectFullOrderedCoverage(blocks, pages)
    expect(pages).toHaveLength(2)
    expect(pages[1].startIdx).toBe(4)
  })

  it('strips paddingTop when a section-start block leads a page', () => {
    const blocks = [{ height: 50 }, secHead('work', 24), row('work')]
    // In place: 50 + 24 + 14 = 88 → one page.
    expect(
      packMockBlocks(blocks, { usableHeight: 100, continuationPaddingPx: 5 }),
    ).toHaveLength(1)

    const tall = [
      { height: 50 },
      {
        height: 80,
        sectionId: 'work',
        sectionStart: true,
        part: 'sec-head' as const,
        keepWithNext: true,
      },
      row('work'),
    ]
    // In place 50 + 80 = 130 → sec-head moves to page 2 (leading strips no
    // padding here: none declared) and the row follows.
    const pages = packMockBlocks(tall, { usableHeight: 100 })
    expect(pages).toEqual([
      { startIdx: 0, endIdx: 1 },
      { startIdx: 1, endIdx: 3 },
    ])
  })
})

// ── Fusion modes ────────────────────────────────────────────────────────────

describe('fusion modes', () => {
  it('keeps a whole entry atomic when subsection split is off', () => {
    const blocks = [
      { height: 50 },
      ...entry('work', 'e1', 3),
      ...entry('work', 'e2', 3),
    ]
    const pages = packMockBlocks(blocks, {
      usableHeight: 100,
      allowSubsectionSplit: false,
    })
    const pageBlocks = pagesOf(blocks, pages)
    expectFullOrderedCoverage(blocks, pages)
    // header (50) alone wins on cost: e1 fused (50) would fill the page but
    // costs an entry-boundary penalty 50 vs header's underfull-free 13.
    // Entries move as undivided lumps and no page ends mid-entry.
    expect(parts(pageBlocks[0])).toEqual(['full'])
    expect(parts(pageBlocks[1])).toEqual([
      'head',
      'bullet',
      'bullet',
      'bullet',
      'head',
      'bullet',
      'bullet',
      'bullet',
    ])
    for (const page of pageBlocks) {
      expect(page[page.length - 1].part).not.toBe('head')
    }
  })

  it('breaks between bullets when subsection split is on', () => {
    const blocks = [{ height: 30 }, ...entry('work', 'e1', 4)]
    const pages = packMockBlocks(blocks, {
      usableHeight: 75,
      allowSubsectionSplit: true,
    })
    const pageBlocks = pagesOf(blocks, pages)
    // 30+20+10+10 = 70, +10 = 80 > 75 → overflow at b3. Break after b2
    // (pair penalty 300) beats after b1 (orphan 3000).
    expect(parts(pageBlocks[0])).toEqual(['full', 'head', 'bullet', 'bullet'])
    expect(parts(pageBlocks[1])).toEqual(['bullet', 'bullet'])
  })

  it('moves a whole section when section split is off', () => {
    const blocks = [
      { height: 990 },
      ...section('projects', [
        { id: 'a', bullets: 1 },
        { id: 'b', bullets: 1 },
      ]),
    ]
    const pages = packMockBlocks(blocks, {
      usableHeight: 1043,
      allowSectionSplit: false,
    })
    expect(pages).toEqual([
      { startIdx: 0, endIdx: 1 },
      { startIdx: 1, endIdx: blocks.length },
    ])
  })

  it('force-splits an oversized fused section instead of clipping it', () => {
    const blocks = [
      { height: 100 },
      ...section('big', [
        { id: 'a', bullets: 8 },
        { id: 'b', bullets: 8 },
      ]),
    ]
    const pages = packMockBlocks(blocks, {
      usableHeight: 150,
      allowSectionSplit: false,
      allowSubsectionSplit: false,
    })
    const pageBlocks = pagesOf(blocks, pages)
    const placed = pageBlocks.flat()
    expectFullOrderedCoverage(blocks, pages)
    expect(placed.map((b) => b.height)).toEqual(blocks.map((b) => b.height))
  })
})

// ── Oversized and degenerate inputs ─────────────────────────────────────────

describe('oversized and degenerate inputs', () => {
  it('places a single oversized block on its own page', () => {
    const pages = packMockBlocks(
      [{ height: 50 }, { height: 500 }, { height: 50 }],
      {
        usableHeight: 100,
      },
    )
    expect(pages).toEqual([
      { startIdx: 0, endIdx: 1 },
      { startIdx: 1, endIdx: 2 },
      { startIdx: 2, endIdx: 3 },
    ])
  })

  it('force-splits an oversized fused entry into fine-grained blocks', () => {
    const blocks = [...entry('work', 'monster', 20)] // 220 tall fused
    const pages = packMockBlocks(blocks, {
      usableHeight: 100,
      allowSubsectionSplit: false,
    })
    expectFullOrderedCoverage(blocks, pages)
    expect(pages.length).toBeGreaterThan(1)
  })

  it('terminates on adversarial keep-with-next chains', () => {
    const blocks: MockBlock[] = Array.from({ length: 30 }, () => ({
      height: 10,
      sectionId: 's',
      part: 'row',
      keepWithNext: true,
    }))
    const pages = packMockBlocks(blocks, { usableHeight: 50 })
    expectFullOrderedCoverage(blocks, pages)
  })
})

// ── Property: random documents ──────────────────────────────────────────────

describe('coverage properties', () => {
  function mulberry32(seed: number): () => number {
    let a = seed
    return () => {
      a |= 0
      a = (a + 0x6d2b79f5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  it('covers every block exactly once, in order, across random documents and modes', () => {
    const rand = mulberry32(42)
    for (let iteration = 0; iteration < 150; iteration++) {
      const blocks: MockBlock[] = [{ height: 40 + Math.floor(rand() * 40) }]
      const sectionCount = 1 + Math.floor(rand() * 3)
      for (let sIdx = 0; sIdx < sectionCount; sIdx++) {
        const id = `s${sIdx}`
        blocks.push(secHead(id, 8 + Math.floor(rand() * 12)))
        const entryCount = 1 + Math.floor(rand() * 3)
        for (let eIdx = 0; eIdx < entryCount; eIdx++) {
          blocks.push(
            ...entry(
              id,
              `e${eIdx}`,
              1 + Math.floor(rand() * 4),
              rand() > 0.5,
              Math.floor(rand() * 8),
            ),
          )
        }
        if (rand() > 0.5) blocks.push(row(id))
      }
      const usable = 90 + Math.floor(rand() * 120)
      for (const sectionSplit of [true, false]) {
        for (const subSplit of [true, false]) {
          const pages = packMockBlocks(blocks, {
            usableHeight: usable,
            allowSectionSplit: sectionSplit,
            allowSubsectionSplit: subSplit,
          })
          expectFullOrderedCoverage(blocks, pages)
        }
      }
    }
  })

  it('never strands a keep-with-next block at a non-final page bottom unless unavoidable', () => {
    const rand = mulberry32(1337)
    for (let iteration = 0; iteration < 100; iteration++) {
      const blocks: MockBlock[] = [{ height: 30 + Math.floor(rand() * 60) }]
      for (let sIdx = 0; sIdx < 3; sIdx++) {
        const id = `s${sIdx}`
        blocks.push(secHead(id))
        for (let eIdx = 0; eIdx < 2; eIdx++) {
          blocks.push(...entry(id, `e${eIdx}`, 1 + Math.floor(rand() * 4)))
        }
      }
      const usable = 80 + Math.floor(rand() * 100)
      const pages = packMockBlocks(blocks, { usableHeight: usable })
      const pageBlocks = pagesOf(blocks, pages)
      for (let p = 0; p < pageBlocks.length - 1; p++) {
        const last = pageBlocks[p][pageBlocks[p].length - 1]
        const pageFill = pageBlocks[p].reduce((sum, b) => sum + b.height, 0)
        if (last.keepWithNext) {
          // Allowed only when the page could not hold the next block at all
          // (near-full pages just before an oversized unit).
          expect(pageFill).toBeGreaterThan(usable * 0.9)
        }
      }
    }
  })
})

// ── Real paper geometry ─────────────────────────────────────────────────────

describe('paper geometry', () => {
  it('computes A4 and letter usable heights from PAPER_SIZES', () => {
    const marginPx = 40
    expect(usablePageHeight(marginPx)).toBe(
      PAPER_SIZES.a4.heightPx - marginPx * 2,
    )
    expect(usablePageHeight(marginPx, 'letter')).toBe(
      PAPER_SIZES.letter.heightPx - marginPx * 2,
    )
    expect(PAPER_SIZES.letter).toMatchObject({ widthPx: 816, heightPx: 1056 })
    expect(CONTINUATION_BORDER_PX).toBe(0.5)
  })

  it('packs a realistic multi-page resume at A4 without stranding headers', () => {
    const blocks: MockBlock[] = [
      { height: 120 },
      ...section('work', [
        { id: 'a', bullets: 7, keywords: true },
        { id: 'b', bullets: 8, keywords: true },
        { id: 'c', bullets: 7, keywords: true },
        { id: 'f', bullets: 6, keywords: true },
        { id: 'g', bullets: 6, keywords: true },
        { id: 'h', bullets: 6, keywords: true },
      ]),
      ...section('projects', [
        { id: 'd', bullets: 7, keywords: true },
        { id: 'e', bullets: 7, keywords: true },
      ]),
      secHead('skills'),
      row('skills'),
      row('skills'),
      row('skills'),
      row('skills'),
      secHead('certificates'),
      row('certificates'),
      row('certificates'),
      row('certificates'),
      row('certificates'),
    ]
    const pages = packMockBlocks(blocks, { usableHeight: usablePageHeight(40) })
    expectFullOrderedCoverage(blocks, pages)
    // 1044px of content against 1043px of usable A4 height.
    expect(pages.length).toBeGreaterThan(1)
    const pageBlocks = pagesOf(blocks, pages)
    for (const page of pageBlocks.slice(0, -1)) {
      const last = page[page.length - 1]
      expect(last.part).not.toBe('sec-head')
      expect(last.part).not.toBe('head')
    }
  })
})
