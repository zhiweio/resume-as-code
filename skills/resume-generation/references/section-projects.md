Using the session context (candidate info, job analysis, company business analysis, timeline events), generate projects section.

Important requirements:

- **Language**:
  - **CRITICAL**: The content MUST be generated in the language specified in the `job-analysis.yml` -> `language` field.
  - Supported languages: `en`, `zh-hans`, `zh-hant-hk`, `zh-hant-tw`, `es`, `fr`, `no`.
  - If `language` is `zh` or `zh-hans`, output **Simplified Chinese**.
  - If `language` is `en`, output **English**.
  - Ignore the source language of the timeline events; **TRANSLATE** everything to the target language.
  - Do NOT mix languages (e.g., do not output English descriptions if the target is Chinese, except for proper nouns like "AWS", "React", "Kubernetes").
- **Mandatory Full Review**: You MUST review ALL available project timeline entries before deciding which projects to output.
- **User Preference First**:
  - If the session context includes one or two user-designated priority projects, prioritize those projects.
  - If the session context includes more than two user-designated projects, keep only the strongest two among them based on JD relevance, business impact, technical depth, and complementarity.
  - If the user did not specify projects, automatically select the two best flagship projects based on JD analysis, company business analysis, business impact, quantified outcomes, technical depth, architectural ownership, and complementarity.
- **Curated Selection Only**: Do NOT list all projects. Output at most **two** projects unless the user explicitly requests more.
- **Resume Length Budget**: Treat the projects section as a concise highlight area that helps keep the overall resume within two pages whenever possible.
- **Distinctiveness Rule**: Prefer two projects that showcase different strengths or domains instead of two nearly identical implementations.
- Achievement descriptions should be specific and quantified with numbers and results.
- Emphasize project and role parts most relevant to the target position.
- **Authenticity & Inference**:
  - **Strictly Forbidden**: Do NOT invent skills or tech stacks that are completely absent from the candidate's timeline/profile, even if the JD requires them.
  - **Allowed Inference**: If the candidate has demonstrated experience with a broader platform or ecosystem (e.g., "AWS", "Azure", "Big Data processing") in their timeline, you MAY infer and include specific related services mentioned in the JD (e.g., inferring "Step Functions" or "Blob Storage" if general AWS/Azure usage is evident and relevant context exists).

Output format:

- You MUST output valid YAML format.
- The structure should be a list of project items under a `projects` key.
- Each item should have:
  - `name`: Project Name
  - `url`: Project URL (optional, omit or leave empty if unknown. DO NOT use empty string `""`)
  - `description`: Brief description (single line)
  - `startDate`: Start Date (MMM YYYY)
  - `endDate`: End Date (MMM YYYY). **For current projects, leave this field empty (null) or omit it. DO NOT use the string "Present" or empty string `""`.**
  - `summary`: Detailed achievements as a multiline string using `|`, formatted as bullet points. Keep each selected project concise and high-signal, usually 2-4 bullets per project.
  - `keywords`: List of 5-10 most impactful technologies or domains relevant to this project and the target JD. **Each keyword MUST be ≤ 32 characters.**

Example format:

```yaml
projects:
  - name: Project Name
    url: https://project.url
    description: Brief description of the project
    startDate: Jan 2023
    endDate: # Leave empty for Present
    summary: |
      - Achievement 1: Description with specific metrics.
      - Achievement 2: Description with specific metrics.
    keywords:
      - 'Keyword1'
      - 'Keyword2'
```

Return the polished content in professional, technical language suitable for a portfolio or resume.
