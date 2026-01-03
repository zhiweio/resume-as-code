# Trae Project Rules & Resume Generation Workflow

This document defines the workflows for generating tailored resumes and polishing timeline events.

## Agent Selection

Based on the user's input, determine which agent to activate:

1.  **Resume Generation Agent**: Triggered when the user provides a **Job Description (JD)**.
2.  **Timeline Polishing Agent**: Triggered when the user provides raw **Work Experience** or **Project** descriptions for polishing.
3.  **Interview Preparation Agent**: Triggered when the user provides a **Resume**, **JD Analysis**, and **Company Business Analysis** to generate an interview guide.

---

## Agent 1: Resume Generation Agent

**Goal**: Create a highly targeted, professional resume in YAML format that matches a specific Job Description.

### Workflow Steps

#### 1. Initialization

- **Action**: Create a temporary directory to store intermediate generation artifacts.
- **Path**: `resumes/temp/{Timestamp}/` (e.g., `resumes/temp/1704067200/`).

### 2. Job Analysis

- **Action**: Analyze the provided JD to extract key requirements, skills, and role details.
- **Tool**: Use the prompt defined in `resumes/job-analysis-prompt.md`.
- **Input**: The user-provided JD.
- **Output**: Save the analysis result to `resumes/temp/{Timestamp}/job-analysis.yml`.

### 3. Company & Business Analysis

- **Action**: Analyze the JD to identify the company, search for business context, and infer product/business unit details.
- **Tool**: Use the prompt defined in `resumes/company-business-analysis-prompt.md`.
- **Input**: The user-provided JD.
- **Output**: Save the analysis result to `resumes/temp/{Timestamp}/company-business-analysis.yml`.

### 4. Context Gathering & Timeline Matching

- **Action**: Gather candidate information and select relevant experience.
- **Sources**:
  - **Basics**: Read `profiles/basics.yml`.
  - **Education**: Read `profiles/education.yml`.
  - **Certificates**: Read `profiles/certificates.yml`.
  - **Timelines**: Read all files in `timelines/gem/`.
- **Matching**: Based on the **Job Analysis** and **Company Business Analysis** results, select the most relevant Work Experience and Project files from `timelines/gem/`. Filter out irrelevant experiences if necessary, or prioritize relevant ones.

### 5. Section Generation

Generate each section of the resume using the specific prompt files. Pass the **Job Analysis**, **Company Business Analysis**, and **Matched Context** (Profile, Education, Selected Timelines) to each prompt. Save the output of each section to the temporary directory.

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

### 6. Resume Assembly

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
          basics: 'Basics'
          education: 'Education'
          work: 'Work Experience'
          projects: 'Projects'
          certificates: 'Certificates'
          skills: 'Skills'
          languages: 'Languages'
          interests: 'Interests'
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
          top: 1.5cm
          left: 1.5cm
          right: 1.5cm
          bottom: 1.5cm
        showPageNumbers: true
      # Use `yamlresume templates list` to get the list of available templates
      template: moderncv-classic
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
    profiles: ... # From profiles/basics.yml
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

---

## Agent 2: Timeline Polishing Agent

**Goal**: Polish raw work experience or project descriptions into professional, structured YAML formats using STAR or 3W methodologies.

### Workflow Steps

#### 1. Input Analysis

- **Action**: Analyze the user's input to determine the type of timeline event.
- **Types**:
  - **Work Experience**: Professional roles, internships, or employment history.
  - **Project**: Academic projects, personal projects, or specific deliverables within a job.

#### 2. Polishing

Select the appropriate prompt based on the identified type:

- **Work Experience**:
  - **Prompt**: `timelines/timeline-work-experience-prompt.md`
  - **Methodology**: STAR (Situation, Task, Action, Result).
  - **Goal**: Expand and enrich the description with industry context, specific metrics, and leadership details.
- **Project**:
  - **Prompt**: `timelines/timeline-project-prompt.md`
  - **Methodology**: 3W (What, Why, How).
  - **Goal**: Expand and enrich the description with technical details, architectural decisions, and problem-solving nuances.

#### 3. Output

- **Format**: Return the polished content in valid YAML format as defined in the respective prompts.
- **Naming Convention**: `timelines/gem/{Type}_{TimeRange}_{Title}.yml`
  - `Type`: `Work` or `Project`.
  - `TimeRange`: `YYYYMMDD-YYYYMMDD` or `YYYYMMDD-Now` (e.g., `20221114-20220531` or `20221114-Now`).
  - `Title`: The job title or project name.
- **Action**: Save the polished YAML content to the new file.

---

## Agent 3: Interview Preparation Agent

**Goal**: Generate a comprehensive interview preparation guide tailored to the candidate's profile and the target role.

### Workflow Steps

#### 1. Input Verification

- **Action**: Ensure the user has provided the three necessary YAML contents or files:
  1.  **Resume** (e.g., `resumes/gem/...` or `profiles/...`)
  2.  **JD Analysis** (e.g., `gallery/..._JD Analysis.yml`)
  3.  **Company Business Analysis** (e.g., `gallery/..._Company Business Analysis.yml`)

#### 2. Guide Generation

- **Action**: Generate the interview guide using the specific prompt.
- **Tool**: Use the prompt defined in `interviews/interview-prompt.md`.
- **Inputs**: Pass the content of the three provided files to the prompt.
- **Output**:
  - **Naming Convention**: `interviews/gem/{CandidateName}_{Company}_Interview_Guide.md`
    - `CandidateName`: From Resume (`basics.name`).
    - `Company`: From JD Analysis (`company`).
    - Replace spaces with underscores `_`.
  - **Format**: Markdown.

---

## General Rules

- **Language**: Ensure all generated content is in **English** (unless the JD specifically requests otherwise, but prompts enforce English).
- **Format**: The final output must be valid YAML.
- **Rich Text**: Content fields (especially summaries) must strictly follow the supported Markdown syntax (Bold, Italic, Links, Lists only). Do NOT use unsupported syntax like headings or tables.
- **Consistency**: Ensure dates and formatting align with the `resume.example.yml` standard.
