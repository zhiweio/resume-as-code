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
import { paperSheetStyle } from './constants'
import { packBlocksToPages } from './paginate-pack'
import { useLayoutTokensContext } from '../layout/LayoutOptionsContext'

/** Strip block spacing at the top of a page; page margin provides the inset. */
function renderPageBlock(child: ReactNode, blockIdx: number, pageIdx: number) {
  if (!isValidElement(child)) return child

  const props = child.props as {
    style?: CSSProperties
    className?: string
    'data-section-start'?: string
  }
  const style = props.style ?? {}
  const isSectionStart = props['data-section-start'] === 'true'
  const isContinuation = pageIdx > 0 && blockIdx === 0 && !isSectionStart

  let nextClassName = props.className ?? ''
  if (isContinuation) {
    nextClassName = `${nextClassName} paginate-continuation`.trim()
  }

  if (blockIdx !== 0) return child

  if (isContinuation) {
    return cloneElement(child, {
      className: nextClassName,
      style: { ...style, paddingTop: undefined },
    } as { className: string; style: CSSProperties })
  }

  if (!style.paddingTop) return child

  return cloneElement(child, {
    style: { ...style, paddingTop: 0 },
  } as { style: CSSProperties })
}

interface PaginatedPaperProps {
  children: ReactNode
  fontFamily: string
}

/**
 * Paginated paper shell with real A4 page splitting.
 * Measures child blocks, packs them into explicit A4 page containers,
 * and renders stacked pages separated by visual page-break indicators.
 */
export function PaginatedPaper({ children, fontFamily }: PaginatedPaperProps) {
  const { page, options } = useLayoutTokensContext()
  const measureRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<{ startIdx: number; endIdx: number }[]>([])
  const [measured, setMeasured] = useState(false)
  const childArray = Children.toArray(children)
  const paperSheet = paperSheetStyle(page.marginPx)
  const paperPadding = `${page.marginPx}px`

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

      const pageList = packBlocksToPages(blocks, {
        usableHeight: page.usableHeight,
        allowSectionSplit: options.allowSectionSplit,
        allowSubsectionSplit: options.allowSubsectionSplit,
      })
      setPages(pageList)
      setMeasured(true)

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
  }, [children, page.usableHeight, options])

  return (
    <>
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: page.widthPx,
          padding: paperPadding,
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

      <div
        className="chrome bg-workspace py-8 print:bg-white print:py-0"
        style={{ fontFamily }}
      >
        {!measured ? (
          <div
            className="paper mx-auto bg-white shadow-lg print:shadow-none"
            style={paperSheet}
          >
            {children}
          </div>
        ) : (
          pages.map((pageData, pageIdx) => (
            <div key={pageIdx}>
              {pageIdx > 0 && (
                <div
                  className="no-print"
                  style={{
                    width: page.widthPx,
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

              <div
                className="paper mx-auto bg-white shadow-lg print:shadow-none"
                style={paperSheet}
              >
                <div className="page-content">
                  {childArray
                    .slice(pageData.startIdx, pageData.endIdx)
                    .map((child, blockIdx) =>
                      renderPageBlock(child, blockIdx, pageIdx),
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export { Paper } from './constants'
export { USABLE_HEIGHT } from './paginate-pack'
