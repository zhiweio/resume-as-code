Using session context (personal info, **GENERATED Projects**, **GENERATED Work Experience**, **GENERATED Skills**, certifications, open-source), Job Description analysis, and Company Business Analysis, write a targeted professional summary.

**CRITICAL**: You must synthesize the summary based on the _generated_ work and project content to ensure consistency and highlight the most relevant points already selected for this resume.

**CRITICAL**: The summary must center on the candidate's **two most recent roles** and the **up to two flagship projects** already selected for this resume. Do NOT re-expand the full career history or reintroduce omitted projects as a separate catalog.

Important requirements:

- **Language**: The content MUST be generated in the language specified by the user or the `language` field from the Job Analysis. Supported languages: `en`, `zh-hans`, `zh-hant-hk`, `zh-hant-tw`, `es`, `fr`, `no`.
- **Format**: Use 3 concise bullet points by default, with a 4th bullet only when it adds clear JD-relevant differentiation. Keep the summary compact enough to support a resume that stays within two pages whenever possible.
- **Content Strategy**:
  - **Evidence Hierarchy**: Prioritize signals from the two most recent work experiences first, then reinforce them with the selected flagship projects. Older roles and unselected projects may contribute only supporting signals that are already distilled into the generated work content.
  - **Point 1 (Identity & Match)**: Current role/level + key years of experience + primary match to JD (e.g., "Senior Data Engineer with 6+ years of experience specializing in..."). Ground this primarily in the most recent role and strongest current-value capabilities.
    - **Experience Rounding**: Round up experience years slightly for better presentation (e.g., 3.5 years -> "4 years", 3.2 years -> "3+ years").
  - **Point 2 (Technical Core)**: Highlight the strongest technical capabilities and architectural strengths most relevant to the role, especially those evidenced by the two most recent roles and the flagship projects. Favor backend, platform, data, cloud, serverless, integration, and system design signals when they are relevant.
  - **Point 3 (Impact/Leadership)**: Focus on business outcomes, ownership scope, problem-solving, leadership, stakeholder collaboration, or delivery credibility. Show why the candidate is a high-confidence fit for the target role.
  - **Optional Point 4 (Differentiation)**: Use only if it adds strong screening value, such as domain depth, cross-functional breadth, international delivery, open-source contribution, or a standout flagship project signal not yet captured.
- **ATS / First-Screen Optimization**:
  - Weave the most important JD-aligned keywords naturally into the summary, especially role title, domain, platform, and architecture terms that are already supported by the generated work/projects.
  - Optimize for fast HR and AI screening: every bullet should communicate clear fit, proven capability, and business relevance within a few seconds of reading.
- **Compression Rules**:
  - Do NOT summarize every role, every project, or every technology.
  - Do NOT repeat the same capability across multiple bullets.
  - Do NOT list project names unless a flagship project materially improves credibility; prefer summarizing the capability or outcome.
  - Keep bullets dense, evidence-based, and outcome-oriented rather than descriptive or generic.
- **Tone**: Professional, confident, and objective.
- **Avoid**: Generic fluff (e.g., "Hard worker"). Be specific.
- **Authenticity**: Ensure all claims are supported by the candidate's actual experience. Do not fabricate skills to match the JD. Reasonable inference based on broader platform experience is permitted (e.g., inferring specific AWS services if general AWS experience is present).

Output format:

- You MUST output valid YAML format.
- The structure should be a single string under a `summary` key.
- The string should be a multiline string using `|`.

Example format:

```yaml
summary: |
  - Senior Data Engineer with 7+ years of experience building scalable ETL pipelines and data warehouses on AWS.
  - Proficient in Python, SQL, and Spark, with a track record of optimizing data processing efficiency by 40%.
  - Proven ability to lead cross-functional teams and translate business requirements into technical solutions.
```

Return the polished content in professional language suitable for professional profiles, ATS screening, and rapid HR first-pass review.
