Using session context (personal info, projects, work experience, skills, certifications, open-source) and the Job Description analysis, write a targeted professional summary.

Important requirements:

- **Format**: Use 3-4 concise bullet points.
- **Content Strategy**:
  - **Point 1 (Identity & Match)**: Current role/level + key years of experience + primary match to JD (e.g., "Senior Data Engineer with 6+ years of experience specializing in...").
    - **Experience Rounding**: Round up experience years slightly for better presentation (e.g., 3.5 years -> "4 years", 3.2 years -> "3+ years").
  - **Point 2 (Technical Core)**: Highlight specific tech stack mastery and engineering capabilities relevant to the role.
  - **Point 3 (Impact/Soft Skills)**: Focus on problem-solving, leadership, business value, or collaboration.
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

Return the polished content in professional language suitable for professional profiles.
