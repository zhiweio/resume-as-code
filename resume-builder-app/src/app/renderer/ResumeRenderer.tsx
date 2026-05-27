import type { RenderModel, RenderSection } from '../../models/render-model'
import { Colors } from './constants'
import { SecHead, EntryHead, Bullets, Keywords } from './components'
import { PrintStyles } from './PrintStyles'
import { PaginatedPaper } from './PaginatedPaper'
import type { ReactNode } from 'react'

interface ResumeRendererProps {
  model: RenderModel
  /** Whether layout optimization is active */
  optimized?: boolean
  /** Spacing multiplier for optimization (default 1.0) */
  spacingScale?: number
}

/**
 * Isolated preview renderer.
 * Consumes the normalized RenderModel and produces the exact Figma Make visual output.
 * This component owns no data-loading logic — it only renders.
 *
 * Pagination strategy: each top-level child passed to PaginatedPaper is a splittable
 * block. We emit fine-grained blocks so pagination can break between entries within
 * a section. Rule: SecHead + first item are kept together; subsequent items are
 * independent blocks.
 */
export function ResumeRenderer({
  model,
  optimized,
  spacingScale = 1.0,
}: ResumeRendererProps) {
  const { header, sections, fontFamily } = model

  const sectionGap = (base: number) => Math.round(base * spacingScale)

  // Build a flat list of blocks for fine-grained pagination
  const blocks: ReactNode[] = []

  // Block 0: header + summary
  blocks.push(
    <header key="header" style={{ marginBottom: 0 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: Colors.name,
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}
          >
            {header.name}
          </p>
          <p
            style={{
              fontSize: 10.5,
              color: Colors.meta,
              marginTop: 3,
              lineHeight: 1.3,
            }}
          >
            {header.headline}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, paddingTop: 2 }}>
          <p style={{ fontSize: 9, color: Colors.meta, lineHeight: 1.7 }}>
            {header.contactLine1}
          </p>
          <p style={{ fontSize: 9, color: Colors.meta, lineHeight: 1.7 }}>
            {header.contactLine2}
          </p>
        </div>
      </div>
      {header.summary.length > 0 && (
        <div style={{ marginTop: sectionGap(9) }}>
          {header.summary.map((s, i) => (
            <p
              key={i}
              style={{ fontSize: 9.5, color: Colors.meta, lineHeight: 1.6 }}
            >
              {s}
            </p>
          ))}
        </div>
      )}
    </header>,
  )

  // For each section, emit fine-grained blocks
  for (const section of sections) {
    if (!section || !section.variant) continue
    emitSectionBlocks(section, blocks, sectionGap)
  }

  return (
    <>
      <PrintStyles />
      <PaginatedPaper
        fontFamily={fontFamily}
        optimized={optimized}
        spacingScale={spacingScale}
      >
        {blocks}
      </PaginatedPaper>
    </>
  )
}

/** Emit pagination blocks for a section with fine-grained splitting. */
function emitSectionBlocks(
  section: RenderSection,
  blocks: ReactNode[],
  sectionGap: (base: number) => number,
) {
  if (section.variant === 'entries') {
    const entries = section.entries
    if (entries.length === 0) {
      // Just the section header
      blocks.push(
        <div key={section.id}>
          <SecHead title={section.title} />
        </div>,
      )
      return
    }

    // Block: SecHead + first entry (keep together to avoid orphaned header)
    blocks.push(
      <div key={`${section.id}-head`}>
        <SecHead title={section.title} />
        <div className="resume-entry">
          <EntryHead
            title={entries[0].title}
            sub={entries[0].subtitle}
            start={entries[0].startDate}
            end={entries[0].endDate}
          />
          {entries[0].bullets.length > 0 && (
            <Bullets items={entries[0].bullets} />
          )}
          {entries[0].keywords.length > 0 && (
            <Keywords items={entries[0].keywords} />
          )}
        </div>
      </div>,
    )

    // Subsequent entries: each is an independent block
    for (let i = 1; i < entries.length; i++) {
      const entry = entries[i]
      blocks.push(
        <div
          key={`${section.id}-entry-${entry.id}`}
          className="resume-entry"
          style={{ marginTop: sectionGap(section.gap ?? 9) }}
        >
          <EntryHead
            title={entry.title}
            sub={entry.subtitle}
            start={entry.startDate}
            end={entry.endDate}
          />
          {entry.bullets.length > 0 && <Bullets items={entry.bullets} />}
          {entry.keywords.length > 0 && <Keywords items={entry.keywords} />}
        </div>,
      )
    }
  } else if (section.variant === 'skills') {
    // Skills section is compact — keep header + all skills together
    blocks.push(
      <div key={section.id}>
        <SecHead title={section.title} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: sectionGap(3),
          }}
        >
          {section.skills.map((skill) => (
            <div
              key={skill.id}
              style={{ display: 'flex', gap: 0, alignItems: 'baseline' }}
            >
              <div
                style={{
                  width: 196,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    color: Colors.entry,
                  }}
                >
                  {skill.name}
                </span>
                <span style={{ fontSize: 8, color: Colors.subtle }}>
                  ({skill.level})
                </span>
              </div>
              <p
                style={{
                  fontSize: 9,
                  color: Colors.meta,
                  lineHeight: 1.45,
                  flex: 1,
                }}
              >
                {skill.keywords.join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </div>,
    )
  } else if (section.variant === 'certificates') {
    // Certificates are compact — keep together
    blocks.push(
      <div key={section.id}>
        <SecHead title={section.title} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: sectionGap(2.5),
          }}
        >
          {section.certificates.map((cert) => (
            <div
              key={cert.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 500,
                  color: Colors.entry,
                }}
              >
                {cert.name}
              </span>
              <span
                style={{
                  fontSize: 8.5,
                  color: Colors.subtle,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {cert.issuer} · {cert.date}
              </span>
            </div>
          ))}
        </div>
      </div>,
    )
  } else if (section.variant === 'langAndInterests') {
    // Lang & Interests are compact — keep together
    blocks.push(
      <div key={section.id}>
        <SecHead title={section.title} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: sectionGap(3),
          }}
        >
          {Array.from(
            section.rows.reduce((map, row) => {
              const existing = map.get(row.label)
              if (existing) existing.push(row.value)
              else map.set(row.label, [row.value])
              return map
            }, new Map<string, string[]>()),
          ).map(([label, values]) => (
            <div
              key={label}
              style={{ display: 'flex', gap: 0, alignItems: 'baseline' }}
            >
              <span
                style={{
                  width: 80,
                  flexShrink: 0,
                  fontSize: 8.5,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: Colors.meta,
                }}
              >
                {label}
              </span>
              <span style={{ fontSize: 9.5, color: Colors.body }}>
                {values.join(' · ')}
              </span>
            </div>
          ))}
        </div>
      </div>,
    )
  }
}
