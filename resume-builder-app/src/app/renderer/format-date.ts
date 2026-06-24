/**
 * Locale-aware date formatting for resume display.
 *
 * Accepts the raw date strings stored in YAML resume files and formats them
 * for the target language.  Input can be:
 *
 *   - "Sep 1, 2015" / "Jul 1, 2019"   (full date with day)
 *   - "Dec 2022" / "Nov 2022"          (month + year)
 *   - "2022"                            (year only)
 *   - "2024年1月"                       (already Chinese)
 *   - any other free-form string        (returned as-is)
 */

const EN_MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
}

/** Try to parse a raw date string into { year, month?, day? }. Returns null if unrecognised. */
function parseDateParts(
  raw: string,
): { year: number; month?: number; day?: number } | null {
  if (!raw) return null
  const s = raw.trim()

  // Already Chinese: "2024年1月" or "2024年1月1日"
  const zhMatch = s.match(/^(\d{4})年(\d{1,2})月(?:(\d{1,2})[日号])?$/)
  if (zhMatch) {
    return {
      year: +zhMatch[1],
      month: +zhMatch[2],
      day: zhMatch[3] ? +zhMatch[3] : undefined,
    }
  }

  // Year only: "2022"
  if (/^\d{4}$/.test(s)) return { year: +s }

  // "Sep 1, 2015" or "Sep 2015"
  const enMatch = s.match(/^([A-Za-z]+)\s+(?:(\d{1,2}),?\s+)?(\d{4})$/)
  if (enMatch) {
    const m = EN_MONTHS[enMatch[1].toLowerCase().slice(0, 3)]
    if (m) {
      return {
        year: +enMatch[3],
        month: m,
        day: enMatch[2] ? +enMatch[2] : undefined,
      }
    }
  }

  return null
}

/** Check if the target language is Chinese. */
export function isChineseLang(lang: string): boolean {
  return lang.startsWith('zh')
}

/**
 * Format a raw date string for display in the target language.
 *
 * - Chinese:  "2015年9月1日" / "2022年12月" / "2022年"
 * - English:  returns the original string unchanged (already English)
 */
export function formatDate(raw: unknown, lang: string): string {
  if (raw == null) return ''
  const s = String(raw).trim()
  if (!s) return ''
  if (!isChineseLang(lang)) return s

  const parts = parseDateParts(s)
  if (!parts) return s // unrecognised format — pass through

  let result = `${parts.year}年`
  if (parts.month != null) {
    result += `${parts.month}月`
    if (parts.day != null) {
      result += `${parts.day}日`
    }
  }
  return result
}

/**
 * Format a date range (start – end) for display.
 *
 * - Chinese:  uses " – " as separator, formats each date
 * - English:  returns raw strings joined with " – "
 */
export function formatDateRange(
  start: string,
  end: string | undefined,
  lang: string,
): string {
  const s = formatDate(start, lang)
  if (!end) return s
  const e = formatDate(end, lang)
  return `${s} – ${e}`
}
