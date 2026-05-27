/**
 * Resume Schema v1 — the new versioned YAML specification owned by resume-builder-app.
 *
 * Top-level areas: schema, document, basics, sections, layout, themeOverrides.
 * Sections is an ordered list of discriminated section objects supporting classic
 * resume sections plus richer variants.
 */

// ── Schema Metadata ─────────────────────────────────────────────────────────

export interface SchemaVersion {
  version: '1.0'
  generator?: string
}

// ── Document Metadata ───────────────────────────────────────────────────────

export interface DocumentMeta {
  title?: string
  language: 'en' | 'zh-hans' | 'zh-hant-hk' | 'zh-hant-tw' | 'es' | 'fr' | 'no'
  createdAt?: string
  updatedAt?: string
}

// ── Basics ──────────────────────────────────────────────────────────────────

export interface Profile {
  id?: string
  network: string
  url: string
  username: string
}

export interface Basics {
  name: string
  headline?: string
  phone?: string
  email?: string
  url?: string
  summary?: string[] | string
  profiles?: Profile[]
}

// ── Section Items ───────────────────────────────────────────────────────────

export interface WorkItem {
  id?: string
  visible?: boolean
  name: string
  position: string
  startDate: string
  endDate?: string
  summary?: string[]
  keywords?: string[]
  priority?: number
  keepWithNext?: boolean
}

export interface EducationItem {
  id?: string
  visible?: boolean
  institution: string
  degree: string
  area: string
  startDate: string
  endDate?: string
  summary?: string[]
  priority?: number
}

export interface ProjectItem {
  id?: string
  visible?: boolean
  name: string
  description?: string
  startDate: string
  endDate?: string
  summary?: string[]
  keywords?: string[]
  priority?: number
  keepWithNext?: boolean
}

export interface SkillItem {
  id?: string
  visible?: boolean
  name: string
  level?: string
  keywords: string[]
}

export interface CertificateItem {
  id?: string
  visible?: boolean
  name: string
  issuer: string
  date: string
}

export interface LanguageItem {
  id?: string
  language: string
  fluency: string
}

export interface InterestItem {
  id?: string
  name: string
  keywords: string[]
}

// ── Section Discriminators ──────────────────────────────────────────────────

export interface WorkSection {
  id: string
  type: 'work'
  title?: string
  visible?: boolean
  items: WorkItem[]
}

export interface EducationSection {
  id: string
  type: 'education'
  title?: string
  visible?: boolean
  items: EducationItem[]
}

export interface ProjectsSection {
  id: string
  type: 'projects'
  title?: string
  visible?: boolean
  items: ProjectItem[]
}

export interface SkillsSection {
  id: string
  type: 'skills'
  title?: string
  visible?: boolean
  items: SkillItem[]
}

export interface CertificatesSection {
  id: string
  type: 'certificates'
  title?: string
  visible?: boolean
  items: CertificateItem[]
}

export interface LanguagesAndInterestsSection {
  id: string
  type: 'langAndInterests'
  title?: string
  visible?: boolean
  languages: LanguageItem[]
  interests: InterestItem[]
}

export type Section =
  | WorkSection
  | EducationSection
  | ProjectsSection
  | SkillsSection
  | CertificatesSection
  | LanguagesAndInterestsSection

// ── Layout ──────────────────────────────────────────────────────────────────

export interface LayoutConfig {
  template?: string
  page?: {
    margins?: { top?: string; left?: string; right?: string; bottom?: string }
    showPageNumbers?: boolean
  }
  typography?: {
    fontSize?: string
    fontFamily?: string
  }
}

// ── Theme Overrides ─────────────────────────────────────────────────────────

export interface ThemeOverrides {
  colors?: Partial<{
    name: string
    sectionHead: string
    entry: string
    body: string
    meta: string
    subtle: string
    rule: string
  }>
  spacing?: Partial<{
    sectionGap: number
    entryGap: number
    lineHeight: number
  }>
}

// ── Root Resume Document ────────────────────────────────────────────────────

export interface ResumeDocument {
  schema: SchemaVersion
  document: DocumentMeta
  basics: Basics
  /** profiles can also appear as a top-level sibling of basics (yamlresume compat) */
  profiles?: Profile[]
  sections: Section[]
  /** Top-level section display order (e.g. ['basics', 'education', 'work', 'projects', 'skills']) */
  order?: string[]
  layout?: LayoutConfig
  themeOverrides?: ThemeOverrides
}
