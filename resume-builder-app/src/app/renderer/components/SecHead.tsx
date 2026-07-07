import { Colors } from '../constants'
import { useLayoutTokensContext } from '../../layout/LayoutOptionsContext'

/** Full-width section divider with label. */
export function SecHead({ title }: { title: string }) {
  const { font, lineHeight, spacing } = useLayoutTokensContext()

  return (
    <div
      className="sec-head"
      style={{ marginBottom: spacing.secHeadMarginBottom }}
    >
      <p
        style={{
          fontSize: font.sectionHead,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: Colors.sectionHead,
          lineHeight: lineHeight.sectionHead,
        }}
      >
        {title}
      </p>
      <div
        style={{
          height: 1,
          backgroundColor: Colors.rule,
          marginTop: spacing.secHeadRuleMarginTop,
        }}
      />
    </div>
  )
}
