import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PACK_OPTIONS,
  packMockBlocks,
  USABLE_HEIGHT,
} from './paginate-pack'
import { usablePageHeight } from './constants'

describe('packMockBlocks', () => {
  it('packs a single header block on one page', () => {
    const pages = packMockBlocks([{ height: 200 }])
    expect(pages).toEqual([{ startIdx: 0, endIdx: 1 }])
  })

  it('keeps a section together when it fits remaining space', () => {
    const pages = packMockBlocks([
      { height: 200 },
      { height: 300, sectionId: 'work' },
      { height: 200, sectionId: 'work' },
    ])
    expect(pages).toEqual([{ startIdx: 0, endIdx: 3 }])
  })

  it('splits subsections greedily when section does not fit remaining space', () => {
    const pages = packMockBlocks([
      { height: 800 },
      { height: 150, sectionId: 'projects' },
      { height: 150, sectionId: 'projects' },
    ])
    expect(pages).toEqual([
      { startIdx: 0, endIdx: 2 },
      { startIdx: 2, endIdx: 3 },
    ])
  })

  it('moves entire section to next page when section split is disabled', () => {
    const pages = packMockBlocks(
      [
        { height: 800 },
        { height: 150, sectionId: 'projects' },
        { height: 150, sectionId: 'projects' },
      ],
      { allowSectionSplit: false },
    )
    expect(pages).toEqual([
      { startIdx: 0, endIdx: 1 },
      { startIdx: 1, endIdx: 3 },
    ])
  })

  it('uses custom usable height from margin changes', () => {
    const marginPx = 56
    const usableHeight = usablePageHeight(marginPx)
    expect(usableHeight).toBe(1123 - marginPx * 2)

    const pages = packMockBlocks(
      [{ height: usableHeight - 10 }, { height: 50, sectionId: 'work' }],
      { usableHeight },
    )
    expect(pages).toEqual([
      { startIdx: 0, endIdx: 1 },
      { startIdx: 1, endIdx: 2 },
    ])
  })

  it('matches default usable height constant', () => {
    expect(DEFAULT_PACK_OPTIONS.usableHeight).toBe(USABLE_HEIGHT)
    expect(USABLE_HEIGHT).toBe(1043)
  })

  it('packs decomposed entry parts independently', () => {
    const pages = packMockBlocks([
      { height: 900, sectionId: 'projects', subsectionId: 'p1-head' },
      { height: 120, sectionId: 'projects', subsectionId: 'p1-bullets' },
      { height: 40, sectionId: 'projects', subsectionId: 'p1-keywords' },
    ])
    expect(pages).toEqual([
      { startIdx: 0, endIdx: 2 },
      { startIdx: 2, endIdx: 3 },
    ])
  })
})
