Using the session context (candidate info, job analysis, timeline events), generate projects section.

Important requirements:

- Achievement descriptions should be specific and quantified with numbers and results.
- Emphasize project and role parts most relevant to the target position.

Output format:

- You MUST output valid YAML format.
- The structure should be a list of project items under a `projects` key.
- Each item should have:
  - `name`: Project Name
  - `url`: Project URL (optional)
  - `description`: Brief description (single line)
  - `startDate`: Start Date (MMM YYYY)
  - `endDate`: End Date (MMM YYYY)
  - `summary`: Detailed achievements as a multiline string using `|`, formatted as bullet points.
  - `keywords`: List of technologies or domains.

Example format:

```yaml
projects:
  - name: Project Name
    url: https://project.url
    description: Brief description of the project
    startDate: Jan 2023
    endDate: Present
    summary: |
      - Achievement 1: Description with specific metrics.
      - Achievement 2: Description with specific metrics.
    keywords:
      - 'Keyword1'
      - 'Keyword2'
```

Return the polished content in professional, technical language suitable for a portfolio or resume.
