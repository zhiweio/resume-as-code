# Agents Guide — Resume as Code

This repository is a **resume-as-code** project. All career data lives in modular YAML files, and three Agent Skills turn AI coding agents into automated resume / interview assistants.

This file follows the [AGENTS.md open standard](https://agents.md) and is the canonical entry point for every coding agent (Codex, OpenCode, Aider, Qoder, Continue, RooCode, Cursor, Windsurf, Cline, Trae, GitHub Copilot, Claude Code, etc.).

## Skills

Three skills are available under [`skills/`](skills/). Read the full `SKILL.md` for any skill you intend to use — each is self-contained with its own prompts under `references/` and YAML templates under `assets/`.

| Skill                     | When to trigger                                                                                       | Where to read                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **resume-generation**     | The user provides a Job Description and asks for a tailored resume.                                   | [skills/resume-generation/SKILL.md](skills/resume-generation/SKILL.md)         |
| **timeline-polishing**    | The user provides raw work-experience or project notes and asks to polish them into structured YAML.  | [skills/timeline-polishing/SKILL.md](skills/timeline-polishing/SKILL.md)       |
| **interview-preparation** | The user provides a Resume + JD Analysis + Company Business Analysis and asks for an interview guide. | [skills/interview-preparation/SKILL.md](skills/interview-preparation/SKILL.md) |

If you are unsure which skill applies, classify the user's input first: a JD → `resume-generation`; raw experience notes → `timeline-polishing`; a request to prep for an interview with the three context files → `interview-preparation`.

## General rules (apply to every skill)

- **Output format**: every generated artifact under `data/` must be **valid YAML or Markdown** as specified by the relevant skill.
- **Rich text in YAML `summary` fields**: only the following Markdown syntax is supported — **Bold**, _Italic_, `[Links](url)`, unordered/ordered/nested lists. Do **NOT** use headings, blockquotes, images, horizontal rules, or tables.
- **Dates**: align with the format shown in `skills/resume-generation/assets/resume.example.yml`. For ongoing roles or projects, **omit `endDate` or set it to null** — do NOT use `"Present"` or `""`.
- **Bilingual organization names**: when stored as `English | 中文`, output only one side in the final resume — Chinese for target languages `zh`, `zh-hans`, `zh-hant-hk`, `zh-hant-tw`; English for `en`, `es`, `fr`, `no`. Do NOT output both unless the user explicitly asks for a bilingual resume.
- **Authenticity**: never invent skills or tech stacks absent from the candidate's timeline. Inferring specific services within a platform the candidate already uses (e.g. AWS → "Step Functions") is allowed.
- **Forbidden sources**: never read or copy content from `*.example.yml` / `*.example.md` files — they are structural templates only.
- **Validation**: after generating a resume YAML, validate it with:

  ```bash
  pnpm yamlresume validate <path-to-resume.yml>
  ```

## Repository layout

```
AGENTS.md             # This file — universal entry point for any agent
README.md             # Project overview and quickstart
skills/               # The three Agent Skills (read these for workflow detail)
scripts/              # The one-command installer
resume-builder-app/   # Local-first web app for live preview + PDF export
data/                 # All user-owned content lives here
├── profiles/         #   Candidate's static data (basics, education, certificates)
├── timeline/         #   Master timeline library (polished work + project YAML)
├── drafts/           #   Raw notes waiting to be polished into the timeline
├── resumes/          #   Final tailored resumes
├── interviews/       #   Generated interview guides
└── .cache/           #   Per-run intermediate artifacts (gitignored)
```

## For agent runtimes

- **Claude Code**: `.claude/skills/` is created by the installer (`pnpm skills:install claude`) and symlinks each skill from `skills/<name>` for live-reload. You can also install via the plugin marketplace — see [skills/README.md](skills/README.md).
- **AGENTS.md-native agents** (Codex, OpenCode, Aider, Qoder, Continue, RooCode, recent Cursor): this file is your entry point — no install step needed.
- **Other agents** (GitHub Copilot, Cursor explicit, Windsurf, Cline, Trae): the installer materializes a thin pointer file in the location each agent expects. Run `pnpm skills:install <agent>` once.
