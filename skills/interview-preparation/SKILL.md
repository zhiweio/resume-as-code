---
name: interview-preparation
description: Generate a comprehensive Markdown interview preparation guide covering three interview types — Deep-Probing Technical Q&A, Breadth Probe Questions, and Behavioral & Cultural Fit. Each question includes quantifiable Scoring Points and a structured Reference Answer, grounded in resume + JD + company research. Use when the user provides a Resume, JD Analysis, and Company Business Analysis and asks for an interview guide, interview prep, technical Q&A bank, or "how do I prepare for this interview".
---

# Interview Preparation

Produce a thorough, role-tailored interview preparation guide in Markdown. The guide covers risk profiling and assessment framework, personal pitch, project deep-dives (STAR), and **three parallel interview-type sections** — Deep-Probing Technical Q&A, Breadth Probe Questions, Behavioral & Cultural Fit — where every question carries **quantifiable Scoring Points** and a **structured Reference Answer**. Closes with reverse-interview questions.

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
2. **Best-Practices Research** — For every high-priority assessment area, search authoritative sources (DeepWiki, Context7, Web Search, WebFetch) to gather current best practices, canonical patterns, and pitfalls. These findings anchor the Reference Answers and Scoring Points in sections 5–7, so the guide reflects what a strong practitioner would actually say, not generic textbook material.
3. **Personal Introduction Strategy** — "Tell me about yourself" script tying business background, technical background, and alignment with the target JD and company. Reference the Risk Profile to frame strengths as counterpoints to identified skepticisms. For senior candidates (>5 years), explicitly cover Project Management, Leadership, and Strategic Thinking.
4. **Project Deep Dives** — STAR analysis for **every** project on the resume, with both breadth (architecture) and depth (implementation) coverage.
5. **Deep-Probing Technical Q&A** — 10–15 targeted questions (8–10 for Junior candidates), each with 2–3 follow-up questions, quantifiable Scoring Points, and a structured Reference Answer. ~80% anchored to resume tech stack / project experience / JD requirements. Questions progress from shallow (implementation) to deep (architecture). Categories: Specific Technical, Architecture/Design, Domain-Specific.
6. **Breadth Probe Questions** — 3–5 questions targeting technologies the resume lists as "familiar with," "exposure to," or "knowledge of" that are NOT core JD requirements. Each question carries follow-ups, quantifiable Scoring Points, and a Reference Answer. These assess intellectual honesty, learning breadth, and transferable reasoning.
7. **Behavioral & Cultural Fit** — 3–5 level-appropriate behavioral questions. Each carries a scenario, quantifiable Scoring Points, and a STAR-structured Reference Answer connecting to resume experiences. Where possible, frame scenarios around risks identified in the Reconnaissance phase.
8. **Questions to Ask (Reverse Interview)** — 3 high-quality questions: Business-level, Team/Technical, Current Challenges.

The exact output template lives at the end of [references/interview-guide.md](references/interview-guide.md). A worked example output is at [assets/interview.example.md](assets/interview.example.md).

## General rules

- **Format**: valid Markdown.
- **Language**: the entire guide (headings + body) MUST match the JD Analysis `language` field, unless the user explicitly overrides.
- **Depth**: tailored to the candidate's level — a Lead/Manager guide must include strategic and leadership questions, not just technical ones.
- **Question anchoring**: every question in sections 5–7 must reference a specific project name, technology, or claim from the candidate's resume, OR a concrete business situation from the Company Analysis. No generic questions.
- **Scoring Points (quantifiable)**: every question must use the 4-tier rubric defined in [references/interview-guide.md](references/interview-guide.md) — `Weak (1–2)`, `Adequate (3–4)`, `Strong (5)`, `Exceptional (6)`. Each tier must list **observable, countable behaviors** (e.g., "names ≥2 alternatives," "cites a concrete production metric," "describes a failure mode"), not vague adjectives.
- **Reference Answers**: every question must include a Reference Answer structured as `Core Answer → Technical Detail → Trade-offs / Alternatives → Resume Connection` (Behavioral section uses `STAR` instead). Reference Answers must reflect the best-practices research from section 2 and stay authentic to the candidate's actual resume — never invent experience the candidate does not have.
- **Authenticity**: never invent skills, projects, or metrics absent from the resume. Inferring specific services within a platform the candidate already uses (e.g. AWS → "Step Functions") is allowed. Where the Reference Answer must cover ground the candidate lacks, explicitly mark it as a `Gap to Prepare` and provide a concise learning prompt.

## Quick reference

| Need                        | File                                                           |
| --------------------------- | -------------------------------------------------------------- |
| Full interview-guide prompt | [references/interview-guide.md](references/interview-guide.md) |
| Example output guide        | [assets/interview.example.md](assets/interview.example.md)     |
