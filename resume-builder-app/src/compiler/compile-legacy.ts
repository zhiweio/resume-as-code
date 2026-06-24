/**
 * Legacy adapter: yamlresume-style YAML → RenderModel.
 * Detects the legacy shape and produces the normalized render model.
 */
import type { RenderModel, RenderSection } from '../models'

// Shape of a yamlresume-style YAML file (content section)
export interface LegacyContent {
  basics: {
    name: string
    phone?: string
    email?: string
    url?: string
    summary?: string
    profiles?: Array<{ network: string; url: string; username: string }>
  }
  /** profiles can also appear at content level (sibling of basics) in yamlresume */
  profiles?: Array<{ network: string; url: string; username: string }>
  education?: Array<{
    institution: string
    degree: string
    area: string
    startDate: string
    endDate?: string
    summary?: string
  }>
  work?: Array<{
    name: string
    position: string
    startDate: string
    endDate?: string
    summary?: string
    keywords?: string[]
  }>
  projects?: Array<{
    name: string
    description?: string
    startDate: string
    endDate?: string
    summary?: string
    keywords?: string[]
  }>
  skills?: Array<{
    name: string
    level?: string
    keywords: string[]
  }>
  certificates?: Array<{
    name: string
    issuer: string
    date: string
  }>
}

export interface LegacyLayout {
  engine?: string
  sections?: {
    aliases?: Record<string, string>
    order?: string[]
  }
}

export interface LegacyResume {
  locale?: { language?: string }
  layouts?: LegacyLayout[]
  content: LegacyContent
}

/** Detect whether parsed YAML looks like a yamlresume-style document. */
export function isLegacyFormat(obj: unknown): obj is LegacyResume {
  if (typeof obj !== 'object' || obj === null) return false
  const doc = obj as Record<string, unknown>
  return (
    typeof doc.content === 'object' &&
    doc.content !== null &&
    'basics' in (doc.content as Record<string, unknown>)
  )
}

/** Parse summary string (may contain markdown-style bullet list) into lines. */
function parseSummaryBullets(summary: string | undefined): string[] {
  if (!summary) return []
  return summary
    .split('\n')
    .map((line) => line.replace(/^\s*[-•]\s*/, '').trim())
    .filter((line) => line.length > 0)
}

/** Extract the last path segment from a URL-like username for display. */
function cleanUsername(username: string): string {
  const trimmed = username.trim().replace(/\/+$/, '')
  if (!trimmed) return username
  try {
    const url = trimmed.includes('://')
      ? new URL(trimmed)
      : new URL(`https://${trimmed}`)
    const last = url.pathname.split('/').filter(Boolean).pop()
    return last ?? username
  } catch {
    return username
  }
}

export function compileLegacy(
  doc: LegacyResume,
  langOverride?: string,
): RenderModel {
  const lang = langOverride ?? doc.locale?.language ?? 'en'
  const isZH = lang.startsWith('zh')
  const content = doc.content
  const basics = content.basics

  // Extract layout config (order + aliases) from first layout entry
  const layoutSections = doc.layouts?.[0]?.sections
  const order = layoutSections?.order
  const aliases = layoutSections?.aliases ?? {}

  const fontFamily = isZH
    ? "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    : "'Inter', system-ui, -apple-system, sans-serif"

  const contactParts1: string[] = []
  if (basics.phone) contactParts1.push(basics.phone)
  if (basics.email) contactParts1.push(basics.email)

  // profiles can be at content.basics.profiles or content.profiles
  const profiles = basics.profiles ?? content.profiles
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

  // Helper to resolve section title: alias > language default
  const title = (key: string, fallbackZH: string, fallbackEN: string) =>
    aliases[key] ?? (isZH ? fallbackZH : fallbackEN)

  const sectionsMap = new Map<string, RenderSection>()

  // Work
  if (content.work?.length) {
    sectionsMap.set('work', {
      id: 'work',
      title: title('work', '工作经历', 'Experience'),
      variant: 'entries',
      gap: 9,
      entries: content.work.map((job, i) => ({
        id: `work-${i}`,
        title: job.name,
        subtitle: job.position,
        startDate: job.startDate,
        endDate: job.endDate,
        bullets: parseSummaryBullets(job.summary),
        keywords: job.keywords ?? [],
      })),
    })
  }

  // Education
  if (content.education?.length) {
    sectionsMap.set('education', {
      id: 'education',
      title: title('education', '教育背景', 'Education'),
      variant: 'entries',
      gap: 6,
      entries: content.education.map((edu, i) => ({
        id: `edu-${i}`,
        title: edu.institution,
        subtitle: `${edu.degree} · ${edu.area}`,
        startDate: edu.startDate,
        endDate: edu.endDate,
        bullets: parseSummaryBullets(edu.summary),
        keywords: [],
      })),
    })
  }

  // Projects
  if (content.projects?.length) {
    sectionsMap.set('projects', {
      id: 'projects',
      title: title('projects', '项目经历', 'Projects'),
      variant: 'entries',
      gap: 9,
      entries: content.projects.map((proj, i) => ({
        id: `proj-${i}`,
        title: proj.name,
        subtitle: proj.description ?? '',
        startDate: proj.startDate,
        endDate: proj.endDate,
        bullets: parseSummaryBullets(proj.summary),
        keywords: proj.keywords ?? [],
      })),
    })
  }

  // Skills
  if (content.skills?.length) {
    sectionsMap.set('skills', {
      id: 'skills',
      title: title('skills', '专业技能', 'Skills'),
      variant: 'skills',
      skills: content.skills.map((skill, i) => ({
        id: `skill-${i}`,
        name: skill.name,
        level: skill.level ?? '',
        keywords: skill.keywords,
      })),
    })
  }

  // Certificates
  if (content.certificates?.length) {
    sectionsMap.set('certificates', {
      id: 'certificates',
      title: title('certificates', '证书资质', 'Certifications'),
      variant: 'certificates',
      certificates: content.certificates.map((cert, i) => ({
        id: `cert-${i}`,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
      })),
    })
  }

  // Apply order: if order is defined, use it; otherwise use insertion order
  let sections: RenderSection[]
  if (order && order.length > 0) {
    sections = []
    for (const key of order) {
      // Skip 'basics' — it's the header, not a section
      if (key === 'basics') continue
      const section = sectionsMap.get(key)
      if (section) sections.push(section)
    }
    // Append any remaining sections not in order
    for (const [key, section] of sectionsMap) {
      if (!order.includes(key)) sections.push(section)
    }
  } else {
    sections = Array.from(sectionsMap.values())
  }

  return {
    lang,
    fontFamily,
    header: {
      name: basics.name,
      headline: '',
      contactLine1: contactParts1.join(' · '),
      contactLine2: '',
      summary: parseSummaryBullets(basics.summary),
      socialLinks,
    },
    sections,
  }
}
