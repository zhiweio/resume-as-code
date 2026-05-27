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

  const contactParts2: string[] = []
  if (basics.url) contactParts2.push(basics.url)
  // profiles can be at basics.profiles or doc.profiles (yamlresume compat)
  const profiles = basics.profiles ?? doc.profiles
  if (profiles) {
    contactParts2.push(...profiles.map((p) => p.username))
  }

  let sections: RenderSection[] = doc.sections
    .map((s) => compileSection(s, lang))
    .filter((s): s is RenderSection => s != null)

  // Reorder sections based on explicit order if provided
  if (doc.order && doc.order.length > 0) {
    const orderMap = new Map(doc.order.map((id, idx) => [id, idx]))
    sections.sort((a, b) => {
      const ai = orderMap.get(a.id) ?? 999
      const bi = orderMap.get(b.id) ?? 999
      return ai - bi
    })
  }

  return {
    fontFamily: getFontFamily(doc, lang),
    header: {
      name: basics.name,
      headline: basics.headline ?? '',
      contactLine1: contactParts1.join(' · '),
      contactLine2: contactParts2.join(' · '),
      summary: parseSummary(basics.summary),
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
