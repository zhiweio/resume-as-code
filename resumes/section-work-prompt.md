Using the session context (candidate info, job analysis, company business analysis, timeline events), generate work experience.

Important requirements:

- **Language**: The content MUST be generated in the language specified by the user or the `language` field from the Job Analysis. Supported languages: `en`, `zh-hans`, `zh-hant-hk`, `zh-hant-tw`, `es`, `fr`, `no`.
- **Adapt to Experience Level**:
  - **Entry Level (0-1y)**: Focus on internship tasks, assistance to senior members, and learning outcomes. Highlight academic projects if work experience is limited.
  - **Mid-Level (1-5y)**: Focus on feature implementation, bug fixing, code quality, and specific technical contributions. Show ability to deliver independently.
  - **Senior Level (6+y)**: Focus on core projects, business problem decomposition, result closure, cross-functional collaboration, and technical strategy.
- **Quantification**: Achievement descriptions should be specific and quantified with numbers and results.
- **Completeness & Relevance**:
  - **Completeness**: You MUST include ALL work experience entries provided in the timeline to ensure a complete career history. Do not omit any roles.
  - **Relevance**: For each role, prioritize and polish the content to highlight aspects most relevant to the target position (JD). If a role is less relevant, keep the description concise but still professional.
- **Authenticity & Inference**:
  - **Strictly Forbidden**: Do NOT invent skills or tech stacks that are completely absent from the candidate's timeline/profile, even if the JD requires them.
  - **Allowed Inference**: If the candidate has demonstrated experience with a broader platform or ecosystem (e.g., "AWS", "Azure", "Big Data processing") in their timeline, you MAY infer and include specific related services mentioned in the JD (e.g., inferring "Step Functions" or "Blob Storage" if general AWS/Azure usage is evident and relevant context exists).

Output format:

- You MUST output valid YAML format.
- The structure should be a list of work experience items under a `work` key.
- Each item should have:
  - `name`: Company Name. **MUST be exactly the same as `company/institution` in the source timeline. Do not abbreviate or change.**
  - `url`: Company URL (optional, omit or leave empty if unknown. DO NOT use empty string `""`)
  - `position`: Job Title
  - `startDate`: Start Date (MMM YYYY or YYYY-MM-DD)
  - `endDate`: End Date (MMM YYYY or YYYY-MM-DD). **For current roles, leave this field empty (null) or omit it. DO NOT use the string "Present" or empty string `""`.**
  - `summary`: Detailed achievements as a multiline string using `|`, formatted as bullet points.
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
