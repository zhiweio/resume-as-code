import { Colors } from '../constants'
import { formatDate } from '../format-date'
import { useLayoutTokensContext } from '../../layout/LayoutOptionsContext'

export interface EntryHeadProps {
  title: string
  sub: string
  start: string
  end?: string
  lang?: string
}

/** Compact header row: bold left label + right date, then italic subtitle. */
export function EntryHead({ title, sub, start, end, lang }: EntryHeadProps) {
  const { font, lineHeight, spacing } = useLayoutTokensContext()
  const displayStart = lang ? formatDate(start, lang) : start
  const displayEnd = lang && end ? formatDate(end, lang) : end

  return (
    <div style={{ marginBottom: spacing.entryHeadMarginBottom }}>
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
            fontSize: font.entryTitle,
            fontWeight: 600,
            color: Colors.entry,
            lineHeight: lineHeight.entry,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: font.entryDate,
            color: Colors.subtle,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            lineHeight: lineHeight.entry,
          }}
        >
          {displayStart}
          {displayEnd ? ` – ${displayEnd}` : ''}
        </span>
      </div>
      <p
        style={{
          fontSize: font.entrySub,
          color: Colors.meta,
          fontStyle: 'italic',
          marginTop: spacing.entrySubMarginTop,
          lineHeight: lineHeight.entry,
        }}
      >
        {sub}
      </p>
    </div>
  )
}
