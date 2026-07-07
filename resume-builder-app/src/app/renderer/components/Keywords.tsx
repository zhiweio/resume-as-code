import { Colors } from '../constants'

/** Inline keyword list separated by middle-dots. */
export function Keywords({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <p
      style={{
        fontSize: 8.5,
        color: Colors.subtle,
        paddingTop: 3,
        lineHeight: 1.4,
      }}
    >
      {items.join(' · ')}
    </p>
  )
}
