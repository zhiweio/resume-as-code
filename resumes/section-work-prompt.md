Using the session context (candidate info, job analysis, timeline events), generate work experience.

Important requirements:

- **Adapt to Experience Level**:
  - **Entry Level (0-1y)**: Focus on internship tasks, assistance to senior members, and learning outcomes. Highlight academic projects if work experience is limited.
  - **Mid-Level (1-5y)**: Focus on feature implementation, bug fixing, code quality, and specific technical contributions. Show ability to deliver independently.
  - **Senior Level (6+y)**: Focus on core projects, business problem decomposition, result closure, cross-functional collaboration, and technical strategy.
- **Quantification**: Achievement descriptions should be specific and quantified with numbers and results.
- **Relevance**: Prioritize and order content by job relevance; highlight parts most relevant to the target position.

Output format:

- You MUST output valid YAML format.
- The structure should be a list of work experience items under a `work` key.
- Each item should have:
  - `name`: Company Name
  - `url`: Company URL (optional, omit or leave empty if unknown. DO NOT use empty string `""`)
  - `position`: Job Title
  - `startDate`: Start Date (MMM YYYY or YYYY-MM-DD)
  - `endDate`: End Date (MMM YYYY or YYYY-MM-DD). **For current roles, leave this field empty (null) or omit it. DO NOT use the string "Present" or empty string `""`.**
  - `summary`: Detailed achievements as a multiline string using `|`, formatted as bullet points.
  - `keywords`: List of key skills or domains.

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
