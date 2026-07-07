/** UI-driven layout optimization options for preview and PDF export. */
export interface LayoutOptions {
  /** Whether layout optimization mode is active. */
  enabled: boolean
  /** Macro gaps between sections and entries (0.7–1.3). */
  spacingScale: number
  /** Global font size multiplier (0.85–1.15). */
  fontScale: number
  /** Global line-height multiplier (0.9–1.2). */
  lineHeightScale: number
  /** Bullet list item vertical gap multiplier (0.7–1.3). */
  bulletGapScale: number
  /** A4 content inset on all four sides in px (24–56). */
  pageMarginPx: number
  /** SecHead / EntryHead / Keywords internal spacing multiplier (0.7–1.3). */
  componentSpacingScale: number
  /** When false, never split a section across pages. */
  allowSectionSplit: boolean
  /** When true, split entries into head / bullets / keywords blocks. */
  allowSubsectionSplit: boolean
}

export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
  enabled: false,
  spacingScale: 1.0,
  fontScale: 1.0,
  lineHeightScale: 1.0,
  bulletGapScale: 1.0,
  pageMarginPx: 40,
  componentSpacingScale: 1.0,
  allowSectionSplit: true,
  allowSubsectionSplit: false,
}

export const OPTIMIZE_PRESET: Partial<LayoutOptions> = {
  enabled: true,
  spacingScale: 0.85,
}

export const COMPACT_PRESET: Partial<LayoutOptions> = {
  enabled: true,
  spacingScale: 0.8,
  fontScale: 0.95,
  lineHeightScale: 0.95,
  bulletGapScale: 0.85,
  pageMarginPx: 32,
  componentSpacingScale: 0.85,
  allowSectionSplit: true,
  allowSubsectionSplit: false,
}

export const AIRY_PRESET: Partial<LayoutOptions> = {
  enabled: true,
  spacingScale: 1.15,
  fontScale: 1.05,
  lineHeightScale: 1.1,
  bulletGapScale: 1.15,
  pageMarginPx: 48,
  componentSpacingScale: 1.1,
  allowSectionSplit: true,
  allowSubsectionSplit: false,
}

export type LayoutPresetId =
  | 'balanced'
  | 'compact'
  | 'optimize'
  | 'airy'
  | 'custom'

const PRESET_MATCHERS: Array<{
  id: Exclude<LayoutPresetId, 'custom'>
  partial: Partial<LayoutOptions>
}> = [
  { id: 'balanced', partial: DEFAULT_LAYOUT_OPTIONS },
  {
    id: 'optimize',
    partial: { ...DEFAULT_LAYOUT_OPTIONS, ...OPTIMIZE_PRESET },
  },
  { id: 'compact', partial: { ...DEFAULT_LAYOUT_OPTIONS, ...COMPACT_PRESET } },
  { id: 'airy', partial: { ...DEFAULT_LAYOUT_OPTIONS, ...AIRY_PRESET } },
]

function layoutsEqual(a: LayoutOptions, b: LayoutOptions): boolean {
  return (
    a.enabled === b.enabled &&
    a.spacingScale === b.spacingScale &&
    a.fontScale === b.fontScale &&
    a.lineHeightScale === b.lineHeightScale &&
    a.bulletGapScale === b.bulletGapScale &&
    a.pageMarginPx === b.pageMarginPx &&
    a.componentSpacingScale === b.componentSpacingScale &&
    a.allowSectionSplit === b.allowSectionSplit &&
    a.allowSubsectionSplit === b.allowSubsectionSplit
  )
}

export function resolveLayoutPresetId(layout: LayoutOptions): LayoutPresetId {
  for (const { id, partial } of PRESET_MATCHERS) {
    if (layoutsEqual(layout, mergeLayoutOptions(partial))) return id
  }
  return 'custom'
}

export function isLayoutCustomized(layout: LayoutOptions): boolean {
  return !layoutsEqual(layout, DEFAULT_LAYOUT_OPTIONS)
}

export function applyLayoutPreset(
  presetId: Exclude<LayoutPresetId, 'custom'>,
): LayoutOptions {
  const match = PRESET_MATCHERS.find((entry) => entry.id === presetId)
  if (!match) return { ...DEFAULT_LAYOUT_OPTIONS }
  return mergeLayoutOptions(match.partial)
}

export function mergeLayoutOptions(
  partial?: Partial<LayoutOptions> | null,
): LayoutOptions {
  if (!partial) return { ...DEFAULT_LAYOUT_OPTIONS }
  return { ...DEFAULT_LAYOUT_OPTIONS, ...partial }
}

/** Backward-compat: derive layout from legacy export flags. */
export function layoutFromLegacyOptions(options?: {
  optimized?: boolean
  spacingScale?: number
  layout?: Partial<LayoutOptions>
}): LayoutOptions {
  if (options?.layout) {
    return mergeLayoutOptions(options.layout)
  }
  if (options?.optimized) {
    return mergeLayoutOptions({
      ...OPTIMIZE_PRESET,
      spacingScale: options.spacingScale ?? OPTIMIZE_PRESET.spacingScale,
    })
  }
  if (options?.spacingScale !== undefined && options.spacingScale !== 1.0) {
    return mergeLayoutOptions({
      enabled: true,
      spacingScale: options.spacingScale,
    })
  }
  return { ...DEFAULT_LAYOUT_OPTIONS }
}
