import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

// Normalize single-tilde strikethrough (`~text~`) to GFM double-tilde (`~~text~~`)
// so marked renders it. Skip patterns already using `~~`.
const SINGLE_TILDE_RE = /(^|[^~])~(?!~)([^~\n]+?)~(?!~)/g

function normalize(text: string): string {
  return text.replace(SINGLE_TILDE_RE, (_, lead, body) => `${lead}~~${body}~~`)
}

/** Render a single line of markdown to inline HTML (no `<p>` wrapper, no block elements). */
export function renderInlineMd(text: string): string {
  return marked.parseInline(normalize(text), { async: false }) as string
}

/** Props bag for spreading on an inline element to render markdown via `dangerouslySetInnerHTML`. */
export function inlineMdProps(text: string) {
  return { dangerouslySetInnerHTML: { __html: renderInlineMd(text) } }
}
