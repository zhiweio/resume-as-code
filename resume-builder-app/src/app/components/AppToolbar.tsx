import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileDown,
  Languages,
  Link2,
  Loader2,
  Type,
  Wand2,
  XCircle,
} from 'lucide-react'
import { AdvancedLayoutSheet } from './AdvancedLayoutSheet'
import { ResumeBuilderLogo } from './ResumeBuilderLogo'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import {
  DEFAULT_LAYOUT_OPTIONS,
  applyLayoutPreset,
  type LayoutOptions,
} from '../layout/layout-options'
import { cn } from './ui/utils'

export type SourceStatus = 'new-schema' | 'legacy-adapted' | 'invalid'

interface AppToolbarProps {
  sourceStatus: SourceStatus
  diagnosticCount: number
  langOverride: 'zh' | 'en' | null
  onLangChange: (lang: 'zh' | 'en' | null) => void
  showSocialIcons: boolean
  onShowSocialIconsChange: (value: boolean) => void
  layoutOptions: LayoutOptions
  onLayoutChange: (layout: LayoutOptions) => void
  onExport: () => void
  isExporting: boolean
}

function SourceStatusBadge({ status }: { status: SourceStatus }) {
  if (status === 'new-schema') {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 text-emerald-800"
      >
        <CheckCircle2 />
        Valid
      </Badge>
    )
  }

  if (status === 'legacy-adapted') {
    return (
      <Badge
        variant="outline"
        className="border-amber-200 bg-amber-50 text-amber-800"
      >
        <AlertTriangle />
        Legacy adapted
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="border-destructive/30 bg-destructive/5 text-destructive"
    >
      <XCircle />
      Invalid
    </Badge>
  )
}

export function AppToolbar({
  sourceStatus,
  diagnosticCount,
  langOverride,
  onLangChange,
  showSocialIcons,
  onShowSocialIconsChange,
  layoutOptions,
  onLayoutChange,
  onExport,
  isExporting,
}: AppToolbarProps) {
  const exportDisabled = sourceStatus === 'invalid' || isExporting

  return (
    <header className="no-print flex h-11 shrink-0 items-center gap-2 border-b border-border bg-card px-3 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2.5">
        <ResumeBuilderLogo className="size-7" />
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Resume Builder
        </span>
      </div>

      <Separator orientation="vertical" className="h-5" />

      <div className="flex items-center gap-2">
        <SourceStatusBadge status={sourceStatus} />
        {diagnosticCount > 0 && (
          <Badge variant="secondary" className="text-muted-foreground">
            <AlertCircle />
            {diagnosticCount} issue{diagnosticCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={langOverride ?? ''}
                onValueChange={(value) => {
                  onLangChange(value === 'zh' || value === 'en' ? value : null)
                }}
                aria-label="Preview language"
              >
                <ToggleGroupItem
                  value="zh"
                  className="h-7 gap-1.5 px-2.5 text-xs"
                >
                  <Languages />
                  中文
                </ToggleGroupItem>
                <ToggleGroupItem value="en" className="h-7 px-2.5 text-xs">
                  EN
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Override preview language. Click again to use document default.
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={showSocialIcons ? 'icons' : 'text'}
                onValueChange={(value) => {
                  if (value === 'icons' || value === 'text') {
                    onShowSocialIconsChange(value === 'icons')
                  }
                }}
                aria-label="Social link display"
              >
                <ToggleGroupItem
                  value="icons"
                  className="h-7 px-2.5"
                  aria-label="Show social icons"
                >
                  <Link2 />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="text"
                  className="h-7 px-2.5"
                  aria-label="Show social text"
                >
                  <Type />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Social links as icons or text labels
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        <div className="flex items-center gap-0.5 rounded-md border border-border bg-secondary p-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={layoutOptions.enabled ? 'secondary' : 'ghost'}
                size="sm"
                disabled={sourceStatus === 'invalid'}
                className={cn(
                  'h-7 gap-1.5 px-2.5 text-xs',
                  !layoutOptions.enabled && 'text-muted-foreground',
                )}
                onClick={() => {
                  if (layoutOptions.enabled) {
                    onLayoutChange({ ...DEFAULT_LAYOUT_OPTIONS })
                  } else {
                    onLayoutChange(applyLayoutPreset('optimize'))
                  }
                }}
              >
                <Wand2 data-icon="inline-start" />
                {layoutOptions.enabled ? 'Optimized' : 'Optimize'}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-56">
              Quick compact preset. Open Layout for full controls.
            </TooltipContent>
          </Tooltip>

          <AdvancedLayoutSheet
            layout={layoutOptions}
            onChange={onLayoutChange}
            disabled={sourceStatus === 'invalid'}
          />
        </div>

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        <Button
          type="button"
          size="sm"
          className="h-7 gap-1.5 px-3 text-xs"
          disabled={exportDisabled}
          onClick={onExport}
        >
          {isExporting ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <FileDown data-icon="inline-start" />
          )}
          {isExporting ? 'Exporting…' : 'Export PDF'}
        </Button>
      </div>
    </header>
  )
}
