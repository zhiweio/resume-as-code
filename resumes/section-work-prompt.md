Using the session context (candidate info, job analysis, company business analysis, timeline events), generate work experience.

Important requirements:

- **Language**:
  - **CRITICAL**: The content MUST be generated in the language specified in the `job-analysis.yml` -> `language` field.
  - Supported languages: `en`, `zh-hans`, `zh-hant-hk`, `zh-hant-tw`, `es`, `fr`, `no`.
  - If `language` is `zh` or `zh-hans`, output **Simplified Chinese**.
  - If `language` is `en`, output **English**.
  - Ignore the source language of the timeline events; **TRANSLATE** everything to the target language.
  - Do NOT mix languages (e.g., do not output English descriptions if the target is Chinese, except for proper nouns like "AWS", "React", "Kubernetes").
  - For company names, if source `company/institution` uses the bilingual format `English | 中文`, select only the side matching the target language.
  - For `zh`, `zh-hans`, `zh-hant-hk`, and `zh-hant-tw`, use the **Chinese** company name when available.
  - For `en`, `es`, `fr`, `no`, and other non-Chinese target languages, use the **English** company name when available.
  - If only one official company name is available, preserve it as-is. Do **NOT** output both languages unless the user explicitly requests bilingual output.
- **Adapt to Experience Level**:
  - **Entry Level (0-1y)**: Focus on internship tasks, assistance to senior members, and learning outcomes. Highlight academic projects if work experience is limited.
  - **Mid-Level (1-5y)**: Focus on feature implementation, bug fixing, code quality, and specific technical contributions. Show ability to deliver independently.
  - **Senior Level (6+y)**: Focus on core projects, business problem decomposition, result closure, cross-functional collaboration, and technical strategy.
- **Quantification**: Achievement descriptions should be specific and quantified with numbers and results.
- **Completeness & Relevance**:
  - **Completeness**: You MUST include ALL work experience entries provided in the timeline to ensure a complete career history. Do not omit any roles.
  - **Full Project Review Before Writing**: Before drafting the work section, you MUST read and analyze ALL project timeline entries provided in the session context, including projects that may not appear in the final `projects` section.
  - **Project-to-Work Synthesis**: Treat project entries as evidence for the candidate's capabilities, not as a separate checklist to repeat. Extract the most important backend, serverless, platform, architecture, data, integration, delivery, and leadership signals from all projects, then merge them into the most relevant work roles.
  - **Coverage Without Exhaustive Listing**: Ensure the final work section captures the candidate's full capability surface across all projects and roles, but do so by consolidating similar work, merging repeated technologies, and surfacing only the strongest representative outcomes. Do NOT turn each project into its own bullet or paragraph under work experience.
  - **Preserve Important Signals From Omitted Projects**: Assume the final `projects` section will only contain a very small curated subset. If an unselected project contains important JD-relevant capabilities, domain experience, architecture patterns, or delivery outcomes, preserve those signals inside the corresponding work experience entry so they are not lost.
  - **Recency-Based Detail Allocation**: Order roles in reverse chronological order and distribute detail intentionally.
  - **Most Recent Role**: This role should be the most detailed entry in the entire work section. Prioritize business impact, architecture ownership, technical leadership, and the strongest quantified outcomes. Target roughly 4-6 bullet points or about 45-55% of the total work-section detail.
  - **Second Most Recent Role**: Keep this role detailed but clearly shorter than the most recent role. Focus on the most relevant achievements only. Target roughly 2-4 bullet points or about 25-30% of the total work-section detail.
  - **Older Roles**: For all remaining roles, keep the content concise and distilled. Usually use 1-2 bullet points per role, covering only the role scope, the most relevant achievement, and the strongest transferable skill or domain signal. Avoid repeating similar responsibilities across roles.
  - **Relevance**: For each role, prioritize and polish the content to highlight aspects most relevant to the target position (JD). If a role is less relevant, keep the description concise but still professional.
  - **One-Page Budget**: Optimize the work section so that, together with the candidate's basics section, the resume can usually fit within one page. When space is limited, preserve company, title, and dates for every role, but aggressively compress older roles before trimming the two most recent roles.
  - **Compression Rules**: Remove low-signal routine tasks, duplicated technology lists, and repeated wording across roles. Keep only the most differentiating outcomes, ownership signals, and JD-relevant capabilities.
  - **No Project Catalog Behavior**: The work section must read like a role-based career narrative, not like a project inventory. Mention specific project names only when they materially improve credibility or scannability; otherwise summarize the achievement at the role level.
- **Authenticity & Inference**:
  - **Strictly Forbidden**: Do NOT invent skills or tech stacks that are completely absent from the candidate's timeline/profile, even if the JD requires them.
  - **Allowed Inference**: If the candidate has demonstrated experience with a broader platform or ecosystem (e.g., "AWS", "Azure", "Big Data processing") in their timeline, you MAY infer and include specific related services mentioned in the JD (e.g., inferring "Step Functions" or "Blob Storage" if general AWS/Azure usage is evident and relevant context exists).

Output format:

- You MUST output valid YAML format.
- The structure should be a list of work experience items under a `work` key.
- Each item should have:
  - `name`: Company Name. If source `company/institution` is stored as `English | 中文`, choose the side matching the target language. If only one official name is available, preserve it as-is. Do **NOT** output both languages in a monolingual resume.
  - `url`: Company URL (optional, omit or leave empty if unknown. DO NOT use empty string `""`)
  - `position`: Job Title
  - `startDate`: Start Date (MMM YYYY or YYYY-MM-DD)
  - `endDate`: End Date (MMM YYYY or YYYY-MM-DD). **For current roles, leave this field empty (null) or omit it. DO NOT use the string "Present" or empty string `""`.**
  - `summary`: Achievements as a multiline string using `|`, formatted as bullet points. The bullet count and detail density MUST follow the recency rules above: most recent role most detailed, second role moderately detailed, older roles concise. The bullets MUST synthesize relevant signals from all associated projects without degenerating into an exhaustive project list.
  - `keywords`: List of 5-10 most impactful technical skills or domains relevant to this role and the target JD. **Each keyword MUST be ≤ 32 characters.**

Example format:

```yaml
work:
  - name: Company Name
    url: https://company.com
    position: Job Title
    startDate: Jan 2020
    endDate: # Leave empty for Present
    summary: |
      - Achievement 1 with metrics.
      - Achievement 2 with metrics.
    keywords:
      - 'Keyword1'
      - 'Keyword2'
```

Return the polished content in professional, concise language suitable for a resume.
