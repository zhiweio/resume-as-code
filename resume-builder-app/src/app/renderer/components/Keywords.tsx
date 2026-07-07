import { Colors } from '../constants'
import { useLayoutTokensContext } from '../../layout/LayoutOptionsContext'

/** Inline keyword list separated by middle-dots. */
export function Keywords({ items }: { items: string[] }) {
  const { font, lineHeight, spacing } = useLayoutTokensContext()

  if (!items.length) return null
  return (
    <p
      style={{
        fontSize: font.keyword,
        color: Colors.subtle,
        paddingTop: spacing.keywordPaddingTop,
        lineHeight: lineHeight.keyword,
      }}
    >
      {items.join(' · ')}
    </p>
  )
}
