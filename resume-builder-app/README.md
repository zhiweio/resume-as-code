# Resume Builder App

A local-first resume workbench with a split-pane Monaco YAML editor and pixel-perfect A4 preview, powered by React, Vite, and Puppeteer.

## Quick Start

```bash
pnpm install    # also installs Chrome for Puppeteer
pnpm dev        # Web preview: :5173, PDF export: :3001

# Production
pnpm build
pnpm start
```

## Architecture

```text
src/
├── app/
│   ├── App.tsx                # Workspace shell (editor + preview + toolbar)
│   ├── renderer/
│   │   ├── ResumeRenderer.tsx # RenderModel → fine-grained blocks
│   │   ├── PaginatedPaper.tsx # Block measurement → A4 page containers
│   │   ├── PaperShell.tsx     # Paper frame with margins
│   │   ├── PrintStyles.tsx    # Print/PDF CSS overrides
│   │   ├── inline-md.ts       # Inline Markdown renderer (bold, italic, links, lists)
│   │   ├── constants.ts       # Font sizes, spacing, page dimensions
│   │   └── components/        # Section-level renderers (Bullets, EntryHead, Keywords, SecHead)
│   ├── routes/
│   │   └── PrintRoute.tsx     # Headless print route for PDF export
│   └── components/ui/         # 50+ shadcn/ui primitives
├── compiler/
│   ├── compile-legacy.ts      # yamlresume format → RenderModel adapter
│   └── compile-new-schema.ts  # New schema v1.0 → RenderModel compiler
├── schema/
│   └── resume-schema.ts       # TypeScript types for new YAML schema v1.0
├── models/
│   └── render-model.ts        # Normalized RenderModel (single renderer input)
└── export-service/
    └── server.ts              # Express + Puppeteer PDF export service (port 3001)
```

### Data flow

```text
YAML input
  → Auto-detect format (legacy vs new schema v1.0)
  → Compiler → normalized RenderModel
  → ResumeRenderer → fine-grained blocks
  → PaginatedPaper → A4 page containers
  → Live preview in browser

PDF export:
  → Puppeteer navigates to /print
  → Injects RenderModel
  → Waits for __RESUME_EXPORT_READY__
  → Generates A4 PDF via headless Chromium
```

### Key technologies

| Layer             | Technology                              |
| ----------------- | --------------------------------------- |
| UI Framework      | React 18 + TypeScript                   |
| Build             | Vite                                    |
| Styling           | Tailwind CSS 4 + shadcn/ui              |
| Editor            | Monaco Editor (VS Code component)       |
| PDF Export        | Puppeteer (headless Chromium) + Express |
| Schema Validation | Zod 4                                   |
| YAML Parsing      | yaml 2.x                                |
| Layout            | React Resizable Panels                  |

## Features

| Feature                  | Description                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| Split Editor + Preview   | Monaco YAML editor left, pixel-perfect A4 preview right                        |
| Live Validation          | Real-time YAML syntax and schema validation with inline diagnostics            |
| Deterministic Pagination | Block-level pagination with keep-together logic                                |
| Optimize Layout          | One-click spacing optimization with adjustable scale (0.7×–1.3×)               |
| PDF Export               | Local Puppeteer + headless Chromium for high-fidelity PDF generation           |
| Language Toggle          | Switch between 中文 and English rendering with one click                       |
| Preview Zoom             | Floating zoom control (scale only — does not affect rendering/export)          |
| Dual Format Support      | Auto-detects legacy yamlresume or new schema v1.0 YAML                         |
| Section Ordering         | Respects `layouts[].sections.order` (legacy) or top-level `order` (new schema) |

## YAML Formats

The builder supports two YAML formats, auto-detected at load time. For full schema documentation with examples and a comparison table, see [docs/yaml-schema.md](../docs/yaml-schema.md).

---

Attribution: Original resume template design from [Figma](https://www.figma.com/design/z6QTMsUYiy6pmHJOuuV76m/IT-Resume-Template-Design).
