import { describe, expect, it } from 'vitest'
import { formatDate, formatDateRange, isChineseLang } from './format-date'

describe('isChineseLang', () => {
  it('detects all Chinese variants', () => {
    expect(isChineseLang('zh')).toBe(true)
    expect(isChineseLang('zh-hans')).toBe(true)
    expect(isChineseLang('zh-hant-tw')).toBe(true)
  })

  it('rejects other languages', () => {
    expect(isChineseLang('en')).toBe(false)
    expect(isChineseLang('es')).toBe(false)
    expect(isChineseLang('')).toBe(false)
  })
})

describe('formatDate', () => {
  it('passes English dates through unchanged for non-Chinese targets', () => {
    expect(formatDate('Sep 1, 2015', 'en')).toBe('Sep 1, 2015')
    expect(formatDate('Nov 2022', 'fr')).toBe('Nov 2022')
    expect(formatDate('2022', 'no')).toBe('2022')
  })

  it('formats full English dates in Chinese', () => {
    expect(formatDate('Sep 1, 2015', 'zh')).toBe('2015年9月1日')
    expect(formatDate('Dec 31, 2024', 'zh-hans')).toBe('2024年12月31日')
  })

  it('formats month-year dates in Chinese', () => {
    expect(formatDate('Nov 2022', 'zh')).toBe('2022年11月')
    expect(formatDate('Jan 2020', 'zh-hant-tw')).toBe('2020年1月')
  })

  it('formats year-only dates in Chinese', () => {
    expect(formatDate('2022', 'zh')).toBe('2022年')
  })

  it('keeps already-Chinese dates intact', () => {
    expect(formatDate('2024年1月', 'zh')).toBe('2024年1月')
    expect(formatDate('2024年1月1日', 'zh')).toBe('2024年1月1日')
  })

  it('passes unrecognised strings through', () => {
    expect(formatDate('Present', 'zh')).toBe('Present')
    expect(formatDate('sometime', 'zh-hans')).toBe('sometime')
  })

  it('handles null, undefined and blank input', () => {
    expect(formatDate(null, 'zh')).toBe('')
    expect(formatDate(undefined, 'en')).toBe('')
    expect(formatDate('   ', 'zh')).toBe('')
  })
})

describe('formatDateRange', () => {
  it('formats ranges in Chinese', () => {
    expect(formatDateRange('Sep 1, 2015', 'Jul 1, 2019', 'zh')).toBe(
      '2015年9月1日 – 2019年7月1日',
    )
  })

  it('keeps raw strings for English', () => {
    expect(formatDateRange('Nov 2022', 'Present', 'en')).toBe(
      'Nov 2022 – Present',
    )
  })

  it('omits the separator when the end is missing', () => {
    expect(formatDateRange('2022', undefined, 'zh')).toBe('2022年')
  })
})
