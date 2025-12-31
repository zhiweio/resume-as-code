Generate the skills section (descriptive, highlight-oriented) using session context (projects, work experience, certifications, OSS participation, role analysis).

Important requirements:

- **Adapt to Experience Level**:
  - **Entry Level (0-1y)**: Can list specific languages/tools learned in university/internships. Focus on foundational knowledge (Data Structures, Algorithms).
  - **Mid-Level (1-5y)**: Focus on proficiency, application in real projects, and best practices (CI/CD, Testing).
  - **Senior Level (6+y)**: Focus on underlying principles, system design, architectural trade-offs, and engineering strategy.
- **Format**: Each item is a complete sentence highlighting professional skills, tech stack, engineering practice, experience accumulation, industry background, and OSS involvement.
- **Tone**: Tech stack names may appear (e.g., React/TypeScript/Vite) but avoid tag lists; keep a natural, professional tone.
- **Avoid**: Quantified wording (numbers, percentages, counts); no KPI-style phrasing.
- **Structure**: Order by role relevance, most relevant first; suggest 4–6 items, each ≤ 50 words.

Output format:

- You MUST output valid YAML format.
- The structure should be a list of skill items under a `skills` key.
- Each item should have `name` (category or skill name), `level` (optional), `keywords` (list of strings).
- **IMPORTANT**: You MUST wrap each keyword string in double quotes (`"`) to avoid YAML parsing issues with special characters like colons (`:`).

Example format:

```yaml
skills:
  - name: Programming Languages
    level: Expert
    keywords:
      - 'Proficient in Java, Python, and C++.'
      - 'Experience with JavaScript and TypeScript.'
```

Return the polished content in professional language suitable for professional profiles.
