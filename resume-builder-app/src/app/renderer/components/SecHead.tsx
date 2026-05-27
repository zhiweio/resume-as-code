import { Colors } from '../constants'

/** Full-width section divider with label. */
export function SecHead({ title }: { title: string }) {
  return (
    <div className="sec-head" style={{ marginTop: 14, marginBottom: 5 }}>
      <p
        style={{
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: Colors.sectionHead,
          lineHeight: 1,
        }}
      >
        {title}
      </p>
      <div style={{ height: 1, backgroundColor: Colors.rule, marginTop: 3 }} />
    </div>
  )
}
