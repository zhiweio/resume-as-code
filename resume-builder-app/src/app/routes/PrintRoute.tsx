import { useState, useEffect } from 'react'
import { ResumeRenderer } from '../renderer'
import type { RenderModel } from '../../models'

/**
 * Print Route — dedicated route rendered by the Puppeteer export service.
 * No editor chrome. Same rendering components as preview.
 * Signals readiness via window.__RESUME_EXPORT_READY__ after model is loaded
 * and fonts have settled.
 */
export function PrintRoute() {
  const [model, setModel] = useState<RenderModel | null>(null)

  useEffect(() => {
    // Listen for model injection from Puppeteer
    const handler = () => {
      const injected = (window as unknown as Record<string, unknown>)
        .__RESUME_MODEL__ as RenderModel | undefined
      if (injected) {
        console.log('[PrintRoute] Model received via event')
        setModel(injected)
      }
    }

    window.addEventListener('resume-model-ready', handler)

    // Check if model was already injected before listener was registered
    const existing = (window as unknown as Record<string, unknown>)
      .__RESUME_MODEL__ as RenderModel | undefined
    if (existing) {
      console.log('[PrintRoute] Model already present on window')
      setModel(existing)
    }

    return () => window.removeEventListener('resume-model-ready', handler)
  }, [])

  useEffect(() => {
    if (!model) return
    console.log('[PrintRoute] Model set, waiting for fonts + layout...')

    // Wait for fonts, then give layout time to measure and paginate.
    // Use setTimeout (reliable in headless) instead of requestAnimationFrame.
    document.fonts.ready.then(() => {
      console.log('[PrintRoute] Fonts ready, waiting 500ms for pagination...')
      setTimeout(() => {
        console.log('[PrintRoute] Signaling __RESUME_EXPORT_READY__')
        ;(
          window as unknown as Record<string, unknown>
        ).__RESUME_EXPORT_READY__ = true
      }, 500)
    })
  }, [model])

  if (!model) {
    return (
      <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
        Waiting for document…
      </div>
    )
  }

  return <ResumeRenderer model={model} />
}
