import { Colors } from '../constants'
import { inlineMdProps } from '../inline-md'
import { useLayoutTokensContext } from '../../layout/LayoutOptionsContext'

/** Bullet list for summaries/descriptions. */
export function Bullets({ items }: { items: string[] }) {
  const { font, lineHeight, spacing } = useLayoutTokensContext()

  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: spacing.bulletGap,
            fontSize: font.body,
            color: Colors.body,
            lineHeight: lineHeight.body,
            marginBottom: spacing.bulletMarginBottom,
          }}
        >
          <span style={{ flexShrink: 0, marginTop: '0.15em' }}>•</span>
          <span className="md-inline" {...inlineMdProps(item)} />
        </li>
      ))}
    </ul>
  )
}
