---
name: resume-generation
description: Generate a highly targeted YAML resume from a Job Description. Use when the user provides a JD (job description, job posting, job ad, role description) and asks for a tailored resume, an updated resume, a resume polish, or a resume that matches the role.
---

# Resume Generation

Produce one tailored resume in YAML for a single Job Description, by combining the candidate's master timeline with JD-specific analysis. The result is validated and placed under `data/resumes/`.

## When to trigger

Activate when the user supplies a Job Description (raw text, a link, or a file path) and asks for a resume, a tailored resume, or a resume for that role.

## Inputs you must read

- `data/profiles/basics.yml`
- `data/profiles/education.yml`
- `data/profiles/certificates.yml`
- All files under `data/timeline/*.yml`
- The user-provided JD

## Outputs you will produce

- Intermediate artifacts in `data/.cache/<UTC-Timestamp>/` (one per generation run).
- Final resume in `data/resumes/{CandidateName}_{JobTitle}_{Company}.yml`.

## Review & Revision Options

Before starting the pipeline, present the user with these options:

1. **Auto review + revise** — should the pipeline automatically review and revise the resume after De-AI? (default: `yes`)
2. **Revision rounds** — how many review-revise cycles to run? (default: `1`, options: `1` / `2` / `3`)
3. **yamlresume compatibility** — should the final output pass `pnpm yamlresume validate`? (default: `no`)

Present as a single prompt:

> Resume generation pipeline ready. Quick setup:
>
> 1. Auto review & revise after generation? [Y/n]
> 2. Review-revise rounds? [1/2/3] (default: 1)
> 3. yamlresume format compatibility? [y/N] (default: no)

If the user does not respond, use defaults (`yes`, `1`, `no`). Store the answers in the run context for steps 9 and 10.

## Workflow

### 1. Initialize a run directory

Create `data/.cache/<UTC-Timestamp>/` (e.g. `data/.cache/20260608_104500/`). All intermediate artifacts for this run go here.

### 2. Analyze the company and business context

Follow [references/company-business-analysis.md](references/company-business-analysis.md). Save the result to `data/.cache/<Timestamp>/company-business-analysis.yml`.

Use DeepWiki, Context7, and Web Search as directed in the reference to build a complete picture of the company's business lines, strategic direction, tech stack, and the business unit this role supports. This output is **required input** for the next step.

### 3. Analyze the JD

Follow [references/job-analysis.md](references/job-analysis.md). Save the result to `data/.cache/<Timestamp>/job-analysis.yml`. The `language` field detected here governs the entire downstream pipeline.

This step **must consume the company business analysis** from step 2. The JD alone is not enough — job requirements are inseparable from business context. The output includes a `rewritten_jd` field that is sharper and more honest than the raw HR posting. The resume generation steps target this rewritten JD, not the original.

### 4. Gather context and match timelines

- Read all files in `data/timeline/`.
- Select the work and project entries most relevant to the Job Analysis and Company Analysis. Filter out clearly irrelevant ones; prioritize the rest.
- **Project priority confirmation**: if the candidate has more than two viable projects, ask the user to nominate up to two priority projects. If the user does not specify, auto-select the two best flagship projects based on JD relevance, business impact, quantified outcomes, technical depth, architectural ownership, and complementarity.
- **Non-selected projects are still mined for signal**: any unselected project that contains JD-relevant capability, domain experience, architecture, or delivery outcomes must contribute those signals into the generated Work Experience or Skills section so they are not lost.
- **Resume length budget**: optimize for focus and scannability, ideally fitting within **two pages**. Preserve complete chronology, but compress older roles and non-flagship project detail before trimming the two highlighted projects.
- **Name localization**: if a school or organization name is stored in bilingual form `English | 中文`, output only one side based on target language — Chinese side for `zh`, `zh-hans`, `zh-hant-hk`, `zh-hant-tw`; English side for `en`, `es`, `fr`, `no`. Do **NOT** output both names in a monolingual resume.

### 5. Generate sections, in this order

Pass Job Analysis (including `language`), Company Business Analysis, and the matched context to each step. Save each output under `data/.cache/<Timestamp>/`.

1. **Projects** — see [references/section-projects.md](references/section-projects.md). At most **two** highlighted projects. Save as `section-projects.yml`.
2. **Work Experience** — see [references/section-work.md](references/section-work.md). Save as `section-work.yml`.
3. **Skills** — see [references/section-skills.md](references/section-skills.md). Save as `section-skills.yml`.
4. **Personal Summary** — see [references/section-personal-summary.md](references/section-personal-summary.md). **Crucial**: also pass the generated `section-projects.yml`, `section-work.yml`, and `section-skills.yml` so the summary reflects the tailored resume. Save as `section-personal-summary.yml`.

Detailed length budgets, ATS rules, supported Markdown subset, and authenticity rules live in [references/overview.md](references/overview.md). Read it before generating sections.

### 6. Assemble the final resume

Merge into one YAML file using the structure in [assets/resume.example.yml](assets/resume.example.yml) (use it as a structural template only — do not copy its content). Sources:

- `data/profiles/basics.yml` (basics — merge the generated summary into `basics.summary`)
- `data/profiles/education.yml`
- `data/profiles/certificates.yml`
- `data/.cache/<Timestamp>/section-{personal-summary,skills,work,projects}.yml`

**Section order is strict** — `content` must follow `layouts.sections.order`:

```
basics → education → work → skills → certificates → projects
```

**Locale**: set `locale.language` from the Job Analysis `language` field, or to the language the user explicitly requested. Supported: `en`, `zh-hans`, `zh-hant-hk`, `zh-hant-tw`, `es`, `fr`, `no`.

**Layout defaults** (match the structure in `assets/resume.example.yml`):

- LaTeX engine: `template: jake`, font size `10pt | 11pt | 12pt` (default `11pt`), page margins `1.5cm` all sides, `showPageNumbers: true`.
- Markdown engine: defaults.
- HTML engine: `template: jake`, font size in `px` from `14px` to `20px` (default `16px`).

### 7. De-AI the resume text

After assembling the YAML, run a humanizer pass to strip AI writing patterns from all free-text fields. This step makes the resume read as human-written.

**Select the humanizer based on `language`** from Job Analysis:

| Language codes                              | Humanizer reference                                      |
| ------------------------------------------- | -------------------------------------------------------- |
| `en`, `es`, `fr`, `no`                      | [references/humanizer-en.md](references/humanizer-en.md) |
| `zh`, `zh-hans`, `zh-hant-hk`, `zh-hant-tw` | [references/humanizer-zh.md](references/humanizer-zh.md) |

**Fields to process** (string values only — never touch keys, dates, URLs, or structure):

- `basics.summary`
- Each work entry's `summary` and `highlights[]`
- Each project entry's `summary` and `highlights[]`
- Skills group `summary` (if present)
- Any `description` fields

**Constraints**:

- Preserve YAML validity — edit string values in place.
- Rewrites must be the **same length or shorter**, never longer.
- The resume is professional register; skip personality/soul injections.
- No em dashes (—) or en dashes (–) in the final output.
- Save the humanized YAML back to the same file, overwriting the pre-humanized version.

### 8. Review the resume

Follow [references/resume-review.md](references/resume-review.md). Read the De-AI'd resume YAML, `job-analysis.yml`, and `company-business-analysis.yml`. Save the review output to `data/.cache/<Timestamp>/resume-review.yml`.

The review produces a structured YAML analysis covering first impression, deep audit (holistic + per-section), revision blueprint, and final verdict.

**HITL checkpoint** (skipped in auto mode):

If the user chose auto review+revise at startup, proceed directly to step 9. Otherwise, present the review summary (final_verdict + summary counts) and ask:

> Review complete. Score: {score}/100 | Issues: {total} ({fail} critical, {warn} warnings). Would you like to revise? [y/N]

If the user declines, skip step 9 and proceed to step 10.

### 9. Revise the resume (optional)

If revision was selected (auto or HITL-confirmed):

Follow [references/resume-revision.md](references/resume-revision.md). Read `resume-review.yml` and the current resume YAML. Produce the revised resume and overwrite the assembled YAML file.

**Mandatory De-AI after every revision**: after the revision overwrites the YAML, immediately run the humanizer pass (step 7 rules) on the revised text. The humanizer selection (English vs Chinese) is the same as step 7. This ensures the final output is always free of AI writing patterns — regardless of how many revision rounds run.

**Multi-round loop**: after the humanizer pass, if more rounds remain (based on startup option), loop back to step 8 for another review pass. Each round's review is saved as `resume-review-round{N}.yml` in the same cache directory.

```
Round 1: review -> revise -> humanize
Round 2: re-review -> revise -> humanize
Round 3: re-review -> revise -> humanize (final)
```

After the final round (or if user declines revision), proceed to step 10.

### 10. Name and save the final file

- **File path**: `data/resumes/{CandidateName}_{JobTitle}_{Company}.yml`
  - `CandidateName` — from `data/profiles/basics.yml` (`basics.name`).
  - `JobTitle` — from Job Analysis (`title`).
  - `Company` — from Job Analysis (`company`).
  - Join with underscores `_`. **Preserve spaces inside each part** (do not replace spaces within a name/title/company with underscores).
- Save the assembled YAML.
- **Validate** (only if the user opted in to yamlresume compatibility at startup):

  ```bash
  pnpm yamlresume validate "data/resumes/{CandidateName}_{JobTitle}_{Company}.yml"
  ```

  If validation fails, report the errors and let the user decide whether to fix or keep the file as-is.

## General rules (apply to every section)

- **Format**: output must be valid YAML.
- **Rich text**: `summary` fields support a limited Markdown subset only — Bold, Italic, Links, Lists (ordered, unordered, nested). **Forbidden**: headings, blockquotes, images, horizontal rules, tables.
- **Dates**: align with the format in `assets/resume.example.yml`. For current roles or projects, **omit `endDate` or set it to null**. Do NOT use `"Present"` or `""`.
- **URLs**: omit if unknown, do NOT use `""`.
- **Forbidden sources**: never read or copy content from `*.example.yml` files. They are structural references only.

## Quick reference

| Need                                      | File                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| JD analysis prompt                        | [references/job-analysis.md](references/job-analysis.md)                           |
| Company / business analysis prompt        | [references/company-business-analysis.md](references/company-business-analysis.md) |
| Projects section prompt                   | [references/section-projects.md](references/section-projects.md)                   |
| Work Experience section prompt            | [references/section-work.md](references/section-work.md)                           |
| Skills section prompt                     | [references/section-skills.md](references/section-skills.md)                       |
| Personal Summary section prompt           | [references/section-personal-summary.md](references/section-personal-summary.md)   |
| Overall content principles                | [references/overview.md](references/overview.md)                                   |
| De-AI: English & romance languages        | [references/humanizer-en.md](references/humanizer-en.md)                           |
| De-AI: Chinese (simplified & traditional) | [references/humanizer-zh.md](references/humanizer-zh.md)                           |
| Resume quality review prompt              | [references/resume-review.md](references/resume-review.md)                         |
| Resume revision prompt                    | [references/resume-revision.md](references/resume-revision.md)                     |
| Review output structural template         | [assets/review.example.yml](assets/review.example.yml)                             |
| Resume YAML structural template           | [assets/resume.example.yml](assets/resume.example.yml)                             |
| Example JD                                | [assets/jd.example.txt](assets/jd.example.txt)                                     |
| Per-section example outputs               | [assets/section-\*.example.yml](assets/)                                           |
