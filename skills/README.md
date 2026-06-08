# Resume-as-Code Skills

A portable, vendor-neutral [Agent Skills](https://agentskills.io) package that turns any coding agent — Claude Code, Codex, GitHub Copilot, Cursor, Windsurf, Cline, Trae, OpenCode, Qoder, Aider, Continue, and more — into a resume-as-code workflow assistant.

## What's inside

Three skills, each self-contained as `SKILL.md` + `references/` + `assets/`:

| Skill                                                      | Trigger                                               | Output                                         |
| ---------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| [`resume-generation/`](resume-generation/SKILL.md)         | User provides a Job Description                       | Tailored YAML resume in `data/resumes/`        |
| [`timeline-polishing/`](timeline-polishing/SKILL.md)       | User provides raw work or project notes               | Structured YAML timeline in `data/timeline/`   |
| [`interview-preparation/`](interview-preparation/SKILL.md) | User provides Resume + JD Analysis + Company Analysis | Markdown interview guide in `data/interviews/` |

Each `SKILL.md` is intentionally short (the orchestration). Heavier prompt text lives under `references/` and is loaded by the agent on demand. Example YAML/Markdown templates live under `assets/`.

## Install

From the repo root, run **one command** to wire the skills into your agent of choice:

```bash
pnpm skills:install <agent>   # one specific agent
pnpm skills:install all       # everything supported in this repo
```

Supported `<agent>` values: `claude`, `copilot`, `cursor`, `codex`, `opencode`, `trae`, `windsurf`, `cline`, `qoder`, `aider`, `continue`.

Uninstall: `pnpm skills:uninstall <agent>|all`.

### Claude Code — native plugin marketplace install

Claude Code users can skip the script entirely and install via the built-in marketplace:

```text
/plugin marketplace add zhiweio/resume-as-code
/plugin install resume-as-code-skills@resume-as-code-skills
```

This mirrors how Anthropic distributes their own skills (`/plugin marketplace add anthropics/skills`).

### Zero-config agents (no install step)

These agents auto-discover the workflow via the root [`AGENTS.md`](../AGENTS.md), which is committed to the repo:

- Codex CLI / Codex Web
- OpenCode
- Aider
- Qoder
- Continue
- RooCode
- Recent Cursor versions

## Adding support for a new agent

1. Open [`scripts/install-skills.mjs`](../scripts/install-skills.mjs).
2. Add an entry to the `AGENTS` map describing where the agent expects its rules file.
3. Run `pnpm skills:install <new-agent> --dry-run` to verify.

## Layout

```
skills/
├── resume-generation/
│   ├── SKILL.md
│   ├── references/        # detailed prompts (lazy-loaded)
│   └── assets/            # YAML templates
├── timeline-polishing/
│   ├── SKILL.md
│   ├── references/
│   └── assets/
├── interview-preparation/
│   ├── SKILL.md
│   ├── references/
│   └── assets/
├── .claude-plugin/        # Claude Code plugin manifest
│   └── plugin.json
└── README.md
```

The layout follows the [anthropics/skills](https://github.com/anthropics/skills) convention so every modern skill-aware agent recognizes it out of the box.
