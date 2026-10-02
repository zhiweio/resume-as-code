import { describe, expect, it } from 'vitest'
import { buildContentDisposition, buildExportFilename } from './build-filename'
import type { RenderModel } from '../models'

function model(overrides: Partial<RenderModel> = {}): RenderModel {
  return {
    lang: 'en',
    fontFamily: 'Inter',
    paperSize: 'a4',
    header: {
      name: 'John Doe',
      headline: '',
      contactLine1: '',
      contactLine2: '',
      summary: [],
      socialLinks: [],
    },
    sections: [],
    ...overrides,
  }
}

describe('buildExportFilename', () => {
  it('joins name, language, and title with underscores', () => {
    expect(
      buildExportFilename(model({ documentTitle: 'Senior Engineer Resume' })),
    ).toBe('John Doe_en_Senior Engineer Resume.pdf')
  })

  it('falls back to resume.pdf with no usable metadata', () => {
    expect(
      buildExportFilename(
        model({ header: { ...model().header, name: '' }, lang: '' }),
      ),
    ).toBe('resume.pdf')
  })

  it('sanitizes filesystem-hostile characters', () => {
    expect(
      buildExportFilename(model({ documentTitle: 'a/b:c*d?"e<f>g|h' })),
    ).toBe('John Doe_en_a-b-c-d--e-f-g-h.pdf')
  })

  it('truncates very long basenames', () => {
    const filename = buildExportFilename(
      model({ documentTitle: 'x'.repeat(300) }),
    )
    expect(filename.length).toBeLessThanOrEqual(180 + '.pdf'.length)
    expect(filename.endsWith('.pdf')).toBe(true)
  })
})

describe('buildContentDisposition', () => {
  it('provides an ASCII fallback plus RFC 5987 encoding', () => {
    const value = buildContentDisposition('王小明_zh_简历.pdf')
    expect(value).toContain('attachment;')
    expect(value).toContain('filename="____zh___.pdf"')
    expect(value).toContain(
      `filename*=UTF-8''${encodeURIComponent('王小明_zh_简历.pdf')}`,
    )
  })

  it('keeps ASCII filenames readable in both fields', () => {
    const value = buildContentDisposition('John Doe_en.pdf')
    expect(value).toContain('filename="John Doe_en.pdf"')
  })
})
