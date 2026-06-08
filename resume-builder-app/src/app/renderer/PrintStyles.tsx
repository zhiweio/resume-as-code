/** Print styles injected by the renderer. Isolates print behavior from screen CSS. */
export function PrintStyles() {
  return (
    <style>{`
      @media print {
        @page { size: A4 portrait; margin: 0; }
        html, body { background: white !important; }
        .no-print { display: none !important; }
        .chrome { padding: 0 !important; background: white !important; min-height: unset !important; }
        .paper { width: 100% !important; max-width: 100% !important; box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; min-height: auto !important; background: white !important; }
        .paper + .paper { page-break-before: always; break-before: page; }
        .resume-entry { break-inside: avoid; page-break-inside: avoid; }
        .sec-head { break-after: avoid; page-break-after: avoid; }
        p, li { orphans: 2; widows: 2; }
      }
      .chrome { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.2) transparent; }
      .md-inline strong { font-weight: 600; }
      .md-inline em { font-style: italic; }
      .md-inline code { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; font-size: 0.92em; background: rgba(0,0,0,0.05); padding: 0 3px; border-radius: 3px; }
      .md-inline del, .md-inline s { text-decoration: line-through; }
      .md-inline a { color: inherit; text-decoration: underline; }
    `}</style>
  )
}
