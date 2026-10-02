import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import { compileNewSchema } from './compile-new-schema'
import { compileLegacy, isLegacyFormat } from './compile-legacy'
import type { ResumeDocument } from '../schema'
import type { LegacyResume } from './compile-legacy'

const fixturePath = new URL(
  '../../fixtures/sample-new-schema.yml',
  import.meta.url,
)
const doc = parse(readFileSync(fixturePath, 'utf8')) as ResumeDocument

const legacyDoc: LegacyResume = {
  locale: { language: 'en' },
  content: {
    basics: {
      name: 'Jane Legacy',
      headline: 'Engineer',
      email: 'jane@example.com',
      summary: '- one\n- two',
    },
    work: [
      {
        name: 'ACME',
        position: 'Engineer',
        startDate: 'Jan 2020',
        endDate: 'Dec 2023',
        summary: '- built things\n- shipped things',
        keywords: ['typescript', 'react'],
      },
    ],
  },
} as unknown as LegacyResume

describe('compileNewSchema', () => {
  it('compiles the sample fixture into a render model', () => {
    const model = compileNewSchema(doc)
    expect(model.header.name).toBe('John Doe')
    expect(model.lang).toBe('en')
    expect(model.documentTitle).toBe('John Doe – Senior Data Engineer')
    expect(model.sections.length).toBeGreaterThan(0)
  })

  it('orders sections by the document order list', () => {
    const model = compileNewSchema(doc)
    const variants = model.sections.map((s) => s.variant)
    const workIdx = variants.indexOf('entries')
    expect(workIdx).toBeGreaterThanOrEqual(0)
    expect(variants).toContain('skills')
  })

  it('defaults paper size to A4 and page numbers off', () => {
    const model = compileNewSchema(doc)
    expect(model.paperSize).toBe('a4')
    expect(model.showPageNumbers).toBe(false)
  })

  it('reads layout.page settings from the YAML', () => {
    const withLayout = {
      ...doc,
      layout: { page: { size: 'letter', showPageNumbers: true } },
    } as ResumeDocument
    const model = compileNewSchema(withLayout)
    expect(model.paperSize).toBe('letter')
    expect(model.showPageNumbers).toBe(true)
  })

  it('falls back to A4 for unknown paper sizes', () => {
    const bad = {
      ...doc,
      layout: { page: { size: 'a3' } },
    } as unknown as ResumeDocument
    expect(compileNewSchema(bad).paperSize).toBe('a4')
  })

  it('honours language override for Chinese resumes', () => {
    const model = compileNewSchema(doc, 'zh-hans')
    expect(model.lang).toBe('zh-hans')
    expect(model.fontFamily).toContain('Noto Sans SC')
  })
})

describe('isLegacyFormat', () => {
  it('detects yamlresume-style documents', () => {
    expect(isLegacyFormat(legacyDoc)).toBe(true)
    expect(isLegacyFormat(doc)).toBe(false)
    expect(isLegacyFormat(null)).toBe(false)
    expect(isLegacyFormat({ content: {} })).toBe(false)
  })
})

describe('compileLegacy', () => {
  it('adapts a legacy document to the render model', () => {
    const model = compileLegacy(legacyDoc)
    expect(model.header.name).toBe('Jane Legacy')
    expect(model.sections.length).toBeGreaterThan(0)
  })

  it('pins A4 and leaves page numbers unset', () => {
    const model = compileLegacy(legacyDoc)
    expect(model.paperSize).toBe('a4')
    expect(model.showPageNumbers).toBeUndefined()
  })

  it('parses markdown-style summary bullets', () => {
    const model = compileLegacy(legacyDoc)
    expect(model.header.summary).toEqual(['one', 'two'])
  })
})
