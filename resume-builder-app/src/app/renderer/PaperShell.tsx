import type { ReactNode } from 'react'
import { Paper } from './constants'

interface PaperShellProps {
  children: ReactNode
  fontFamily: string
}

/** A4 paper container with the standard chrome background. */
export function PaperShell({ children, fontFamily }: PaperShellProps) {
  return (
    <div
      className="chrome min-h-screen py-8 print:py-0"
      style={{ backgroundColor: '#D6D4CF', fontFamily }}
    >
      <div
        className="paper mx-auto bg-white shadow-lg"
        style={{
          width: Paper.widthPx,
          padding: `${Paper.paddingTop}px ${Paper.paddingX}px ${Paper.paddingBottom}px`,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  )
}
