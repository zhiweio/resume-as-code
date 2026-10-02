import { describe, expect, it } from 'vitest'
import {
  AIRY_PRESET,
  COMPACT_PRESET,
  DEFAULT_LAYOUT_OPTIONS,
  OPTIMIZE_PRESET,
  applyLayoutPreset,
  isLayoutCustomized,
  layoutFromLegacyOptions,
  mergeLayoutOptions,
  resolveLayoutPresetId,
} from './layout-options'

describe('DEFAULT_LAYOUT_OPTIONS', () => {
  it('starts balanced with page numbers off', () => {
    expect(DEFAULT_LAYOUT_OPTIONS).toMatchObject({
      paperSize: 'a4',
      enabled: false,
      spacingScale: 1.0,
      fontScale: 1.0,
      pageMarginPx: 40,
      allowSectionSplit: true,
      allowSubsectionSplit: false,
      showPageNumbers: false,
    })
  })
})

describe('mergeLayoutOptions', () => {
  it('fills missing fields from defaults', () => {
    const merged = mergeLayoutOptions({ spacingScale: 0.9 })
    expect(merged.spacingScale).toBe(0.9)
    expect(merged.paperSize).toBe('a4')
    expect(merged.allowSubsectionSplit).toBe(false)
  })

  it('returns defaults for null/undefined', () => {
    expect(mergeLayoutOptions(null)).toEqual(DEFAULT_LAYOUT_OPTIONS)
  })
})

describe('resolveLayoutPresetId', () => {
  it('resolves every shipped preset', () => {
    expect(resolveLayoutPresetId(DEFAULT_LAYOUT_OPTIONS)).toBe('balanced')
    expect(resolveLayoutPresetId(mergeLayoutOptions(OPTIMIZE_PRESET))).toBe(
      'optimize',
    )
    expect(resolveLayoutPresetId(mergeLayoutOptions(COMPACT_PRESET))).toBe(
      'compact',
    )
    expect(resolveLayoutPresetId(mergeLayoutOptions(AIRY_PRESET))).toBe('airy')
  })

  it('reports custom for any deviation, including paper size', () => {
    expect(
      resolveLayoutPresetId({ ...DEFAULT_LAYOUT_OPTIONS, spacingScale: 0.7 }),
    ).toBe('custom')
    expect(
      resolveLayoutPresetId({ ...DEFAULT_LAYOUT_OPTIONS, paperSize: 'letter' }),
    ).toBe('custom')
    expect(
      resolveLayoutPresetId({
        ...DEFAULT_LAYOUT_OPTIONS,
        showPageNumbers: true,
      }),
    ).toBe('custom')
  })
})

describe('isLayoutCustomized', () => {
  it('ignores session-only toggles that match defaults', () => {
    expect(isLayoutCustomized({ ...DEFAULT_LAYOUT_OPTIONS })).toBe(false)
    expect(
      isLayoutCustomized({ ...DEFAULT_LAYOUT_OPTIONS, pageMarginPx: 30 }),
    ).toBe(true)
  })
})

describe('applyLayoutPreset', () => {
  it('applies compact preset values', () => {
    const layout = applyLayoutPreset('compact')
    expect(layout.spacingScale).toBe(COMPACT_PRESET.spacingScale)
    expect(layout.pageMarginPx).toBe(COMPACT_PRESET.pageMarginPx)
    expect(resolveLayoutPresetId(layout)).toBe('compact')
  })

  it('falls back to defaults for unknown ids', () => {
    expect(applyLayoutPreset('nope' as 'balanced')).toEqual(
      DEFAULT_LAYOUT_OPTIONS,
    )
  })
})

describe('layoutFromLegacyOptions', () => {
  it('prefers an explicit layout object', () => {
    const layout = layoutFromLegacyOptions({
      layout: { pageMarginPx: 48 },
    })
    expect(layout.pageMarginPx).toBe(48)
  })

  it('maps legacy optimize flags', () => {
    const layout = layoutFromLegacyOptions({ optimized: true })
    expect(layout.enabled).toBe(true)
    expect(layout.spacingScale).toBe(OPTIMIZE_PRESET.spacingScale)
    expect(resolveLayoutPresetId(layout)).toBe('optimize')
    // A non-preset scale stays custom.
    expect(
      resolveLayoutPresetId(
        layoutFromLegacyOptions({ optimized: true, spacingScale: 0.75 }),
      ),
    ).toBe('custom')
  })

  it('enables optimization for non-unit spacing scales', () => {
    const layout = layoutFromLegacyOptions({ spacingScale: 1.2 })
    expect(layout.enabled).toBe(true)
    expect(layout.spacingScale).toBe(1.2)
  })

  it('returns defaults otherwise', () => {
    expect(layoutFromLegacyOptions()).toEqual(DEFAULT_LAYOUT_OPTIONS)
  })
})
