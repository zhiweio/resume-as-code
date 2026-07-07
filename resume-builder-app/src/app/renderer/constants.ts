/** Design tokens frozen from the Figma Make template baseline. */
export const Colors = {
  name: '#000000',
  sectionHead: '#000000',
  entry: '#111111',
  body: '#333333',
  meta: '#666666',
  subtle: '#999999',
  rule: '#000000',
  ruleLight: '#CCCCCC',
} as const

/** A4 paper dimensions at 96 dpi. */
export const Paper = {
  widthPx: 794,
  heightPx: 1123,
  /** Default uniform margin on all four sides. */
  marginPx: 40,
} as const

/** CSS padding value for the paper content inset. */
export function paperPaddingCss(marginPx = Paper.marginPx): string {
  return `${marginPx}px`
}

/** Inline styles for a strict A4 sheet (794×1123 px at 96 dpi, border-box). */
export function paperSheetStyle(marginPx = Paper.marginPx): {
  width: number
  height: number
  minHeight: number
  padding: string
  boxSizing: 'border-box'
} {
  return {
    width: Paper.widthPx,
    height: Paper.heightPx,
    minHeight: Paper.heightPx,
    padding: paperPaddingCss(marginPx),
    boxSizing: 'border-box',
  }
}

/** Vertical gap between resume sections (and after the header). */
export const SectionSpacing = 9

export function usablePageHeight(marginPx = Paper.marginPx): number {
  return Paper.heightPx - marginPx * 2
}
