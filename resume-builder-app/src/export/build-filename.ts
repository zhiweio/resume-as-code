import type { RenderModel } from '../models'

const FALLBACK_FILENAME = 'resume.pdf'
const MAX_BASENAME_LENGTH = 180

/** Strip characters that are invalid in file names on common desktop OSes. */
function sanitizeFilenamePart(value: string): string {
  return value
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Build a PDF filename from resume metadata.
 * Combines name, language, and document title when present; falls back to resume.pdf.
 */
export function buildExportFilename(model: RenderModel): string {
  const parts: string[] = []

  const name = sanitizeFilenamePart(model.header.name ?? '')
  if (name) parts.push(name)

  const lang = sanitizeFilenamePart(model.lang ?? '')
  if (lang) parts.push(lang)

  const title = sanitizeFilenamePart(model.documentTitle ?? '')
  if (title) parts.push(title)

  if (parts.length === 0) return FALLBACK_FILENAME

  const basename = parts.join('_')
  if (!basename) return FALLBACK_FILENAME

  const truncated =
    basename.length > MAX_BASENAME_LENGTH
      ? basename.slice(0, MAX_BASENAME_LENGTH).trim()
      : basename

  return truncated ? `${truncated}.pdf` : FALLBACK_FILENAME
}

/** RFC 5987 Content-Disposition value for downloads with non-ASCII filenames. */
export function buildContentDisposition(filename: string): string {
  const asciiFallback =
    filename.replace(/[^\x20-\x7E]/g, '_').replace(/"/g, '') ||
    FALLBACK_FILENAME
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`
}
