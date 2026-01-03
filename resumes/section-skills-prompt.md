Generate the skills section (descriptive, highlight-oriented) using session context (projects, work experience, certifications, OSS participation, role analysis).

Important requirements:

- **Adapt to Experience Level**:
  - **Entry Level (0-1y)**: Can list specific languages/tools learned in university/internships. Focus on foundational knowledge (Data Structures, Algorithms).
  - **Mid-Level (1-5y)**: Focus on proficiency, application in real projects, and best practices (CI/CD, Testing).
  - **Senior Level (6+y)**: Focus on underlying principles, system design, architectural trade-offs, and engineering strategy.
- **Format**: Each item is a complete sentence highlighting professional skills, tech stack, engineering practice, experience accumulation, industry background, and OSS involvement.
- **Tone**: Tech stack names may appear (e.g., React/TypeScript/Vite) but avoid tag lists; keep a natural, professional tone.
- **Avoid**: Quantified wording (numbers, percentages, counts); no KPI-style phrasing.
- **Structure**: Order by role relevance, most relevant first; suggest 4–6 items.
- **Keywords**: Must be short tags (**≤ 32 characters**). Do NOT use long sentences as keywords.
- **Detailing**: When listing broad tech stacks (e.g., AWS, Azure, CI/CD), use parentheses to list specific relevant tools or services if applicable (e.g., "AWS (Redshift, Glue)", "CI/CD (GitLab, Jenkins)").
- **Authenticity & Inference**:
  - **Strictly Forbidden**: Do NOT invent skills or tech stacks that are completely absent from the candidate's timeline/profile, even if the JD requires them.
  - **Allowed Inference**: If the candidate has demonstrated experience with a broader platform or ecosystem (e.g., "AWS", "Azure", "Big Data processing") in their timeline, you MAY infer and include specific related services mentioned in the JD (e.g., inferring "Step Functions" or "Blob Storage" if general AWS/Azure usage is evident and relevant context exists).

Output format:

- You MUST output valid YAML format.
- The structure should be a list of skill items under a `skills` key.
- Each item should have `name` (category), `level` (optional), `keywords` (list of strings).
- **Level**: Must be one of `["Novice", "Beginner", "Intermediate", "Advanced", "Expert", "Master"]`.
- **IMPORTANT**: You MUST wrap each keyword string in double quotes (`"`) to avoid YAML parsing issues.

Example format:

```yaml
skills:
  - name: Cloud & Infrastructure
    level: Expert
    keywords:
      - 'AWS (Redshift, Glue, EMR)'
      - 'Azure (Synapse, Cosmos DB)'
      - 'Terraform (IaC)'
      - 'Docker & Kubernetes'
  - name: Big Data & Streaming
    level: Expert
    keywords:
      - 'Apache Spark'
      - 'Apache Flink'
      - 'Kafka'
```

Return the polished content in professional language suitable for professional profiles.
