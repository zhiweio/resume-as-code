import type { RenderModel, RenderSection } from '../../models/render-model'
import { Colors, SectionSpacing } from './constants'
import { SecHead, EntryHead, Bullets, Keywords } from './components'
import { PrintStyles } from './PrintStyles'
import { PaginatedPaper } from './PaginatedPaper'
import { inlineMdProps } from './inline-md'
import { formatDate } from './format-date'
import { resolveSocialIcon, type IconifyIconData } from './social-icon-map'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify-icon/react'
import type { ReactNode } from 'react'

/** Lazily loads a Font Awesome Brands icon by network name and renders it inline. */
function SocialIcon({ network }: { network: string }) {
  const [icon, setIcon] = useState<IconifyIconData | null>(null)

  useEffect(() => {
    let cancelled = false
    resolveSocialIcon(network).then((mod) => {
      if (!cancelled && mod) setIcon(mod)
    })
    return () => {
      cancelled = true
    }
  }, [network])

  if (!icon) return null

  return <Icon icon={icon} style={{ width: 10, height: 10, flexShrink: 0 }} />
}

interface ResumeRendererProps {
  model: RenderModel
  /** Whether layout optimization is active */
  optimized?: boolean
  /** Spacing multiplier for optimization (default 1.0) */
  spacingScale?: number
  /** Show Font Awesome brand icons next to social links */
  showSocialIcons?: boolean
}

/**
 * Isolated preview renderer.
 * Consumes the normalized RenderModel and produces the exact Figma Make visual output.
 * This component owns no data-loading logic — it only renders.
 *
 * Pagination strategy:
 * - Sub-sections (one job, project, skill row, etc.) never split across pages.
 * - Sections may span pages only when taller than one A4 page.
 * - Sections that fit on one page are kept together.
 */
export function ResumeRenderer({
  model,
  optimized,
  spacingScale = 1.0,
  showSocialIcons = true,
}: ResumeRendererProps) {
  const { header, sections, fontFamily, lang } = model

  const sectionGap = (base: number) => Math.round(base * spacingScale)

  // Build a flat list of blocks for fine-grained pagination
  const blocks: ReactNode[] = []

  // Block 0: header + summary
  blocks.push(
    <header key="header" className="paginate-block" style={{ marginBottom: 0 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
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
        <div
          style={{
            textAlign: 'right',
            flexShrink: 1,
            paddingTop: 2,
            maxWidth: '50%',
          }}
        >
          <p style={{ fontSize: 9, color: Colors.meta, lineHeight: 1.7 }}>
            {header.contactLine1}
          </p>
          <p
            style={{
              fontSize: 9,
              color: Colors.meta,
              lineHeight: 1.7,
              overflowWrap: 'break-word',
            }}
          >
            {header.socialLinks.map((link, i) => (
              <span key={link.label}>
                {i > 0 && ' · '}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: Colors.meta,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  {showSocialIcons && (
                    <SocialIcon network={link.label.split(':')[0]} />
                  )}
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
      {header.summary.length > 0 && (
        <div style={{ marginTop: sectionGap(9) }}>
          {header.summary.map((s, i) => (
            <p
              key={i}
              className="md-inline"
              style={{ fontSize: 9.5, color: Colors.meta, lineHeight: 1.6 }}
              {...inlineMdProps(s)}
            />
          ))}
        </div>
      )}
    </header>,
  )

  // For each section, emit atomic sub-section blocks
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (!section || !section.variant) continue
    emitSectionBlocks(section, blocks, sectionGap, lang)
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

/** One atomic sub-section block; never splits across pages when printing. */
function subsectionBlock(
  key: string,
  sectionId: string,
  children: ReactNode,
  options: {
    paddingTop?: number
    sectionStart?: boolean
  } = {},
) {
  const { paddingTop = 0, sectionStart = false } = options
  return (
    <div
      key={key}
      className="paginate-block paginate-subsection"
      data-section-id={sectionId}
      data-section-start={sectionStart ? 'true' : undefined}
      style={paddingTop > 0 ? { paddingTop } : undefined}
    >
      {children}
    </div>
  )
}

function sectionLeadPadding(sectionGap: (base: number) => number): number {
  return sectionGap(SectionSpacing)
}

function renderSkillRow(skill: {
  id: string
  name: string
  level: string
  keywords: string[]
}) {
  return (
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
        <span style={{ fontSize: 9.5, fontWeight: 600, color: Colors.entry }}>
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
  )
}

function renderCertificateRow(
  cert: { id: string; name: string; issuer: string; date: string },
  lang: string,
) {
  return (
    <div
      key={cert.id}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 8,
      }}
    >
      <span style={{ fontSize: 9.5, fontWeight: 500, color: Colors.entry }}>
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
        {cert.issuer} · {formatDate(cert.date, lang)}
      </span>
    </div>
  )
}

function renderEntryBody(
  entry: {
    title: string
    subtitle: string
    startDate: string
    endDate?: string
    bullets: string[]
    keywords: string[]
  },
  lang: string,
) {
  return (
    <>
      <EntryHead
        title={entry.title}
        sub={entry.subtitle}
        start={entry.startDate}
        end={entry.endDate}
        lang={lang}
      />
      {entry.bullets.length > 0 && <Bullets items={entry.bullets} />}
      {entry.keywords.length > 0 && <Keywords items={entry.keywords} />}
    </>
  )
}

/** Emit atomic sub-section blocks for a YAML section. */
function emitSectionBlocks(
  section: RenderSection,
  blocks: ReactNode[],
  sectionGap: (base: number) => number,
  lang: string,
) {
  const leadSpacing = {
    paddingTop: sectionLeadPadding(sectionGap),
    sectionStart: true,
  }

  if (section.variant === 'entries') {
    const entries = section.entries
    if (entries.length === 0) {
      blocks.push(
        subsectionBlock(
          section.id,
          section.id,
          <SecHead title={section.title} />,
          leadSpacing,
        ),
      )
      return
    }

    blocks.push(
      subsectionBlock(
        `${section.id}-entry-${entries[0].id}`,
        section.id,
        <>
          <SecHead title={section.title} />
          {renderEntryBody(entries[0], lang)}
        </>,
        leadSpacing,
      ),
    )

    for (let i = 1; i < entries.length; i++) {
      const entry = entries[i]
      blocks.push(
        subsectionBlock(
          `${section.id}-entry-${entry.id}`,
          section.id,
          renderEntryBody(entry, lang),
          { paddingTop: sectionGap(section.gap ?? SectionSpacing) },
        ),
      )
    }
  } else if (section.variant === 'skills') {
    const skills = section.skills
    if (skills.length === 0) {
      blocks.push(
        subsectionBlock(
          section.id,
          section.id,
          <SecHead title={section.title} />,
          leadSpacing,
        ),
      )
      return
    }

    blocks.push(
      subsectionBlock(
        `${section.id}-skill-${skills[0].id}`,
        section.id,
        <>
          <SecHead title={section.title} />
          {renderSkillRow(skills[0])}
        </>,
        leadSpacing,
      ),
    )

    for (let i = 1; i < skills.length; i++) {
      blocks.push(
        subsectionBlock(
          `${section.id}-skill-${skills[i].id}`,
          section.id,
          renderSkillRow(skills[i]),
          { paddingTop: sectionGap(3) },
        ),
      )
    }
  } else if (section.variant === 'certificates') {
    const certificates = section.certificates
    if (certificates.length === 0) {
      blocks.push(
        subsectionBlock(
          section.id,
          section.id,
          <SecHead title={section.title} />,
          leadSpacing,
        ),
      )
      return
    }

    blocks.push(
      subsectionBlock(
        `${section.id}-cert-${certificates[0].id}`,
        section.id,
        <>
          <SecHead title={section.title} />
          {renderCertificateRow(certificates[0], lang)}
        </>,
        leadSpacing,
      ),
    )

    for (let i = 1; i < certificates.length; i++) {
      blocks.push(
        subsectionBlock(
          `${section.id}-cert-${certificates[i].id}`,
          section.id,
          renderCertificateRow(certificates[i], lang),
          { paddingTop: sectionGap(2.5) },
        ),
      )
    }
  } else if (section.variant === 'langAndInterests') {
    const rows = Array.from(
      section.rows.reduce((map, row) => {
        const existing = map.get(row.label)
        if (existing) existing.push(row.value)
        else map.set(row.label, [row.value])
        return map
      }, new Map<string, string[]>()),
    )

    if (rows.length === 0) {
      blocks.push(
        subsectionBlock(
          section.id,
          section.id,
          <SecHead title={section.title} />,
          leadSpacing,
        ),
      )
      return
    }

    const renderLangRow = ([label, values]: [string, string[]]) => (
      <div style={{ display: 'flex', gap: 0, alignItems: 'baseline' }}>
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
    )

    blocks.push(
      subsectionBlock(
        `${section.id}-row-${rows[0][0]}`,
        section.id,
        <>
          <SecHead title={section.title} />
          {renderLangRow(rows[0])}
        </>,
        leadSpacing,
      ),
    )

    for (let i = 1; i < rows.length; i++) {
      blocks.push(
        subsectionBlock(
          `${section.id}-row-${rows[i][0]}`,
          section.id,
          renderLangRow(rows[i]),
          { paddingTop: sectionGap(3) },
        ),
      )
    }
  } else if (section.variant === 'awards') {
    const awards = section.awards
    if (awards.length === 0) {
      blocks.push(
        subsectionBlock(
          section.id,
          section.id,
          <SecHead title={section.title} />,
          leadSpacing,
        ),
      )
      return
    }

    blocks.push(
      subsectionBlock(
        `${section.id}-award-${awards[0].id}`,
        section.id,
        <>
          <SecHead title={section.title} />
          <EntryHead
            title={awards[0].name}
            sub={awards[0].awarder}
            start={awards[0].date}
            lang={lang}
          />
          {awards[0].bullets.length > 0 && (
            <Bullets items={awards[0].bullets} />
          )}
        </>,
        leadSpacing,
      ),
    )

    for (let i = 1; i < awards.length; i++) {
      const award = awards[i]
      blocks.push(
        subsectionBlock(
          `${section.id}-award-${award.id}`,
          section.id,
          <>
            <EntryHead
              title={award.name}
              sub={award.awarder}
              start={award.date}
              lang={lang}
            />
            {award.bullets.length > 0 && <Bullets items={award.bullets} />}
          </>,
          { paddingTop: sectionGap(SectionSpacing) },
        ),
      )
    }
  }
}
