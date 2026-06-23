# YAML Resume Schema Reference

The Resume Builder supports two YAML formats. Files are auto-detected at load time.

- **[New Schema (v1.0)](#new-schema-v10--recommended)** — Recommended. Richer, versioned schema with discriminated section types, stable IDs, visibility flags, and layout hints.
- **[Legacy Format (YAMLResume)](#legacy-format-yamlresume)** — Compatible with the [YAMLResume](https://yamlresume.dev/docs) ecosystem and its LaTeX compiler.

---

## New Schema (v1.0) — Recommended

The new format is a richer, versioned schema owned by the builder app. It supports discriminated section types, stable IDs, visibility flags, layout hints, and flexible content structures.

```yaml
schema:
  version: '1.0'
  generator: resume-builder-app

document:
  title: 'My Resume'
  language: en # en | zh-hans | zh-hant-hk | zh-hant-tw | es | fr | no

basics:
  name: Zhang Wei
  headline: 'Senior Data Engineer · 7 YOE'
  phone: '+86 138 8888 8888'
  email: zhangwei@outlook.com
  url: zhangwei.dev
  summary:
    - 'Bullet point one describing core competency.'
    - 'Bullet point two with specific achievements.'
  profiles:
    - network: GitHub
      url: https://github.com/zhangwei
      username: github.com/zhangwei

# profiles can also be placed here (sibling of basics) for yamlresume compatibility
# profiles:
#   - network: GitHub
#     url: https://github.com/zhangwei
#     username: github.com/zhangwei

sections:
  - id: work
    type: work
    title: 'Work Experience'
    items:
      - id: job-1
        name: Acme Corp
        position: Senior Engineer
        startDate: '2022-01'
        endDate: '2024-06'
        summary:
          - 'Led migration of data platform to lakehouse architecture.'
          - 'Reduced pipeline latency by 60% through stream processing.'
        keywords: [Spark, Kafka, AWS, Terraform]

  - id: education
    type: education
    title: 'Education'
    items:
      - institution: MIT
        degree: Master
        area: Computer Science
        startDate: '2018-09'
        endDate: '2020-06'

  - id: projects
    type: projects
    title: 'Projects'
    items:
      - id: proj-1
        name: Data Platform v2
        description: 'Enterprise-scale lakehouse platform'
        startDate: '2023-03'
        endDate: '2024-01'
        summary:
          - 'Designed and implemented end-to-end lakehouse on AWS.'
        keywords: [Databricks, Delta Lake, Airflow]

  - id: skills
    type: skills
    title: 'Skills'
    items:
      - name: Languages
        keywords: [Python, SQL, TypeScript, Go]
      - name: Data
        keywords: [Spark, Kafka, Airflow, dbt]

  - id: certificates
    type: certificates
    title: 'Certificates'
    items:
      - name: AWS Certified Data Analytics
        issuer: Amazon Web Services
        date: '2023-05'

  - id: langAndInterests
    type: langAndInterests
    title: 'Languages & Interests'
    languages:
      - language: English
        fluency: Professional Working
      - language: Mandarin Chinese
        fluency: Native
    interests:
      - name: Open Source
        keywords: [data tooling, contributor]

# Optional: explicit section display order
order:
  - work
  - education
  - projects
  - skills
  - certificates
  - langAndInterests

layout:
  template: jake
  page:
    margins: { top: 1.5cm, left: 1.5cm, right: 1.5cm, bottom: 1.5cm }
    showPageNumbers: true
  typography:
    fontSize: 11pt

themeOverrides:
  spacing:
    sectionGap: 12
    entryGap: 8
```

---

## Legacy Format (YAMLResume)

The [YAMLResume](https://yamlresume.dev/docs) format uses a flat `content` object with fixed section keys. The builder auto-detects this format by the presence of `content` at the root.

```yaml
locale:
  language: zh-hans

layouts:
  - engine: latex
    sections:
      aliases:
        basics: 基本信息
        work: 工作经历
        education: 教育经历
        projects: 项目经历
        skills: 专业技能
        certificates: 证书
      order:
        - basics
        - education
        - work
        - projects
        - skills
        - certificates
    page:
      margins: { top: 1.5cm, left: 1.5cm, right: 1.5cm, bottom: 1.5cm }
      showPageNumbers: true
    template: jake
    typography:
      fontSize: 11pt

content:
  basics:
    name: John Doe
    phone: '+1 555-123-4567'
    email: john.doe@example.com
    url: https://johndoe.dev
    summary: |
      - 7 years of data engineering experience with Python and SQL.
      - Experienced in ETL automation, data quality, and monitoring.
  profiles:
    - network: GitHub
      url: https://github.com/johndoe
      username: johndoe
  education:
    - institution: Example University
      degree: Bachelor
      area: Computer Science
      startDate: Sep 1, 2015
      endDate: Jul 1, 2019
  work:
    - name: Acme Inc
      position: Senior Engineer
      startDate: Nov 14, 2022
      endDate: Now
      summary: |
        - Built enterprise data platform from scratch.
      keywords: [Python, React, AWS]
  projects:
    - name: Data Platform
      description: Enterprise lakehouse
      startDate: Mar 1, 2023
      endDate: Jan 1, 2024
      summary: |
        - End-to-end lakehouse on AWS.
      keywords: [Databricks, Airflow]
  skills:
    - name: Languages
      keywords: [Python, SQL, TypeScript]
  certificates:
    - name: AWS Certified
      issuer: AWS
      date: May 2023
```

---

## Format Differences

| Feature            | Legacy (YAMLResume)                    | New Schema (v1.0)                     |
| ------------------ | -------------------------------------- | ------------------------------------- |
| Root structure     | `content` object with fixed keys       | `basics` + `sections` array           |
| Section definition | Fixed keys (`work`, `education`, etc.) | Discriminated union with `type` field |
| Section ordering   | `layouts[].sections.order`             | Top-level `order` array               |
| Section titles     | `layouts[].sections.aliases`           | Per-section `title` field             |
| Item IDs           | Not supported                          | Optional `id` on each item            |
| Visibility control | Not supported                          | `visible` flag per section/item       |
| Summary format     | Multiline pipe-string (`\|`)           | Array of strings or pipe-string       |
| Profiles location  | `content.profiles` (sibling of basics) | `basics.profiles` or root `profiles`  |
| Language setting   | `locale.language`                      | `document.language`                   |
| Layout config      | `layouts[]` array (multi-engine)       | Single `layout` object                |
| Theme overrides    | Not supported                          | `themeOverrides` (colors, spacing)    |
| Schema versioning  | Not supported                          | `schema.version` field                |
