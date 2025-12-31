Using session context (personal info, projects, work experience, skills, certifications, open-source), write a conceptual highlight summary.

Important requirements:

- **Adapt to Experience Level**:
  - **Entry Level (0-1y)**: Highlight potential, strong CS fundamentals, academic achievements, internships, and passion for technology.
  - **Mid-Level (1-5y)**: Highlight execution ability, stack proficiency, engineering practices, and contributions to team goals.
  - **Senior Level (6+y)**: Focus on value creation, business problem decomposition, systemic trade-offs, stability/growth, and leadership.
- **Tone**: Natural, professional, authentic tone; avoid exaggeration; no bullet-list or laundry list.
- **Format**: Prefer one short paragraph, ≤ 120 words; optimize for recruiter readability and role fit.
- **Avoid**: Explicit numbers, percentages, counts, or quantified metrics in this summary section.

Output format:

- You MUST output valid YAML format.
- The structure should be a single string under a `summary` key.
- The string should be a multiline string using `|`.

Example format:

```yaml
summary: |
  Highly skilled software engineer with extensive experience in...
```

Return the polished content in professional language suitable for professional profiles.
