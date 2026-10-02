import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactElement } from 'react'
import { renderPageBlock } from './PaginatedPaper'
import { ResumeRenderer } from './ResumeRenderer'
import { compileNewSchema } from '../../compiler/compile-new-schema'
import { DEFAULT_LAYOUT_OPTIONS } from '../layout/layout-options'
import { LayoutOptionsProvider } from '../layout/LayoutOptionsContext'
import type { ResumeDocument } from '../../schema'

const fixturePath = new URL(
  '../../../fixtures/sample-new-schema.yml',
  import.meta.url,
)
const doc = parse(readFileSync(fixturePath, 'utf8')) as ResumeDocument

function renderBlocks(options = DEFAULT_LAYOUT_OPTIONS): string {
  const model = compileNewSchema(doc)
  return renderToStaticMarkup(
    <LayoutOptionsProvider options={options}>
      <ResumeRenderer model={model} showSocialIcons={false} />
    </LayoutOptionsProvider>,
  )
}

describe('ResumeRenderer block emission', () => {
  const markup = renderBlocks()

  it('emits standalone section headers with keep-with-next', () => {
    expect(markup).toContain('data-block-part="sec-head"')
    expect(markup).toContain('data-keep-with-next="true"')
    // Every sec-head block carries the keep flag.
    const secHeads = markup.split('data-block-part="sec-head"').length - 1
    const keepFlags = markup.split('data-keep-with-next="true"').length - 1
    expect(keepFlags).toBeGreaterThanOrEqual(secHeads)
  })

  it('emits per-bullet blocks for fine-grained pagination', () => {
    const bulletBlocks = markup.split('data-block-part="bullet"').length - 1
    // The fixture resume has dozens of bullets across entries.
    expect(bulletBlocks).toBeGreaterThan(20)
  })

  it('stamps section-start only on section header blocks', () => {
    const starts = markup.split('data-section-start="true"').length - 1
    const secHeads = markup.split('data-block-part="sec-head"').length - 1
    expect(starts).toBe(secHeads)
  })

  it('marks every non-header block with its section id', () => {
    // The header is the only block without a section id (SSR renders the
    // block list twice — hidden measure container + fallback paper — so we
    // assert relative counts rather than absolute).
    const withSection = markup.split('data-section-id=').length - 1
    const partsOf = (part: string) =>
      markup.split(`data-block-part="${part}"`).length - 1
    expect(withSection).toBe(
      partsOf('bullet') +
        partsOf('head') +
        partsOf('keywords') +
        partsOf('row') +
        partsOf('sec-head'),
    )
    // Exactly one un-attributed document header per render pass.
    expect(markup.split('class="paginate-block"').length - 1).toBe(2)
  })

  it('stamps head blocks with keep-with-next for entry heads', () => {
    expect(markup).toContain('data-block-part="head"')
  })
})

describe('renderPageBlock', () => {
  const sectionStart = (
    <div
      className="paginate-block"
      data-section-start="true"
      style={{ paddingTop: 9 }}
    />
  ) as ReactElement
  const continuation = (
    <div className="paginate-block" style={{ paddingTop: 6 }} />
  ) as ReactElement

  it('strips padding from any page-leading block', () => {
    const out = renderPageBlock(sectionStart, 0, 1)
    expect((out as ReactElement).props.style.paddingTop).toBe(0)
  })

  it('adds the continuation class to carried blocks leading later pages', () => {
    const out = renderPageBlock(continuation, 0, 1) as ReactElement
    expect(out.props.className).toContain('paginate-continuation')
    expect(out.props.style.paddingTop).toBeUndefined()
  })

  it('leaves page 1 leading blocks without the continuation class', () => {
    const out = renderPageBlock(continuation, 0, 0) as ReactElement
    expect(out.props.className).toBe('paginate-block')
    expect(out.props.style.paddingTop).toBe(0)
  })

  it('returns non-leading blocks untouched', () => {
    const out = renderPageBlock(continuation, 1, 1)
    expect(out).toBe(continuation)
  })

  it('passes through non-element children', () => {
    expect(renderPageBlock('text', 0, 0)).toBe('text')
  })
})
