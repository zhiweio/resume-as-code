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
import {
  DEFAULT_LAYOUT_OPTIONS,
  type LayoutOptions,
} from '../layout/layout-options'
import { LayoutOptionsProvider } from '../layout/LayoutOptionsContext'
import { useLayoutTokensContext } from '../layout/LayoutOptionsContext'

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
  layout?: LayoutOptions
  /** @deprecated Use layout.enabled */
  optimized?: boolean
  /** @deprecated Use layout.spacingScale */
  spacingScale?: number
  showSocialIcons?: boolean
}

export function ResumeRenderer({
  model,
  layout,
  optimized,
  spacingScale,
  showSocialIcons = true,
}: ResumeRendererProps) {
  const resolvedLayout =
    layout ??
    (optimized || spacingScale !== undefined
      ? {
          ...DEFAULT_LAYOUT_OPTIONS,
          enabled: optimized ?? false,
          spacingScale: spacingScale ?? 1.0,
        }
      : DEFAULT_LAYOUT_OPTIONS)

  return (
    <LayoutOptionsProvider options={resolvedLayout}>
      <ResumeRendererBody model={model} showSocialIcons={showSocialIcons} />
    </LayoutOptionsProvider>
  )
}

function ResumeRendererBody({
  model,
  showSocialIcons,
}: {
  model: RenderModel
  showSocialIcons: boolean
}) {
  const { header, sections, fontFamily, lang } = model
  const tokens = useLayoutTokensContext()
  const { sectionGap, font, lineHeight, spacing, options } = tokens
  const blocks: ReactNode[] = []

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
              fontSize: font.name,
              fontWeight: 700,
              color: Colors.name,
              letterSpacing: '-0.01em',
              lineHeight: lineHeight.name,
            }}
          >
            {header.name}
          </p>
          <p
            style={{
              fontSize: font.headline,
              color: Colors.meta,
              marginTop: spacing.headlineMarginTop,
              lineHeight: lineHeight.headline,
            }}
          >
            {header.headline}
          </p>
        </div>
        <div
          style={{
            textAlign: 'right',
            flexShrink: 1,
            paddingTop: spacing.contactPaddingTop,
            maxWidth: '50%',
          }}
        >
          <p
            style={{
              fontSize: font.contact,
              color: Colors.meta,
              lineHeight: lineHeight.contact,
            }}
          >
            {header.contactLine1}
          </p>
          <p
            style={{
              fontSize: font.contact,
              color: Colors.meta,
              lineHeight: lineHeight.contact,
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
        <div style={{ marginTop: spacing.summaryMarginTop }}>
          {header.summary.map((s, i) => (
            <p
              key={i}
              className="md-inline"
              style={{
                fontSize: font.summary,
                color: Colors.meta,
                lineHeight: lineHeight.summary,
              }}
              {...inlineMdProps(s)}
            />
          ))}
        </div>
      )}
    </header>,
  )

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (!section || !section.variant) continue
    emitSectionBlocks(section, blocks, sectionGap, lang, options)
  }

  return (
    <>
      <PrintStyles />
      <PaginatedPaper fontFamily={fontFamily}>{blocks}</PaginatedPaper>
    </>
  )
}

type SubsectionPart = 'head' | 'bullets' | 'keywords' | 'full'

function subsectionBlock(
  key: string,
  sectionId: string,
  children: ReactNode,
  options: {
    paddingTop?: number
    sectionStart?: boolean
    subsectionId?: string
    subsectionPart?: SubsectionPart
  } = {},
) {
  const {
    paddingTop = 0,
    sectionStart = false,
    subsectionId,
    subsectionPart = 'full',
  } = options

  return (
    <div
      key={key}
      className="paginate-block paginate-subsection"
      data-section-id={sectionId}
      data-section-start={sectionStart ? 'true' : undefined}
      data-subsection-id={subsectionId}
      data-subsection-part={
        subsectionPart !== 'full' ? subsectionPart : undefined
      }
      style={paddingTop > 0 ? { paddingTop } : undefined}
    >
      {children}
    </div>
  )
}

function sectionLeadPadding(sectionGap: (base: number) => number): number {
  return sectionGap(SectionSpacing)
}

function SkillRow({
  skill,
}: {
  skill: { id: string; name: string; level: string; keywords: string[] }
}) {
  const { font, lineHeight } = useLayoutTokensContext()
  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'baseline' }}>
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
            fontSize: font.skillName,
            fontWeight: 600,
            color: Colors.entry,
          }}
        >
          {skill.name}
        </span>
        <span style={{ fontSize: font.skillLevel, color: Colors.subtle }}>
          ({skill.level})
        </span>
      </div>
      <p
        style={{
          fontSize: font.skillKeywords,
          color: Colors.meta,
          lineHeight: lineHeight.skillKeywords,
          flex: 1,
        }}
      >
        {skill.keywords.join(' · ')}
      </p>
    </div>
  )
}

function CertificateRow({
  cert,
  lang,
}: {
  cert: { id: string; name: string; issuer: string; date: string }
  lang: string
}) {
  const { font } = useLayoutTokensContext()
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: font.certName,
          fontWeight: 500,
          color: Colors.entry,
        }}
      >
        {cert.name}
      </span>
      <span
        style={{
          fontSize: font.certMeta,
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

function emitEntryParts(
  section: Extract<RenderSection, { variant: 'entries' }>,
  entry: {
    id: string
    title: string
    subtitle: string
    startDate: string
    endDate?: string
    bullets: string[]
    keywords: string[]
  },
  blocks: ReactNode[],
  sectionGap: (base: number) => number,
  lang: string,
  options: {
    isFirst: boolean
    paddingTop: number
    sectionStart: boolean
    allowSubsectionSplit: boolean
  },
) {
  const subsectionId = `${section.id}-entry-${entry.id}`
  const gap = sectionGap(section.gap ?? SectionSpacing)

  if (!options.allowSubsectionSplit) {
    blocks.push(
      subsectionBlock(
        subsectionId,
        section.id,
        <>
          {options.isFirst && <SecHead title={section.title} />}
          <EntryHead
            title={entry.title}
            sub={entry.subtitle}
            start={entry.startDate}
            end={entry.endDate}
            lang={lang}
          />
          {entry.bullets.length > 0 && <Bullets items={entry.bullets} />}
          {entry.keywords.length > 0 && <Keywords items={entry.keywords} />}
        </>,
        {
          paddingTop: options.paddingTop,
          sectionStart: options.sectionStart,
          subsectionId,
        },
      ),
    )
    return
  }

  blocks.push(
    subsectionBlock(
      `${subsectionId}-head`,
      section.id,
      <>
        {options.isFirst && <SecHead title={section.title} />}
        <EntryHead
          title={entry.title}
          sub={entry.subtitle}
          start={entry.startDate}
          end={entry.endDate}
          lang={lang}
        />
      </>,
      {
        paddingTop: options.paddingTop,
        sectionStart: options.sectionStart,
        subsectionId,
        subsectionPart: 'head',
      },
    ),
  )

  if (entry.bullets.length > 0) {
    blocks.push(
      subsectionBlock(
        `${subsectionId}-bullets`,
        section.id,
        <Bullets items={entry.bullets} />,
        { subsectionId, subsectionPart: 'bullets' },
      ),
    )
  }

  if (entry.keywords.length > 0) {
    blocks.push(
      subsectionBlock(
        `${subsectionId}-keywords`,
        section.id,
        <Keywords items={entry.keywords} />,
        { subsectionId, subsectionPart: 'keywords' },
      ),
    )
  }
}

function emitAwardParts(
  section: Extract<RenderSection, { variant: 'awards' }>,
  award: {
    id: string
    name: string
    awarder: string
    date: string
    bullets: string[]
  },
  blocks: ReactNode[],
  sectionGap: (base: number) => number,
  lang: string,
  options: {
    isFirst: boolean
    paddingTop: number
    sectionStart: boolean
    allowSubsectionSplit: boolean
  },
) {
  const subsectionId = `${section.id}-award-${award.id}`

  if (!options.allowSubsectionSplit) {
    blocks.push(
      subsectionBlock(
        subsectionId,
        section.id,
        <>
          {options.isFirst && <SecHead title={section.title} />}
          <EntryHead
            title={award.name}
            sub={award.awarder}
            start={award.date}
            lang={lang}
          />
          {award.bullets.length > 0 && <Bullets items={award.bullets} />}
        </>,
        {
          paddingTop: options.paddingTop,
          sectionStart: options.sectionStart,
          subsectionId,
        },
      ),
    )
    return
  }

  blocks.push(
    subsectionBlock(
      `${subsectionId}-head`,
      section.id,
      <>
        {options.isFirst && <SecHead title={section.title} />}
        <EntryHead
          title={award.name}
          sub={award.awarder}
          start={award.date}
          lang={lang}
        />
      </>,
      {
        paddingTop: options.paddingTop,
        sectionStart: options.sectionStart,
        subsectionId,
        subsectionPart: 'head',
      },
    ),
  )

  if (award.bullets.length > 0) {
    blocks.push(
      subsectionBlock(
        `${subsectionId}-bullets`,
        section.id,
        <Bullets items={award.bullets} />,
        { subsectionId, subsectionPart: 'bullets' },
      ),
    )
  }
}

function LangRow({ label, values }: { label: string; values: string[] }) {
  const { font } = useLayoutTokensContext()
  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'baseline' }}>
      <span
        style={{
          width: 80,
          flexShrink: 0,
          fontSize: font.langLabel,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: Colors.meta,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: font.langValue, color: Colors.body }}>
        {values.join(' · ')}
      </span>
    </div>
  )
}

function emitSectionBlocks(
  section: RenderSection,
  blocks: ReactNode[],
  sectionGap: (base: number) => number,
  lang: string,
  layoutOptions: LayoutOptions,
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

    emitEntryParts(section, entries[0], blocks, sectionGap, lang, {
      isFirst: true,
      paddingTop: leadSpacing.paddingTop,
      sectionStart: true,
      allowSubsectionSplit: layoutOptions.allowSubsectionSplit,
    })

    for (let i = 1; i < entries.length; i++) {
      emitEntryParts(section, entries[i], blocks, sectionGap, lang, {
        isFirst: false,
        paddingTop: sectionGap(section.gap ?? SectionSpacing),
        sectionStart: false,
        allowSubsectionSplit: layoutOptions.allowSubsectionSplit,
      })
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
          <SkillRow skill={skills[0]} />
        </>,
        leadSpacing,
      ),
    )

    for (let i = 1; i < skills.length; i++) {
      blocks.push(
        subsectionBlock(
          `${section.id}-skill-${skills[i].id}`,
          section.id,
          <SkillRow skill={skills[i]} />,
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
          <CertificateRow cert={certificates[0]} lang={lang} />
        </>,
        leadSpacing,
      ),
    )

    for (let i = 1; i < certificates.length; i++) {
      blocks.push(
        subsectionBlock(
          `${section.id}-cert-${certificates[i].id}`,
          section.id,
          <CertificateRow cert={certificates[i]} lang={lang} />,
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

    blocks.push(
      subsectionBlock(
        `${section.id}-row-${rows[0][0]}`,
        section.id,
        <>
          <SecHead title={section.title} />
          <LangRow label={rows[0][0]} values={rows[0][1]} />
        </>,
        leadSpacing,
      ),
    )

    for (let i = 1; i < rows.length; i++) {
      blocks.push(
        subsectionBlock(
          `${section.id}-row-${rows[i][0]}`,
          section.id,
          <LangRow label={rows[i][0]} values={rows[i][1]} />,
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

    emitAwardParts(section, awards[0], blocks, sectionGap, lang, {
      isFirst: true,
      paddingTop: leadSpacing.paddingTop,
      sectionStart: true,
      allowSubsectionSplit: layoutOptions.allowSubsectionSplit,
    })

    for (let i = 1; i < awards.length; i++) {
      emitAwardParts(section, awards[i], blocks, sectionGap, lang, {
        isFirst: false,
        paddingTop: sectionGap(SectionSpacing),
        sectionStart: false,
        allowSubsectionSplit: layoutOptions.allowSubsectionSplit,
      })
    }
  }
}
