import { Colors } from '../constants'
import { inlineMdProps } from '../inline-md'
import { useLayoutTokensContext } from '../../layout/LayoutOptionsContext'

/**
 * One bullet row. Each row is its own pagination block so the packer can
 * break between bullets; the inter-row gap moves from li margin-bottom to
 * padding-top (gapAbove) so page-leading rows can strip it cleanly.
 */
export function BulletRow({
  item,
  gapAbove = 0,
}: {
  item: string
  gapAbove?: number
}) {
  const { font, lineHeight, spacing } = useLayoutTokensContext()

  return (
    <div
      role="listitem"
      style={{
        display: 'flex',
        gap: spacing.bulletGap,
        paddingTop: gapAbove > 0 ? gapAbove : undefined,
        fontSize: font.body,
        color: Colors.body,
        lineHeight: lineHeight.body,
      }}
    >
      <span style={{ flexShrink: 0, marginTop: '0.15em' }}>•</span>
      <span className="md-inline" {...inlineMdProps(item)} />
    </div>
  )
}
