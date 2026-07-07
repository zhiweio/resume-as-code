/**
 * Compiler: ResumeDocument (new schema) → RenderModel
 */
import type { ResumeDocument, Section } from '../schema'
import type { RenderModel, RenderSection } from '../models'

function getFontFamily(doc: ResumeDocument, langOverride?: string): string {
  const lang = langOverride ?? doc.document.language
  if (
    lang === 'zh-hans' ||
    lang === 'zh-hant-hk' ||
    lang === 'zh-hant-tw' ||
    lang === 'zh'
  ) {
    return "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
  }
  return "'Inter', system-ui, -apple-system, sans-serif"
}

function getDefaultSectionTitle(section: Section, lang: string): string {
  const isZH = lang.startsWith('zh')
  switch (section.type) {
    case 'work':
      return isZH ? '工作经历' : 'Experience'
    case 'education':
      return isZH ? '教育背景' : 'Education'
    case 'projects':
      return isZH ? '项目经历' : 'Projects'
    case 'skills':
      return isZH ? '技术技能' : 'Skills'
    case 'certificates':
      return isZH ? '证书资质' : 'Certifications'
    case 'langAndInterests':
      return isZH ? '语言与兴趣' : 'Languages & Interests'
    case 'awards':
      return isZH ? '获奖荣誉' : 'Awards'
  }
}

function compileSection(section: Section, lang: string): RenderSection | null {
  if (section.visible === false) return null
  const title = section.title ?? getDefaultSectionTitle(section, lang)

  switch (section.type) {
    case 'work':
      return {
        id: section.id,
        title,
        variant: 'entries',
        gap: 9,
        entries: section.items
          .filter((item) => item.visible !== false)
          .map((item, i) => ({
            id: item.id ?? `work-${i}`,
            title: item.name,
            subtitle: item.position,
            startDate: item.startDate,
            endDate: item.endDate,
            bullets: item.summary ?? [],
            keywords: item.keywords ?? [],
          })),
      }

    case 'education':
      return {
        id: section.id,
        title,
        variant: 'entries',
        gap: 6,
        entries: section.items
          .filter((item) => item.visible !== false)
          .map((item, i) => ({
            id: item.id ?? `edu-${i}`,
            title: item.institution,
            subtitle: `${item.degree} · ${item.area}`,
            startDate: item.startDate,
            endDate: item.endDate,
            bullets: item.summary ?? [],
            keywords: [],
          })),
      }

    case 'projects':
      return {
        id: section.id,
        title,
        variant: 'entries',
        gap: 9,
        entries: section.items
          .filter((item) => item.visible !== false)
          .map((item, i) => ({
            id: item.id ?? `proj-${i}`,
            title: item.name,
            subtitle: item.description ?? '',
            startDate: item.startDate,
            endDate: item.endDate,
            bullets: item.summary ?? [],
            keywords: item.keywords ?? [],
          })),
      }

    case 'skills':
      return {
        id: section.id,
        title,
        variant: 'skills',
        skills: section.items
          .filter((item) => item.visible !== false)
          .map((item, i) => ({
            id: item.id ?? `skill-${i}`,
            name: item.name,
            level: item.level ?? '',
            keywords: item.keywords,
          })),
      }

    case 'certificates':
      return {
        id: section.id,
        title,
        variant: 'certificates',
        certificates: section.items
          .filter((item) => item.visible !== false)
          .map((item, i) => ({
            id: item.id ?? `cert-${i}`,
            name: item.name,
            issuer: item.issuer,
            date: item.date,
          })),
      }

    case 'langAndInterests':
      return {
        id: section.id,
        title,
        variant: 'langAndInterests',
        rows: [
          ...section.languages.map((l, i) => ({
            id: l.id ?? `lang-${i}`,
            label: lang.startsWith('zh') ? '语言' : 'Languages',
            value: `${l.language} (${l.fluency})`,
          })),
          ...section.interests.map((item, i) => ({
            id: item.id ?? `int-${i}`,
            label: lang.startsWith('zh') ? '兴趣' : 'Interests',
            value: `${item.name} (${item.keywords.join(', ')})`,
          })),
        ],
      }

    case 'awards':
      return {
        id: section.id,
        title,
        variant: 'awards',
        awards: section.items
          .filter((item) => item.visible !== false)
          .map((item, i) => ({
            id: item.id ?? `award-${i}`,
            name: item.name,
            awarder: item.awarder,
            date: item.date,
            bullets: item.summary ?? [],
          })),
      }
  }
}

/** Extract the last path segment from a URL-like username for display. */
function cleanUsername(username: string): string {
  const trimmed = username.trim().replace(/\/+$/, '')
  if (!trimmed) return username
  try {
    // Prepend scheme if missing so URL parser works
    const url = trimmed.includes('://')
      ? new URL(trimmed)
      : new URL(`https://${trimmed}`)
    const last = url.pathname.split('/').filter(Boolean).pop()
    return last ?? username
  } catch {
    // Not a URL — return as-is
    return username
  }
}

export function compileNewSchema(
  doc: ResumeDocument,
  langOverride?: string,
): RenderModel {
  const lang = langOverride ?? doc.document.language
  const basics = doc.basics

  const contactParts1: string[] = []
  if (basics.phone) contactParts1.push(basics.phone)
  if (basics.email) contactParts1.push(basics.email)

  // profiles can be at basics.profiles or doc.profiles (yamlresume compat)
  const profiles = basics.profiles ?? doc.profiles
  const socialLinks: { label: string; url: string }[] = []
  // Personal website — always first, strip protocol only
  if (basics.url) {
    const displayUrl = basics.url
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '')
    socialLinks.push({ label: displayUrl, url: basics.url })
  }
  if (profiles) {
    for (const p of profiles) {
      socialLinks.push({
        label: `${p.network}: ${cleanUsername(p.username)}`,
        url: p.url,
      })
    }
  }

  let sections: RenderSection[] = doc.sections
    .map((s) => compileSection(s, lang))
    .filter((s): s is RenderSection => s != null)

  // Reorder sections based on explicit order if provided
  if (doc.order && doc.order.length > 0) {
    const sectionsMap = new Map(sections.map((s) => [s.id, s]))
    const ordered: RenderSection[] = []
    for (const key of doc.order) {
      // Skip 'basics' — it's the header, not a section (matches legacy behavior)
      if (key === 'basics') continue
      const section = sectionsMap.get(key)
      if (section) {
        ordered.push(section)
        sectionsMap.delete(key)
      }
    }
    // Append any sections not listed in order
    for (const section of sectionsMap.values()) {
      ordered.push(section)
    }
    sections = ordered
  }

  return {
    lang,
    documentTitle: doc.document.title?.trim() || undefined,
    fontFamily: getFontFamily(doc, lang),
    header: {
      name: basics.name,
      headline: basics.headline ?? '',
      contactLine1: contactParts1.join(' · '),
      contactLine2: '',
      summary: parseSummary(basics.summary),
      socialLinks,
    },
    sections,
  }
}

/** Normalize summary: handles string[], single multiline string, or undefined */
function parseSummary(raw: unknown): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as string[]
  if (typeof raw === 'string') {
    // Split multiline pipe-string into bullet lines
    return raw
      .split('\n')
      .map((l) => l.replace(/^-\s*/, '').trim())
      .filter(Boolean)
  }
  return []
}
