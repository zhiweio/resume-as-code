import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { DEFAULT_LAYOUT_OPTIONS, type LayoutOptions } from './layout-options'
import { computeLayoutTokens, type LayoutTokens } from './use-layout-tokens'

const LayoutOptionsContext = createContext<LayoutTokens>(
  computeLayoutTokens(DEFAULT_LAYOUT_OPTIONS),
)

interface LayoutOptionsProviderProps {
  options: LayoutOptions
  children: ReactNode
}

export function LayoutOptionsProvider({
  options,
  children,
}: LayoutOptionsProviderProps) {
  // Memoize so unrelated parent re-renders do not hand out a fresh tokens
  // object identity — PaginatedPaper re-measures whenever it changes.
  const tokens = useMemo(() => computeLayoutTokens(options), [options])
  return (
    <LayoutOptionsContext.Provider value={tokens}>
      {children}
    </LayoutOptionsContext.Provider>
  )
}

export function useLayoutTokensContext(): LayoutTokens {
  return useContext(LayoutOptionsContext)
}
