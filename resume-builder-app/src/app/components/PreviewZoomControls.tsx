import { ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from './ui/button'

interface PreviewZoomControlsProps {
  zoom: number
  onZoomChange: (zoom: number) => void
}

export function PreviewZoomControls({
  zoom,
  onZoomChange,
}: PreviewZoomControlsProps) {
  return (
    <div className="no-print sticky bottom-3 float-right mr-3 flex items-center gap-0.5 rounded-md border border-border bg-card/95 p-0.5 shadow-sm backdrop-blur-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={() => onZoomChange(Math.max(0.25, +(zoom - 0.1).toFixed(2)))}
        aria-label="Zoom out"
      >
        <ZoomOut />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 min-w-10 px-2 text-xs tabular-nums"
        onClick={() => onZoomChange(1)}
        aria-label="Reset zoom"
      >
        {Math.round(zoom * 100)}%
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={() => onZoomChange(Math.min(2, +(zoom + 0.1).toFixed(2)))}
        aria-label="Zoom in"
      >
        <ZoomIn />
      </Button>
    </div>
  )
}
