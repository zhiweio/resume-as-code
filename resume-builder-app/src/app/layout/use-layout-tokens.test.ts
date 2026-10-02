import { describe, expect, it } from 'vitest'
import { computeLayoutTokens } from './use-layout-tokens'
import { PAPER_SIZES } from '../renderer/constants'
import { TypographyBaseline } from '../renderer/typography-baseline'
import { DEFAULT_LAYOUT_OPTIONS } from './layout-options'

describe('computeLayoutTokens', () => {
  it('computes A4 page geometry at default margins', () => {
    const tokens = computeLayoutTokens(DEFAULT_LAYOUT_OPTIONS)
    expect(tokens.page).toEqual({
      widthPx: 794,
      heightPx: 1123,
      marginPx: 40,
      usableHeight: 1043,
    })
  })

  it('switches page geometry with paper size', () => {
    const tokens = computeLayoutTokens({
      ...DEFAULT_LAYOUT_OPTIONS,
      paperSize: 'letter',
    })
    expect(tokens.page.widthPx).toBe(PAPER_SIZES.letter.widthPx)
    expect(tokens.page.heightPx).toBe(PAPER_SIZES.letter.heightPx)
    expect(tokens.page.usableHeight).toBe(PAPER_SIZES.letter.heightPx - 80)
  })

  it('scales fonts by fontScale', () => {
    const base = computeLayoutTokens(DEFAULT_LAYOUT_OPTIONS)
    const scaled = computeLayoutTokens({
      ...DEFAULT_LAYOUT_OPTIONS,
      fontScale: 1.2,
    })
    expect(scaled.font.name).toBe(
      Math.round(TypographyBaseline.font.name * 1.2),
    )
    expect(scaled.font.name).not.toBe(base.font.name)
  })

  it('scales section and component gaps by their multipliers', () => {
    const tokens = computeLayoutTokens({
      ...DEFAULT_LAYOUT_OPTIONS,
      spacingScale: 2,
      componentSpacingScale: 2,
    })
    expect(tokens.sectionGap(9)).toBe(18)
    expect(tokens.componentGap(5)).toBe(10)
    expect(tokens.spacing.continuationPaddingTop).toBe(
      Math.round(TypographyBaseline.spacing.continuationPaddingTop * 2),
    )
  })

  it('scales line heights to two decimals', () => {
    const tokens = computeLayoutTokens({
      ...DEFAULT_LAYOUT_OPTIONS,
      lineHeightScale: 1.111,
    })
    expect(tokens.lineHeight.body).toBe(
      Math.round(TypographyBaseline.lineHeight.body * 1.111 * 100) / 100,
    )
  })

  it('scales the bullet gap by bulletGapScale', () => {
    const tokens = computeLayoutTokens({
      ...DEFAULT_LAYOUT_OPTIONS,
      bulletGapScale: 2,
    })
    expect(tokens.spacing.bulletMarginBottom).toBe(
      TypographyBaseline.spacing.bulletMarginBottom * 2,
    )
  })
})
