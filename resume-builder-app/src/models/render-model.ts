/**
 * Normalized render model — the single input contract for the resume renderer.
 * Both new-schema YAML and legacy yamlresume-style YAML must compile into this
 * model before preview or export. No legacy assumptions leak past this boundary.
 */

// ── Header ──────────────────────────────────────────────────────────────────

export interface RenderSocialLink {
  label: string
  url: string
}

export interface RenderHeader {
  name: string
  headline: string
  contactLine1: string
  contactLine2: string
  summary: string[]
  socialLinks: RenderSocialLink[]
}

// ── Section Variants ────────────────────────────────────────────────────────

export interface RenderEntry {
  id: string
  title: string
  subtitle: string
  startDate: string
  endDate?: string
  bullets: string[]
  keywords: string[]
}

export interface RenderSkill {
  id: string
  name: string
  level: string
  keywords: string[]
}

export interface RenderCertificate {
  id: string
  name: string
  issuer: string
  date: string
}

export interface RenderAward {
  id: string
  name: string
  awarder: string
  date: string
  bullets: string[]
}

export interface RenderLabelRow {
  id: string
  label: string
  value: string
}

export interface EntriesSection {
  id: string
  title: string
  variant: 'entries'
  gap?: number
  entries: RenderEntry[]
}

export interface SkillsSection {
  id: string
  title: string
  variant: 'skills'
  skills: RenderSkill[]
}

export interface CertificatesSection {
  id: string
  title: string
  variant: 'certificates'
  certificates: RenderCertificate[]
}

export interface LangAndInterestsSection {
  id: string
  title: string
  variant: 'langAndInterests'
  rows: RenderLabelRow[]
}

export interface AwardsSection {
  id: string
  title: string
  variant: 'awards'
  awards: RenderAward[]
}

export type RenderSection =
  | EntriesSection
  | SkillsSection
  | CertificatesSection
  | LangAndInterestsSection
  | AwardsSection

// ── Root Model ──────────────────────────────────────────────────────────────

/** Physical paper size, shared by the schema, compiler, and renderer layers. */
export type PaperSizeId = 'a4' | 'letter'

/** Fallback used whenever a paper size is absent or fails validation. */
export const DEFAULT_PAPER_SIZE: PaperSizeId = 'a4'

/** tracks the valid paper size IDs for runtime validation; see PAPER_SIZE_IDS below */
const PAPER_SIZE_ID_WITNESS: Record<PaperSizeId, true> = {
  a4: true,
  letter: true,
}

/** Runtime-checkable list of every valid PaperSizeId, for input validation. */
export const PAPER_SIZE_IDS = Object.keys(
  PAPER_SIZE_ID_WITNESS,
) as PaperSizeId[]

export interface RenderModel {
  /** BCP 47 language tag (e.g. 'en', 'zh-hans', 'zh', 'es', 'fr', 'no') */
  lang: string
  /** Optional document title from YAML `document.title` */
  documentTitle?: string
  /** Font family CSS value for the resume */
  fontFamily: string
  /** Physical paper size from YAML `layout.page.size`, defaults to 'a4' at the compiler boundary. */
  paperSize: PaperSizeId
  header: RenderHeader
  sections: RenderSection[]
}
