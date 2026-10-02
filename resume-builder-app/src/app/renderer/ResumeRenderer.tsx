import type { RenderModel, RenderSection } from '../../models/render-model'
import { Colors, SectionSpacing } from './constants'
import { SecHead, EntryHead, BulletRow, Keywords } from './components'
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

  // Reserve the final box before the async icon resolves so the measured
  // header height does not drift between the measure pass and the render.
  if (!icon) {
    return (
      <span
        aria-hidden
        style={{
          width: 10,
          height: 10,
          flexShrink: 0,
          display: 'inline-block',
        }}
      />
    )
  }

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
  const { sectionGap, font, lineHeight, spacing } = tokens
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
    emitSectionBlocks(
      section,
      blocks,
      sectionGap,
      lang,
      spacing.bulletMarginBottom,
    )
  }

  return (
    <>
      <PrintStyles />
      <PaginatedPaper fontFamily={fontFamily}>{blocks}</PaginatedPaper>
    </>
  )
}

/** Semantic role of a pagination block, consumed by the page packer. */
type BlockPart = 'sec-head' | 'head' | 'bullet' | 'keywords' | 'row'

function paginationBlock(
  key: string,
  sectionId: string,
  children: ReactNode,
  options: {
    paddingTop?: number
    sectionStart?: boolean
    subsectionId?: string
    part?: BlockPart
    keepWithNext?: boolean
  } = {},
) {
  const {
    paddingTop = 0,
    sectionStart = false,
    subsectionId,
    part,
    keepWithNext = false,
  } = options

  return (
    <div
      key={key}
      className="paginate-block paginate-subsection"
      data-section-id={sectionId}
      data-section-start={sectionStart ? 'true' : undefined}
      data-subsection-id={subsectionId}
      data-block-part={part}
      data-keep-with-next={keepWithNext ? 'true' : undefined}
      style={paddingTop > 0 ? { paddingTop } : undefined}
    >
      {children}
    </div>
  )
}

function sectionLeadPadding(sectionGap: (base: number) => number): number {
  return sectionGap(SectionSpacing)
}

/** Standalone section header; the packer's keep-with-next rule binds it to
 * the first block that follows, so it can never strand at a page bottom. */
function emitSecHead(
  section: RenderSection,
  blocks: ReactNode[],
  leadPadding: number,
) {
  blocks.push(
    paginationBlock(
      `${section.id}-sec-head`,
      section.id,
      <SecHead title={section.title} />,
      {
        paddingTop: leadPadding,
        sectionStart: true,
        part: 'sec-head',
        keepWithNext: true,
      },
    ),
  )
}

function SkillRow({
  skill,
}: {
  skill: { id: string; name: string; level: string; keywords: string[] }
}) {
  const { font, lineHeight } = useLayoutTokensContext()
  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'baseline' }}>
      {/* Inline text flow inside the fixed label column: a long label wraps
          within the column instead of flex-overflowing into the value. */}
      <div
        style={{
          width: 196,
          flexShrink: 0,
          fontSize: font.skillName,
          lineHeight: lineHeight.skillKeywords,
        }}
      >
        <span style={{ fontWeight: 600, color: Colors.entry }}>
          {skill.name}
        </span>{' '}
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

function emitEntryBlocks(
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
  options: { gapAbove: number; bulletGap: number },
) {
  const subsectionId = `${section.id}-entry-${entry.id}`

  blocks.push(
    paginationBlock(
      `${subsectionId}-head`,
      section.id,
      <EntryHead
        title={entry.title}
        sub={entry.subtitle}
        start={entry.startDate}
        end={entry.endDate}
        lang={lang}
      />,
      {
        paddingTop: options.gapAbove,
        subsectionId,
        part: 'head',
        keepWithNext: true,
      },
    ),
  )

  entry.bullets.forEach((item, k) => {
    blocks.push(
      paginationBlock(
        `${subsectionId}-bullet-${entry.id}-${k}`,
        section.id,
        <BulletRow item={item} gapAbove={k > 0 ? options.bulletGap : 0} />,
        { subsectionId, part: 'bullet' },
      ),
    )
  })

  if (entry.keywords.length > 0) {
    blocks.push(
      paginationBlock(
        `${subsectionId}-keywords`,
        section.id,
        <Keywords items={entry.keywords} />,
        { subsectionId, part: 'keywords' },
      ),
    )
  }
}

function emitAwardBlocks(
  section: Extract<RenderSection, { variant: 'awards' }>,
  award: {
    id: string
    name: string
    awarder: string
    date: string
    bullets: string[]
  },
  blocks: ReactNode[],
  lang: string,
  options: { gapAbove: number; bulletGap: number },
) {
  const subsectionId = `${section.id}-award-${award.id}`

  blocks.push(
    paginationBlock(
      `${subsectionId}-head`,
      section.id,
      <EntryHead
        title={award.name}
        sub={award.awarder}
        start={award.date}
        lang={lang}
      />,
      {
        paddingTop: options.gapAbove,
        subsectionId,
        part: 'head',
        keepWithNext: true,
      },
    ),
  )

  award.bullets.forEach((item, k) => {
    blocks.push(
      paginationBlock(
        `${subsectionId}-bullet-${award.id}-${k}`,
        section.id,
        <BulletRow item={item} gapAbove={k > 0 ? options.bulletGap : 0} />,
        { subsectionId, part: 'bullet' },
      ),
    )
  })
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
  bulletGap: number,
) {
  const leadPadding = sectionLeadPadding(sectionGap)

  if (section.variant === 'entries') {
    emitSecHead(section, blocks, leadPadding)
    for (let i = 0; i < section.entries.length; i++) {
      emitEntryBlocks(section, section.entries[i], blocks, sectionGap, lang, {
        gapAbove: i === 0 ? 0 : sectionGap(section.gap ?? SectionSpacing),
        bulletGap,
      })
    }
  } else if (section.variant === 'skills') {
    emitSecHead(section, blocks, leadPadding)
    section.skills.forEach((skill, i) => {
      blocks.push(
        paginationBlock(
          `${section.id}-skill-${skill.id}`,
          section.id,
          <SkillRow skill={skill} />,
          { paddingTop: i > 0 ? sectionGap(3) : 0, part: 'row' },
        ),
      )
    })
  } else if (section.variant === 'certificates') {
    emitSecHead(section, blocks, leadPadding)
    section.certificates.forEach((cert, i) => {
      blocks.push(
        paginationBlock(
          `${section.id}-cert-${cert.id}`,
          section.id,
          <CertificateRow cert={cert} lang={lang} />,
          { paddingTop: i > 0 ? sectionGap(2.5) : 0, part: 'row' },
        ),
      )
    })
  } else if (section.variant === 'langAndInterests') {
    const rows = Array.from(
      section.rows.reduce((map, row) => {
        const existing = map.get(row.label)
        if (existing) existing.push(row.value)
        else map.set(row.label, [row.value])
        return map
      }, new Map<string, string[]>()),
    )

    emitSecHead(section, blocks, leadPadding)
    rows.forEach(([label, values], i) => {
      blocks.push(
        paginationBlock(
          `${section.id}-row-${label}`,
          section.id,
          <LangRow label={label} values={values} />,
          { paddingTop: i > 0 ? sectionGap(3) : 0, part: 'row' },
        ),
      )
    })
  } else if (section.variant === 'awards') {
    emitSecHead(section, blocks, leadPadding)
    section.awards.forEach((award, i) => {
      emitAwardBlocks(section, award, blocks, lang, {
        gapAbove: i > 0 ? sectionGap(SectionSpacing) : 0,
        bulletGap,
      })
    })
  }
}
