import { Colors } from '../constants'

export interface EntryHeadProps {
  title: string
  sub: string
  start: string
  end?: string
}

/** Compact header row: bold left label + right date, then italic subtitle. */
export function EntryHead({ title, sub, start, end }: EntryHeadProps) {
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
          {start}
          {end ? ` – ${end}` : ''}
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
