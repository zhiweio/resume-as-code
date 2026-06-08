import { Colors } from '../constants'
import { inlineMdProps } from '../inline-md'

/** Bullet list for summaries/descriptions. */
export function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: 5,
            fontSize: 9.5,
            color: Colors.body,
            lineHeight: 1.45,
            marginBottom: 1,
          }}
        >
          <span style={{ flexShrink: 0, marginTop: '0.15em' }}>•</span>
          <span className="md-inline" {...inlineMdProps(item)} />
        </li>
      ))}
    </ul>
  )
}
