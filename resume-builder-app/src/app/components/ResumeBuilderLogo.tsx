import { cn } from './ui/utils'

interface ResumeBuilderLogoProps {
  className?: string
}

/**
 * Resume Builder brand mark — A4 sheet with margin guide and section rules.
 * Keep in sync with public/favicon.svg.
 */
export function ResumeBuilderLogo({ className }: ResumeBuilderLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="7" className="fill-primary" />
      <rect
        x="7"
        y="5"
        width="18"
        height="22"
        rx="2"
        className="fill-primary-foreground"
      />
      <rect
        x="10"
        y="9"
        width="1.25"
        height="14"
        rx="0.625"
        className="fill-primary"
        opacity="0.14"
      />
      <rect
        x="12.5"
        y="9.5"
        width="8.5"
        height="2"
        rx="1"
        className="fill-primary"
      />
      <rect
        x="12.5"
        y="13.25"
        width="10.5"
        height="1"
        rx="0.5"
        className="fill-primary"
        opacity="0.42"
      />
      <rect
        x="12.5"
        y="15.75"
        width="9"
        height="1"
        rx="0.5"
        className="fill-primary"
        opacity="0.32"
      />
      <rect
        x="12.5"
        y="18.25"
        width="10"
        height="1"
        rx="0.5"
        className="fill-primary"
        opacity="0.32"
      />
      <rect
        x="12.5"
        y="20.75"
        width="6.5"
        height="1"
        rx="0.5"
        className="fill-primary"
        opacity="0.22"
      />
    </svg>
  )
}
