import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  Children,
  cloneElement,
  isValidElement,
} from 'react'
import { Paper } from './constants'

/**
 * A4 page dimensions at 96 dpi.
 * Total height: 1123px (297mm). Usable = total - paddingTop - paddingBottom.
 */
const PAGE_HEIGHT_PX = 1123
const USABLE_HEIGHT = PAGE_HEIGHT_PX - Paper.paddingTop - Paper.paddingBottom

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

    const measure = () => {
      if (!measureRef.current) return
      const blocks = Array.from(measureRef.current.children) as HTMLElement[]
      if (blocks.length === 0) {
        setPages([{ startIdx: 0, endIdx: 0 }])
        setMeasured(true)
        return
      }

      const pageList: PageData[] = []
      let currentPageStart = 0
      let currentHeight = 0

      for (let i = 0; i < blocks.length; i++) {
        const style = getComputedStyle(blocks[i])
        const blockHeight =
          blocks[i].offsetHeight +
          parseFloat(style.marginTop) +
          parseFloat(style.marginBottom)

        // If adding this block exceeds the page and we have at least one block already
        if (
          currentHeight + blockHeight > USABLE_HEIGHT &&
          i > currentPageStart
        ) {
          pageList.push({ startIdx: currentPageStart, endIdx: i })
          currentPageStart = i
          currentHeight = blockHeight
        } else {
          currentHeight += blockHeight
        }
      }

      // Last page
      pageList.push({ startIdx: currentPageStart, endIdx: blocks.length })
      setPages(pageList)
      setMeasured(true)
    }

    // Measure after fonts settle. Use setTimeout as reliable fallback
    // (requestAnimationFrame can be unreliable in headless environments).
    document.fonts.ready.then(() => {
      setTimeout(measure, 50)
    })
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
          padding: `${Paper.paddingTop}px ${Paper.paddingX}px ${Paper.paddingBottom}px`,
          boxSizing: 'border-box',
          fontFamily,
        }}
      >
        {childArray.map((child, i) => (
          <div key={i} data-block-idx={i}>
            {isValidElement(child) ? cloneElement(child) : child}
          </div>
        ))}
      </div>

      {/* Rendered pages */}
      <div
        className="chrome py-8 print:py-0 print:!bg-white"
        style={{ backgroundColor: '#D6D4CF', fontFamily }}
      >
        {!measured ? (
          // Before measurement: render single continuous page
          <div
            className="paper mx-auto bg-white shadow-lg"
            style={{
              width: Paper.widthPx,
              minHeight: PAGE_HEIGHT_PX,
              padding: `${Paper.paddingTop}px ${Paper.paddingX}px ${Paper.paddingBottom}px`,
              boxSizing: 'border-box',
            }}
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
                style={{
                  width: Paper.widthPx,
                  minHeight: PAGE_HEIGHT_PX,
                  padding: `${Paper.paddingTop}px ${Paper.paddingX}px ${Paper.paddingBottom}px`,
                  boxSizing: 'border-box',
                }}
              >
                {childArray.slice(page.startIdx, page.endIdx)}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export { USABLE_HEIGHT, PAGE_HEIGHT_PX }
