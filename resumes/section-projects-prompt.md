Using the session context (candidate info, job analysis, company business analysis, timeline events), generate projects section.

Important requirements:

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
  - `summary`: Detailed achievements as a multiline string using `|`, formatted as bullet points.
  - `keywords`: List of technologies or domains. **Each keyword MUST be ≤ 32 characters.**

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
