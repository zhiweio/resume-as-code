---
name: timeline-polishing
description: Polish raw work experience or project descriptions into structured YAML timeline entries using STAR (work) or 3W (projects). Use when the user pastes raw notes about a past job, internship, role, project, or deliverable and asks to polish, structure, format, expand, or convert them to YAML.
---

# Timeline Polishing

Convert raw, free-form descriptions of past experiences into rich, structured YAML files that live in the candidate's master timeline library under `data/timeline/`. These polished entries are the source of truth that the [resume-generation](../resume-generation/SKILL.md) skill later draws from.

## When to trigger

Activate when the user provides raw notes (a paragraph, bullet list, journal entry, old job description, etc.) about either:

- A past **job, role, internship, or employment period** — polish as work experience.
- A specific **project, deliverable, academic project, or hackathon** — polish as a project.

If the type is ambiguous, ask the user one clarifying question before proceeding.

## Inputs you will receive

- Raw text describing the experience.
- Optional: target language. If unspecified, detect it from the input; default to English.

## Outputs you will produce

A single YAML file under `data/timeline/`:

- **Path**: `data/timeline/{Type}_{TimeRange}_{Title}.yml`
  - `Type` — `Work` or `Project`.
  - `TimeRange` — `YYYYMMDD-YYYYMMDD` for completed entries, or `YYYYMMDD-Now` for ongoing entries (e.g. `20221114-20240531`, `20221114-Now`).
  - `Title` — the job title or project name.

## Workflow

### 1. Classify the input

Decide whether the description is a **work experience** or a **project**. If unclear, ask the user.

### 2. Polish using the matching methodology

- **Work experience** → follow [references/work-experience.md](references/work-experience.md). Methodology: **STAR** (Situation, Task, Action, Result). Goal: expand and enrich with industry context, role-standard responsibilities, specific metrics, leadership signals.
- **Project** → follow [references/project.md](references/project.md). Methodology: **3W** (What, Why, How). Goal: expand and enrich with technical depth, architectural decisions, problem-solving nuances.

### 3. Apply the bilingual name convention

If the source material includes **both** English and Chinese organization or school names, store them in the YAML field `company/institution` as `English | 中文`. The downstream resume generator will pick the correct side per target language. If only one official name is available, keep it as-is — do not invent the other side.

### 4. Save the file

Write the polished YAML to `data/timeline/{Type}_{TimeRange}_{Title}.yml` using the structures shown in:

- [assets/timeline-work-experience.example.yml](assets/timeline-work-experience.example.yml)
- [assets/timeline-project.example.yml](assets/timeline-project.example.yml)

## General rules

- **Format**: valid YAML.
- **Authenticity**: never invent skills or tech absent from the source text. You may infer specific services or tools that are standard within a platform the source already mentions (e.g. given "AWS", inferring "Step Functions"). Do not invent platforms.
- **Date format**: prefer `MMM DD, YYYY` inside the YAML (e.g. `Nov 14, 2022`); use the `YYYYMMDD` form **only** in the file name.

## Quick reference

| Need                          | File                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| Work-experience prompt (STAR) | [references/work-experience.md](references/work-experience.md)                             |
| Project prompt (3W)           | [references/project.md](references/project.md)                                             |
| Work YAML template            | [assets/timeline-work-experience.example.yml](assets/timeline-work-experience.example.yml) |
| Project YAML template         | [assets/timeline-project.example.yml](assets/timeline-project.example.yml)                 |
