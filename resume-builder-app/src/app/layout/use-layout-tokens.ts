import { useMemo } from 'react'
import { Paper } from '../renderer/constants'
import { TypographyBaseline } from '../renderer/typography-baseline'
import type { LayoutOptions } from './layout-options'

export function scalePx(base: number, scale: number): number {
  return Math.round(base * scale)
}

export function scaleLine(base: number, scale: number): number {
  return Math.round(base * scale * 100) / 100
}

export interface LayoutTokens {
  options: LayoutOptions
  sectionGap: (base: number) => number
  componentGap: (base: number) => number
  font: {
    name: number
    headline: number
    contact: number
    summary: number
    sectionHead: number
    entryTitle: number
    entryDate: number
    entrySub: number
    body: number
    skillName: number
    skillLevel: number
    skillKeywords: number
    certName: number
    certMeta: number
    keyword: number
    langLabel: number
    langValue: number
  }
  lineHeight: {
    name: number
    headline: number
    contact: number
    summary: number
    sectionHead: number
    entry: number
    body: number
    keyword: number
    skillKeywords: number
  }
  spacing: {
    sectionGap: number
    headlineMarginTop: number
    contactPaddingTop: number
    summaryMarginTop: number
    secHeadMarginBottom: number
    secHeadRuleMarginTop: number
    entryHeadMarginBottom: number
    entrySubMarginTop: number
    keywordPaddingTop: number
    bulletMarginBottom: number
    bulletGap: number
    continuationPaddingTop: number
  }
  page: {
    widthPx: number
    heightPx: number
    marginPx: number
    usableHeight: number
  }
}

export function computeLayoutTokens(options: LayoutOptions): LayoutTokens {
  const { fontScale, lineHeightScale, bulletGapScale, componentSpacingScale } =
    options
  const componentGap = (base: number) =>
    Math.round(base * componentSpacingScale)
  const sectionGap = (base: number) => Math.round(base * options.spacingScale)
  const marginPx = options.pageMarginPx

  const b = TypographyBaseline

  return {
    options,
    sectionGap,
    componentGap,
    font: {
      name: scalePx(b.font.name, fontScale),
      headline: scalePx(b.font.headline, fontScale),
      contact: scalePx(b.font.contact, fontScale),
      summary: scalePx(b.font.summary, fontScale),
      sectionHead: scalePx(b.font.sectionHead, fontScale),
      entryTitle: scalePx(b.font.entryTitle, fontScale),
      entryDate: scalePx(b.font.entryDate, fontScale),
      entrySub: scalePx(b.font.entrySub, fontScale),
      body: scalePx(b.font.body, fontScale),
      skillName: scalePx(b.font.skillName, fontScale),
      skillLevel: scalePx(b.font.skillLevel, fontScale),
      skillKeywords: scalePx(b.font.skillKeywords, fontScale),
      certName: scalePx(b.font.certName, fontScale),
      certMeta: scalePx(b.font.certMeta, fontScale),
      keyword: scalePx(b.font.keyword, fontScale),
      langLabel: scalePx(b.font.langLabel, fontScale),
      langValue: scalePx(b.font.langValue, fontScale),
    },
    lineHeight: {
      name: scaleLine(b.lineHeight.name, lineHeightScale),
      headline: scaleLine(b.lineHeight.headline, lineHeightScale),
      contact: scaleLine(b.lineHeight.contact, lineHeightScale),
      summary: scaleLine(b.lineHeight.summary, lineHeightScale),
      sectionHead: scaleLine(b.lineHeight.sectionHead, lineHeightScale),
      entry: scaleLine(b.lineHeight.entry, lineHeightScale),
      body: scaleLine(b.lineHeight.body, lineHeightScale),
      keyword: scaleLine(b.lineHeight.keyword, lineHeightScale),
      skillKeywords: scaleLine(b.lineHeight.skillKeywords, lineHeightScale),
    },
    spacing: {
      sectionGap: sectionGap(b.spacing.sectionGap),
      headlineMarginTop: componentGap(b.spacing.headlineMarginTop),
      contactPaddingTop: componentGap(b.spacing.contactPaddingTop),
      summaryMarginTop: sectionGap(b.spacing.summaryMarginTop),
      secHeadMarginBottom: componentGap(b.spacing.secHeadMarginBottom),
      secHeadRuleMarginTop: componentGap(b.spacing.secHeadRuleMarginTop),
      entryHeadMarginBottom: componentGap(b.spacing.entryHeadMarginBottom),
      entrySubMarginTop: componentGap(b.spacing.entrySubMarginTop),
      keywordPaddingTop: componentGap(b.spacing.keywordPaddingTop),
      bulletMarginBottom: Math.round(
        b.spacing.bulletMarginBottom * bulletGapScale,
      ),
      bulletGap: componentGap(b.spacing.bulletGap),
      continuationPaddingTop: componentGap(b.spacing.continuationPaddingTop),
    },
    page: {
      widthPx: Paper.widthPx,
      heightPx: Paper.heightPx,
      marginPx,
      usableHeight: Paper.heightPx - marginPx * 2,
    },
  }
}

export function useLayoutTokens(options: LayoutOptions): LayoutTokens {
  return useMemo(() => computeLayoutTokens(options), [options])
}
