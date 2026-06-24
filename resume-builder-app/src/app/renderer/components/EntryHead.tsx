import { Colors } from '../constants'
import { formatDate } from '../format-date'

export interface EntryHeadProps {
  title: string
  sub: string
  start: string
  end?: string
  lang?: string
}

/** Compact header row: bold left label + right date, then italic subtitle. */
export function EntryHead({ title, sub, start, end, lang }: EntryHeadProps) {
  const displayStart = lang ? formatDate(start, lang) : start
  const displayEnd = lang && end ? formatDate(end, lang) : end

  return (
    <div style={{ marginBottom: 2 }}>
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
            fontSize: 11,
            fontWeight: 600,
            color: Colors.entry,
            lineHeight: 1.3,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 9,
            color: Colors.subtle,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            lineHeight: 1.3,
          }}
        >
          {displayStart}
          {displayEnd ? ` – ${displayEnd}` : ''}
        </span>
      </div>
      <p
        style={{
          fontSize: 10,
          color: Colors.meta,
          fontStyle: 'italic',
          marginTop: 1,
          lineHeight: 1.3,
        }}
      >
        {sub}
      </p>
    </div>
  )
}
