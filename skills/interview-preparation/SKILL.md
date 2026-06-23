---
name: interview-preparation
description: Generate a deep-probing Markdown interview preparation guide with candidate risk profiling, prioritized assessment frameworks, and progressive technical Q&A with follow-ups and scoring rubrics. Use when the user provides a Resume, JD Analysis, and Company Business Analysis and asks for an interview guide, interview prep, technical Q&A bank, or "how do I prepare for this interview".
---

# Interview Preparation

Produce a thorough, role-tailored interview preparation guide in Markdown, covering risk profiling and assessment framework, personal pitch, project deep-dives (STAR), deep-probing technical Q&A with progressive follow-ups and scoring rubrics, behavioral preparation, and reverse-interview questions.

## When to trigger

Activate when the user has **all three** of the following and asks for interview prep:

1. A **Resume** (YAML from `data/resumes/` or `data/profiles/`).
2. A **JD Analysis** (e.g. `data/.cache/<Timestamp>/job-analysis.yml`).
3. A **Company Business Analysis** (e.g. `data/.cache/<Timestamp>/company-business-analysis.yml`).

If any of the three is missing, ask the user to provide it (or to run the [resume-generation](../resume-generation/SKILL.md) skill first, which produces the latter two as side effects).

## Inputs you must read

- The provided Resume YAML.
- The provided JD Analysis YAML (the `language` field governs the output language; supported: `en`, `zh-hans`, `zh-hant-hk`, `zh-hant-tw`, `es`, `fr`, `no`).
- The provided Company Business Analysis YAML.

## Outputs you will produce

A single Markdown guide:

- **Path**: `data/interviews/{CandidateName}_{Company}_Interview_Guide.md`
  - `CandidateName` — from Resume `basics.name`.
  - `Company` — from JD Analysis `company`.
  - Replace spaces with underscores `_`.

## Workflow

Generate the guide following the detailed prompt in [references/interview-guide.md](references/interview-guide.md). Required sections:

1. **Technical Deep-Probing Reconnaissance** — Cross-validate resume vs JD, identify gaps, contradictions, and "smokescreens." Generate a "One-Sentence Risk Assessment," "Top 3 Core Skepticisms," and a prioritized Assessment Framework table (`Assessment Area | Relevant Tech Points | Assessment Priority`). Infer experience level (Junior / Mid / Senior / Lead / Manager) from the resume and adjust depth of all subsequent sections accordingly.
2. **Personal Introduction Strategy** — "Tell me about yourself" script tying business background, technical background, and alignment with the target JD and company. Reference the Risk Profile to frame strengths as counterpoints to identified skepticisms. For senior candidates (>5 years), explicitly cover Project Management, Leadership, and Strategic Thinking.
3. **Project Deep Dives** — STAR analysis for **every** project on the resume, with both breadth (architecture) and depth (implementation) coverage.
4. **Deep-Probing Technical Q&A** — 15–20 targeted questions (10–12 for Junior candidates), each with 2–3 follow-up questions and Scoring Points. ~80% anchored to resume tech stack / project experience / JD requirements. Include 2–4 "breadth probe" questions targeting technologies listed as "familiar with" but not core to the JD. Questions progress from shallow (implementation) to deep (architecture). Categories: Specific Technical, Architecture/Design, Domain-Specific, Breadth Probes. **Scoring Points must describe what differentiates a strong answer from a weak one.**
5. **Behavioral & Cultural Fit** — 2–3 level-appropriate behavioral questions with scenario + suggested answer strategy connecting to resume experiences. Where possible, frame scenarios around risks identified in the Reconnaissance phase.
6. **Questions to Ask (Reverse Interview)** — 3 high-quality questions: Business-level, Team/Technical, Current Challenges.

The exact output template lives at the end of [references/interview-guide.md](references/interview-guide.md). A worked example output is at [assets/interview.example.md](assets/interview.example.md).

## General rules

- **Format**: valid Markdown.
- **Language**: the entire guide (headings + body) MUST match the JD Analysis `language` field, unless the user explicitly overrides.
- **Depth**: tailored to the candidate's level — a Lead/Manager guide must include strategic and leadership questions, not just technical ones.
- **Question anchoring**: every question in the Technical Q&A must reference a specific project name, technology, or claim from the candidate's resume. No generic questions.
- **Scoring Points**: must describe what differentiates a strong answer from a weak one, not just list correct topics.

## Quick reference

| Need                        | File                                                           |
| --------------------------- | -------------------------------------------------------------- |
| Full interview-guide prompt | [references/interview-guide.md](references/interview-guide.md) |
| Example output guide        | [assets/interview.example.md](assets/interview.example.md)     |
