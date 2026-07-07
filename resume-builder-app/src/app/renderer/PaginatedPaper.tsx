import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
  Children,
  cloneElement,
  isValidElement,
} from 'react'
import { Paper, paperPaddingCss, paperSheetStyle } from './constants'
import { packBlocksToPages } from './paginate-pack'

const PAGE_HEIGHT_PX = Paper.heightPx
const PAPER_SHEET = paperSheetStyle()
const PAPER_PADDING = paperPaddingCss()

/** Strip block spacing at the top of a page; page margin provides the inset. */
function renderPageBlock(child: ReactNode, blockIdx: number) {
  if (!isValidElement(child) || blockIdx !== 0) return child

  const style = (child.props.style as CSSProperties | undefined) ?? {}
  if (!style.paddingTop) return child

  return cloneElement(child, {
    style: { ...style, paddingTop: 0 },
  })
}

interface PaginatedPaperProps {
  children: ReactNode
  fontFamily: string
  /** Layout optimization adjustments */
  optimized?: boolean
  /** Spacing multiplier (default 1.0, range 0.7–1.3) */
  spacingScale?: number
}

interface PageData {
  startIdx: number
  endIdx: number
}

/**
 * Paginated paper shell with real A4 page splitting.
 * Measures child blocks, packs them into explicit A4 page containers,
 * and renders stacked pages separated by visual page-break indicators.
 */
export function PaginatedPaper({
  children,
  fontFamily,
  spacingScale = 1.0,
}: PaginatedPaperProps) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<PageData[]>([])
  const [measured, setMeasured] = useState(false)
  const childArray = Children.toArray(children)

  useEffect(() => {
    if (!measureRef.current) return
    setMeasured(false)
    ;(window as unknown as Record<string, unknown>).__RESUME_LAYOUT_READY__ =
      false

    const measure = () => {
      if (!measureRef.current) return
      const blocks = Array.from(measureRef.current.children) as HTMLElement[]
      if (blocks.length === 0) {
        setPages([{ startIdx: 0, endIdx: 0 }])
        setMeasured(true)
        return
      }

      const pageList = packBlocksToPages(blocks)
      setPages(pageList)
      setMeasured(true)

      // Let layout paint, then signal export readiness for Puppeteer.
      setTimeout(() => {
        ;(
          window as unknown as Record<string, unknown>
        ).__RESUME_LAYOUT_READY__ = true
      }, 100)
    }

    const runMeasure = async () => {
      const family = measureRef.current?.style.fontFamily
      if (family) {
        const weights = [400, 500, 600, 700]
        await Promise.all(
          weights.map((weight) =>
            document.fonts
              .load(`${weight} 16px ${family}`)
              .catch(() => undefined),
          ),
        )
      }
      await document.fonts.ready
      setTimeout(measure, 50)
    }

    runMeasure()
  }, [children, spacingScale])

  return (
    <>
      {/* Hidden measurement container — same width/padding as real pages */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: Paper.widthPx,
          padding: PAPER_PADDING,
          boxSizing: 'border-box',
          fontFamily,
        }}
      >
        {childArray.map((child, i) =>
          isValidElement(child)
            ? cloneElement(child, { key: `m-${i}` })
            : child,
        )}
      </div>

      {/* Rendered pages */}
      <div
        className="chrome py-8 print:py-0 print:!bg-white"
        style={{ backgroundColor: '#D6D4CF', fontFamily }}
      >
        {!measured ? (
          <div
            className="paper mx-auto bg-white shadow-lg print:shadow-none"
            style={PAPER_SHEET}
          >
            {children}
          </div>
        ) : (
          pages.map((page, pageIdx) => (
            <div key={pageIdx}>
              {/* Page separator between pages */}
              {pageIdx > 0 && (
                <div
                  className="no-print"
                  style={{
                    width: Paper.widthPx,
                    margin: '0 auto',
                    padding: '6px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 0,
                      borderTop: '1px dashed rgba(0,0,0,0.25)',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      color: 'rgba(0,0,0,0.4)',
                      fontFamily: 'system-ui',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Page {pageIdx + 1}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 0,
                      borderTop: '1px dashed rgba(0,0,0,0.25)',
                    }}
                  />
                </div>
              )}

              {/* A4 page container */}
              <div
                className="paper mx-auto bg-white shadow-lg print:shadow-none"
                style={PAPER_SHEET}
              >
                <div className="page-content">
                  {childArray
                    .slice(page.startIdx, page.endIdx)
                    .map((child, blockIdx) => renderPageBlock(child, blockIdx))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export { PAGE_HEIGHT_PX }
export { USABLE_HEIGHT } from './paginate-pack'
