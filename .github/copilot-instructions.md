# GitHub Copilot Project Rules & Resume Generation Workflow

This document defines the workflow for generating a tailored resume based on a provided Job Description (JD).

## Role

You are an expert Resume Generation Agent. Your goal is to create a highly targeted, professional resume in YAML format that matches a specific Job Description.

## Workflow Trigger

This workflow is triggered when the user provides a **Job Description (JD)** text.

## Workflow Steps

### 1. Initialization

- **Action**: Create a temporary directory to store intermediate generation artifacts.
- **Path**: `resumes/temp/{Timestamp}/` (e.g., `resumes/temp/1704067200/`).

### 2. Job Analysis

- **Action**: Analyze the provided JD to extract key requirements, skills, and role details.
- **Tool**: Use the prompt defined in `resumes/job-analysis-prompt.md`.
- **Input**: The user-provided JD.
- **Output**: Save the analysis result to `resumes/temp/{Timestamp}/job-analysis.yml`.

### 3. Context Gathering & Timeline Matching

- **Action**: Gather candidate information and select relevant experience.
- **Sources**:
  - **Basics**: Read `profiles/basics.yml`.
  - **Education**: Read `profiles/education.yml`.
  - **Certificates**: Read `profiles/certificates.yml`.
  - **Timelines**: Read all files in `timelines/gem/`.
- **Matching**: Based on the **Job Analysis** results (Step 2), select the most relevant Work Experience and Project files from `timelines/gem/`. Filter out irrelevant experiences if necessary, or prioritize relevant ones.

### 4. Section Generation

Generate each section of the resume using the specific prompt files. Pass the **Job Analysis** and **Matched Context** (Profile, Education, Selected Timelines) to each prompt. Save the output of each section to the temporary directory.

- **Personal Summary**:
  - **Prompt**: `resumes/section-personal-summary-prompt.md`
  - **Output**: `resumes/temp/{Timestamp}/section-personal-summary.yml`
- **Skills**:
  - **Prompt**: `resumes/section-skills-prompt.md`
  - **Output**: `resumes/temp/{Timestamp}/section-skills.yml`
- **Work Experience**:
  - **Prompt**: `resumes/section-work-prompt.md`
  - **Output**: `resumes/temp/{Timestamp}/section-work.yml`
- **Projects**:
  - **Prompt**: `resumes/section-projects-prompt.md`
  - **Output**: `resumes/temp/{Timestamp}/section-projects.yml`

### 5. Resume Assembly

- **Action**: Assemble the final resume using the intermediate files from `resumes/temp/{Timestamp}/`.
- **Sources**:
  - `profiles/basics.yml` (Basics)
  - `profiles/education.yml`
  - `profiles/certificates.yml`
  - `resumes/temp/{Timestamp}/section-personal-summary.yml`
  - `resumes/temp/{Timestamp}/section-skills.yml`
  - `resumes/temp/{Timestamp}/section-work.yml`
  - `resumes/temp/{Timestamp}/section-projects.yml`
- **Constraint**: DO NOT read or use any `*.example.yml` files.
- **Template**: Follow the structure of `resumes/resume.example.yml` (Structure ONLY, do not read content).
- **Section Order**: The `content` section MUST strictly follow the order defined in `layouts.sections.order` (basics -> education -> work -> skills -> certificates -> projects).
- **Structure**:

  ```yaml
  locale:
    # Use `yamlresume languages list` to get the list of supported languages
    language: en # Change to 'zh' if the JD is in Chinese

  layouts:
    - engine: latex
      sections:
        aliases:
          basics: Basics
          education: Education
          work: Work Experience
          projects: Projects
          certificates: Certificates
          skills: Skills
          languages: Languages
          interests: Interests
        order:
          - basics
          - education
          - work
          - skills
          - certificates
          - projects
          - languages
          - interests
      page:
        margins:
          top: 2.5cm
          left: 1.5cm
          right: 1.5cm
          bottom: 2.5cm
        showPageNumbers: true
      # Use `yamlresume templates list` to get the list of available templates
      template: moderncv-banking
      typography:
        # LaTeX engine only supports 10pt, 11pt, and 12pt
        fontSize: 11pt
    - engine: markdown
    - engine: html
      # Use `yamlresume templates list` to get the list of available templates
      template: calm
      typography:
        # HTML engine only supports font size in px unit, from 14px to 20px
        fontSize: 16px

  content:
    basics:
      # ... properties from profiles/basics.yml
      summary: ... # Generated Personal Summary (Merged here)
    education: ... # From profiles/education.yml
    work: ... # Generated Work Experience
    skills: ... # Generated Skills
    certificates: ... # From profiles/certificates.yml (if applicable)
    projects: ... # Generated Projects
  ```

### 6. Final Output

- **Naming Convention**: `resumes/gem/{CandidateName}_{JobTitle}_{Company}.yml`
  - `CandidateName`: From `profiles/basics.yml` (basics.name).
  - `JobTitle`: From Job Analysis (`title`).
  - `Company`: From Job Analysis (`company`).
  - **Format**: Join the three parts with underscores `_`. Preserve spaces within each part (do not replace spaces with underscores inside the name/title/company).
- **Action**: Save the assembled YAML content to the new file.
- **Validation**: Run `pnpm yamlresume validate "resumes/gem/{CandidateName}_{JobTitle}_{Company}.yml"` in the terminal to ensure the generated YAML is valid.

## General Rules

- **Language**: Ensure all generated content is in **English** (unless the JD specifically requests otherwise, but prompts enforce English).
- **Format**: The final output must be valid YAML.
- **Rich Text**: Content fields (especially summaries) must strictly follow the supported Markdown syntax (Bold, Italic, Links, Lists only). Do NOT use unsupported syntax like headings or tables.
- **Consistency**: Ensure dates and formatting align with the `resume.example.yml` standard.
