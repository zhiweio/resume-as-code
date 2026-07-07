import {
  AlignVerticalSpaceAround,
  FileText,
  RotateCcw,
  Settings2,
  SplitSquareHorizontal,
  Type,
} from 'lucide-react'
import type { ComponentProps } from 'react'
import {
  DEFAULT_LAYOUT_OPTIONS,
  applyLayoutPreset,
  isLayoutCustomized,
  resolveLayoutPresetId,
  type LayoutOptions,
  type LayoutPresetId,
} from '../layout/layout-options'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Label } from './ui/label'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'

function LayoutTriggerButton({
  customized,
  disabled,
  ...props
}: {
  customized: boolean
  disabled?: boolean
} & ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant={customized ? 'secondary' : 'outline'}
      size="sm"
      disabled={disabled}
      title="Typography, spacing, margins, and page breaks"
      className="relative h-7 gap-1.5 px-2.5 text-xs"
      {...props}
    >
      <Settings2 data-icon="inline-start" />
      Layout
      {customized && (
        <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-foreground" />
      )}
    </Button>
  )
}

interface AdvancedLayoutSheetProps {
  layout: LayoutOptions
  onChange: (layout: LayoutOptions) => void
  disabled?: boolean
}

const PRESET_LABELS: Record<Exclude<LayoutPresetId, 'custom'>, string> = {
  balanced: 'Balanced',
  optimize: 'Optimize',
  compact: 'Compact',
  airy: 'Airy',
}

function MarginPreview({ marginPx }: { marginPx: number }) {
  const hInset = (marginPx / 794) * 100
  const vInset = (marginPx / 1123) * 100

  return (
    <div className="flex items-center gap-3 rounded-md border border-border/80 bg-muted/30 p-3">
      <div
        className="relative aspect-[794/1123] h-[88px] shrink-0 rounded-sm border border-border bg-white shadow-sm"
        aria-hidden
      >
        <div
          className="absolute rounded-[1px] border border-dashed border-foreground/25 bg-foreground/[0.04]"
          style={{
            top: `${vInset}%`,
            left: `${hInset}%`,
            right: `${hInset}%`,
            bottom: `${vInset}%`,
          }}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-xs font-medium text-foreground">Print area</p>
        <p className="text-xs text-muted-foreground">
          {marginPx}px margin on each edge
        </p>
        <p className="text-[11px] text-muted-foreground">
          Content fits inside the dashed box
        </p>
      </div>
    </div>
  )
}

function ScaleSlider({
  id,
  label,
  description,
  value,
  defaultValue,
  min,
  max,
  step,
  format,
  onChange,
}: {
  id: string
  label: string
  description: string
  value: number
  defaultValue: number
  min: number
  max: number
  step: number
  format: (value: number) => string
  onChange: (value: number) => void
}) {
  const isDefault = Math.abs(value - defaultValue) < step / 2

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
          </Label>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="rounded-sm bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-foreground">
            {format(value)}
          </span>
          {!isDefault && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([next]) => {
          if (next !== undefined) onChange(next)
        }}
        className="**:data-[slot=slider-track]:h-1.5 **:data-[slot=slider-thumb]:size-3.5"
      />
      <div className="flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
        <span>{format(min)}</span>
        <span>Default {format(defaultValue)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

function PaginationOption({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4 rounded-md border border-border/80 bg-card p-3 transition-colors hover:bg-muted/20"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5 shrink-0"
      />
    </label>
  )
}

export function AdvancedLayoutSheet({
  layout,
  onChange,
  disabled,
}: AdvancedLayoutSheetProps) {
  const activePreset = resolveLayoutPresetId(layout)
  const customized = isLayoutCustomized(layout)

  const patch = (partial: Partial<LayoutOptions>) => {
    onChange({ ...layout, ...partial, enabled: true })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <LayoutTriggerButton customized={customized} disabled={disabled} />
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-6 py-5">
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="flex flex-col gap-1">
              <SheetTitle className="text-base">Layout controls</SheetTitle>
              <SheetDescription className="text-xs leading-relaxed">
                Adjust how the resume fills each A4 page. Preview and PDF export
                update as you change settings.
              </SheetDescription>
            </div>
            <Badge variant={customized ? 'default' : 'secondary'}>
              {customized ? 'Custom' : 'Default'}
            </Badge>
          </div>
        </SheetHeader>

        <div className="border-b border-border px-6 py-4">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Presets
          </p>
          <ToggleGroup
            type="single"
            value={activePreset === 'custom' ? undefined : activePreset}
            onValueChange={(value) => {
              if (!value) return
              onChange(
                applyLayoutPreset(value as Exclude<LayoutPresetId, 'custom'>),
              )
            }}
            variant="outline"
            size="sm"
            className="grid w-full grid-cols-4"
          >
            {(
              Object.keys(PRESET_LABELS) as Array<
                Exclude<LayoutPresetId, 'custom'>
              >
            ).map((presetId) => (
              <ToggleGroupItem
                key={presetId}
                value={presetId}
                className="h-8 text-xs"
              >
                {PRESET_LABELS[presetId]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {activePreset === 'custom' && (
            <p className="mt-2 text-xs text-muted-foreground">
              Custom mix — pick a preset or adjust sliders below.
            </p>
          )}
        </div>

        <Tabs
          defaultValue="typography"
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="px-6 pt-4">
            <TabsList className="grid h-9 w-full grid-cols-3">
              <TabsTrigger value="typography" className="gap-1.5 text-xs">
                <Type />
                Type
              </TabsTrigger>
              <TabsTrigger value="spacing" className="gap-1.5 text-xs">
                <AlignVerticalSpaceAround />
                Space
              </TabsTrigger>
              <TabsTrigger value="pagination" className="gap-1.5 text-xs">
                <SplitSquareHorizontal />
                Pages
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-4 px-6 py-4">
              <TabsContent
                value="typography"
                className="mt-0 flex flex-col gap-4"
              >
                <Card className="gap-0 rounded-md py-0 shadow-none">
                  <CardHeader className="border-b border-border/60 px-4 py-3">
                    <CardTitle className="text-sm">Text rhythm</CardTitle>
                    <CardDescription className="text-xs">
                      Global scale applied to every text style on the page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5 px-4 py-4">
                    <ScaleSlider
                      id="font-scale"
                      label="Font size"
                      description="Scales headings, body copy, and metadata together."
                      value={layout.fontScale}
                      defaultValue={DEFAULT_LAYOUT_OPTIONS.fontScale}
                      min={0.85}
                      max={1.15}
                      step={0.01}
                      format={(v) => `${Math.round(v * 100)}%`}
                      onChange={(fontScale) => patch({ fontScale })}
                    />
                    <Separator />
                    <ScaleSlider
                      id="line-height-scale"
                      label="Line height"
                      description="Opens or tightens lines in summaries and bullets."
                      value={layout.lineHeightScale}
                      defaultValue={DEFAULT_LAYOUT_OPTIONS.lineHeightScale}
                      min={0.9}
                      max={1.2}
                      step={0.01}
                      format={(v) => `${Math.round(v * 100)}%`}
                      onChange={(lineHeightScale) => patch({ lineHeightScale })}
                    />
                    <Separator />
                    <ScaleSlider
                      id="bullet-gap-scale"
                      label="Bullet spacing"
                      description="Vertical gap between items in bullet lists."
                      value={layout.bulletGapScale}
                      defaultValue={DEFAULT_LAYOUT_OPTIONS.bulletGapScale}
                      min={0.7}
                      max={1.3}
                      step={0.05}
                      format={(v) => `${Math.round(v * 100)}%`}
                      onChange={(bulletGapScale) => patch({ bulletGapScale })}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="spacing" className="mt-0 flex flex-col gap-4">
                <MarginPreview marginPx={layout.pageMarginPx} />

                <Card className="gap-0 rounded-md py-0 shadow-none">
                  <CardHeader className="border-b border-border/60 px-4 py-3">
                    <CardTitle className="text-sm">Page and blocks</CardTitle>
                    <CardDescription className="text-xs">
                      Control whitespace between sections and inside components.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5 px-4 py-4">
                    <ScaleSlider
                      id="spacing-scale"
                      label="Section and entry gaps"
                      description="Space between work, projects, skills, and other blocks."
                      value={layout.spacingScale}
                      defaultValue={DEFAULT_LAYOUT_OPTIONS.spacingScale}
                      min={0.7}
                      max={1.3}
                      step={0.05}
                      format={(v) => `${Math.round(v * 100)}%`}
                      onChange={(spacingScale) => patch({ spacingScale })}
                    />
                    <Separator />
                    <ScaleSlider
                      id="component-spacing-scale"
                      label="Inside components"
                      description="Section rules, entry headers, and keyword insets."
                      value={layout.componentSpacingScale}
                      defaultValue={
                        DEFAULT_LAYOUT_OPTIONS.componentSpacingScale
                      }
                      min={0.7}
                      max={1.3}
                      step={0.05}
                      format={(v) => `${Math.round(v * 100)}%`}
                      onChange={(componentSpacingScale) =>
                        patch({ componentSpacingScale })
                      }
                    />
                    <Separator />
                    <ScaleSlider
                      id="page-margin"
                      label="Page margin"
                      description="Content inset on all four sides of each A4 sheet."
                      value={layout.pageMarginPx}
                      defaultValue={DEFAULT_LAYOUT_OPTIONS.pageMarginPx}
                      min={24}
                      max={56}
                      step={1}
                      format={(v) => `${v}px`}
                      onChange={(pageMarginPx) => patch({ pageMarginPx })}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="pagination"
                className="mt-0 flex flex-col gap-4"
              >
                <Card className="gap-0 rounded-md py-0 shadow-none">
                  <CardHeader className="border-b border-border/60 px-4 py-3">
                    <CardTitle className="text-sm">Page breaks</CardTitle>
                    <CardDescription className="text-xs">
                      Choose how sections flow when content nears the bottom of
                      a page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 px-4 py-4">
                    <PaginationOption
                      id="allow-section-split"
                      label="Allow sections to span pages"
                      description="When off, a whole section moves to the next page instead of splitting."
                      checked={layout.allowSectionSplit}
                      onCheckedChange={(allowSectionSplit) =>
                        patch({ allowSectionSplit })
                      }
                    />
                    <PaginationOption
                      id="allow-subsection-split"
                      label="Split entries across pages"
                      description="Breaks at title, bullets, and keywords. Individual bullet lines stay intact."
                      checked={layout.allowSubsectionSplit}
                      onCheckedChange={(allowSubsectionSplit) =>
                        patch({ allowSubsectionSplit })
                      }
                    />
                  </CardContent>
                </Card>

                <div className="flex items-start gap-2 rounded-md border border-dashed border-border/80 bg-muted/20 px-3 py-2.5">
                  <FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Continuation blocks get a subtle top rule so mid-section
                    page breaks stay readable in print.
                  </p>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <SheetFooter className="flex-row border-t border-border px-6 py-4">
          <p className="mr-auto hidden text-xs text-muted-foreground sm:block">
            {layout.enabled ? 'Optimization on' : 'Optimization off'}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => onChange({ ...DEFAULT_LAYOUT_OPTIONS })}
          >
            <RotateCcw data-icon="inline-start" />
            Reset all
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
