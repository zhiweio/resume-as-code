import { Paper } from './constants'

const { widthPx, heightPx, marginPx } = Paper

/** Print styles injected by the renderer. Isolates print behavior from screen CSS. */
export function PrintStyles() {
  return (
    <style>{`
      @media print {
        @page { size: A4 portrait; margin: 0; }
        html, body {
          background: white !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print { display: none !important; }
        .chrome { padding: 0 !important; background: white !important; min-height: unset !important; }
        .paper {
          width: ${widthPx}px !important;
          height: ${heightPx}px !important;
          min-height: ${heightPx}px !important;
          max-height: ${heightPx}px !important;
          box-shadow: none !important;
          margin: 0 auto !important;
          border-radius: 0 !important;
          background: white !important;
          padding: ${marginPx}px !important;
          box-sizing: border-box !important;
          overflow: hidden;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .paper + .paper { page-break-before: always; break-before: page; }
        .paginate-subsection {
          break-inside: avoid;
          page-break-inside: avoid;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
        }
        .sec-head { break-after: avoid; page-break-after: avoid; }
        p, li { orphans: 2; widows: 2; }
      }
      .chrome { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.2) transparent; }
      .paper {
        box-sizing: border-box;
        width: ${widthPx}px;
        height: ${heightPx}px;
        min-height: ${heightPx}px;
        overflow: hidden;
      }
      .page-content {
        display: block;
        height: 100%;
      }
      .paginate-subsection {
        break-inside: avoid;
        page-break-inside: avoid;
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
      }
      .md-inline strong { font-weight: 600; }
      .md-inline em { font-style: italic; }
      .md-inline code { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; font-size: 0.92em; background: rgba(0,0,0,0.05); padding: 0 3px; border-radius: 3px; }
      .md-inline del, .md-inline s { text-decoration: line-through; }
      .md-inline a { color: inherit; text-decoration: underline; }
    `}</style>
  )
}
