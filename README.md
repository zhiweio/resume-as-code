# Resume as Code

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Node.js](https://img.shields.io/badge/Node.js-≥18-green.svg)](https://nodejs.org) [![pnpm](https://img.shields.io/badge/pnpm-≥9-orange.svg)](https://pnpm.io)

</div>

<div align="center">

**Stop copy-pasting resumes.** Maintain a single YAML timeline of your career, and let AI agents generate perfectly targeted resumes for every job application — in minutes, not hours.

</div>

![Resume Builder App Screenshot](assets/app-screenshot.png)

> [View sample resume (EN · PDF)](assets/resume.pdf) · [查看中文简历 (PDF)](assets/resume_zh.pdf)

---

## Table of Contents

- [Highlights](#highlights)
- [Quick Start](#quick-start)
- [Resume Builder App](#resume-builder-app)
- [AI Agent Skills](#ai-agent-skills)
- [Project Structure](#project-structure)
- [YAML Resume Schema](#yaml-resume-schema)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Highlights

- **Single source of truth** — all career data lives in modular YAML files (profiles, timeline, drafts)
- **3 AI agent skills** — resume generation, timeline polishing, and interview preparation, powered by LLMs
- **10-step generation pipeline** — company research → JD analysis → section generation → de-AI humanization → quality review → revision
- **Local-first web workbench** — Monaco YAML editor + pixel-perfect A4 preview + one-click PDF export via Puppeteer
- **Dual YAML format** — auto-detects both the new schema v1.0 and legacy [YAMLResume](https://yamlresume.dev/docs) format
- **Multi-language** — English, Simplified/Traditional Chinese, Spanish, French, Norwegian, with one-click toggle
- **11+ agent support** — works with Claude Code, Codex, GitHub Copilot, Cursor, Windsurf, Cline, Trae, and more

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18 and [pnpm](https://pnpm.io) ≥ 9
- An AI coding agent (e.g., [Claude Code](https://claude.ai/claude-code), GitHub Copilot, Cursor, etc.)

### 1. Install skills for your agent

```bash
git clone https://github.com/zhiweio/resume-as-code.git
cd resume-as-code
pnpm install
pnpm skills:install <agent>   # e.g. claude, copilot, cursor, windsurf, cline
```

See the full [agent compatibility table](#agent-compatibility) below.

### 2. Build your timeline

Open your AI agent and paste raw descriptions of your past jobs or projects. The **Timeline Polishing Agent** will structure them using STAR (work) or 3W (project) methodology and save to `data/timeline/`.

### 3. Configure your profile

Fill in your static data in `data/profiles/`:

| File               | Content                                           |
| ------------------ | ------------------------------------------------- |
| `basics.yml`       | Name, phone, email, URL, summary, social profiles |
| `education.yml`    | Institutions, degrees, dates                      |
| `certificates.yml` | Certifications                                    |

Example templates are provided — copy `basics.example.yml` → `basics.yml` and edit.

### 4. Generate a tailored resume

Paste a Job Description into your agent. The **Resume Generation Agent** will:

1. Research the company's business context
2. Deep-analyze the JD to infer actual role requirements
3. Match relevant experiences from your timeline
4. Generate tailored sections (projects → work → skills → summary)
5. Assemble, de-AI humanize, review, and optionally revise

Output: `data/resumes/{Name}_{JobTitle}_{Company}.yml`

### 5. Preview and export PDF

```bash
cd resume-builder-app
pnpm install    # also installs Chrome for Puppeteer
pnpm dev
```

Open [localhost:5173](http://localhost:5173), load your YAML, preview, optimize layout, and export PDF.

---

## Resume Builder App

A local-first resume workbench with a split-pane editor/preview layout, built with React, Vite, Monaco Editor, Tailwind CSS, and Puppeteer.

**Key features:**

| Feature                  | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| Split Editor + Preview   | Monaco YAML editor left, pixel-perfect A4 preview right             |
| Live Validation          | Real-time YAML syntax and schema validation with inline diagnostics |
| Deterministic Pagination | Block-level pagination with keep-together logic                     |
| Optimize Layout          | One-click spacing optimization (0.7×–1.3× scale)                    |
| PDF Export               | Local Puppeteer + headless Chromium for high-fidelity PDF           |
| Language Toggle          | Switch 中文 / English rendering with one click                      |
| Dual Format              | Auto-detects legacy yamlresume or new schema v1.0 YAML              |

**Quick start:**

```bash
cd resume-builder-app
pnpm install
pnpm dev        # Web: :5173, PDF export: :3001
pnpm build      # Production build
```

The app also supports the [YAMLResume CLI](https://yamlresume.dev/docs) for LaTeX-based PDF generation:

```bash
pnpm yamlresume build "data/resumes/Your_Resume.yml"
```

See [`resume-builder-app/README.md`](resume-builder-app/README.md) for full architecture and development details.

---

## AI Agent Skills

Three portable [Agent Skills](https://agentskills.io) under [`skills/`](skills/), each self-contained as `SKILL.md` + `references/` + `assets/`:

| Skill                                                            | Trigger                                 | Output                                         |
| ---------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------- |
| [`resume-generation`](skills/resume-generation/SKILL.md)         | User provides a Job Description         | Tailored YAML resume in `data/resumes/`        |
| [`timeline-polishing`](skills/timeline-polishing/SKILL.md)       | User provides raw work or project notes | Structured YAML in `data/timeline/`            |
| [`interview-preparation`](skills/interview-preparation/SKILL.md) | Resume + JD Analysis + Company Analysis | Markdown interview guide in `data/interviews/` |

### Agent compatibility

```bash
pnpm skills:install <agent>          # one agent
pnpm skills:install all              # all supported
pnpm skills:uninstall <agent>|all    # clean removal
```

| Agent                                                                         | How                                                                              |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Claude Code**                                                               | `pnpm skills:install claude` or `/plugin marketplace add zhiweio/resume-as-code` |
| **GitHub Copilot**                                                            | Zero-config (committed `.github/copilot-instructions.md`)                        |
| **Codex** / **OpenCode** / **Aider** / **Qoder** / **Continue** / **RooCode** | Zero-config (reads `AGENTS.md`)                                                  |
| **Cursor**                                                                    | Zero-config (via `AGENTS.md`) or `pnpm skills:install cursor`                    |
| **Trae**                                                                      | Zero-config (committed `.trae/rules/project_rules.md`)                           |
| **Windsurf**                                                                  | `pnpm skills:install windsurf`                                                   |
| **Cline** / **RooCode**                                                       | `pnpm skills:install cline`                                                      |

See [`skills/README.md`](skills/README.md) for detailed agent instructions and how to add new agents.

---

## Project Structure

```text
.
├── AGENTS.md                 # Universal entry point for all coding agents
├── skills/                   # Three portable Agent Skills
│   ├── resume-generation/    #   JD → tailored YAML resume (10-step pipeline)
│   ├── timeline-polishing/   #   Raw notes → STAR/3W YAML timeline
│   └── interview-preparation/#   Resume + JD → interview guide
├── scripts/
│   └── install-skills.mjs    # One-command multi-agent installer
├── resume-builder-app/       # Local-first web workbench (React + Vite + Puppeteer)
├── data/                     # All user-owned content
│   ├── profiles/             #   Static candidate data (basics, education, certificates)
│   ├── timeline/             #   Master timeline library (polished YAML)
│   ├── drafts/               #   Raw notes for polishing
│   ├── resumes/              #   Generated tailored resumes
│   ├── interviews/           #   Generated interview guides
│   └── .cache/               #   Per-run intermediate artifacts (gitignored)
└── docs/
    └── yaml-schema.md        # YAML format reference (new schema v1.0 + legacy)
```

---

## YAML Resume Schema

The builder supports two YAML formats, auto-detected at load time:

- **New Schema v1.0** — discriminated section types, stable IDs, visibility flags, layout hints, theme overrides
- **Legacy (YAMLResume)** — compatible with the [YAMLResume](https://yamlresume.dev/docs) ecosystem and its LaTeX compiler

For full schema documentation with examples and a comparison table, see **[docs/yaml-schema.md](docs/yaml-schema.md)**.

---

## License

[MIT](LICENSE)

---

## Acknowledgments

- [blader/humanizer](https://github.com/blader/humanizer) — English AI writing pattern detection and removal
- [op7418/humanizer-zh](https://github.com/op7418/humanizer-zh) — Chinese AI writing pattern detection and removal
- [itMrBoy/resumePolice](https://github.com/itMrBoy/resumePolice) — Comprehensive resume review framework
