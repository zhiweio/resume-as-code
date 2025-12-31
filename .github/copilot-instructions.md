# GitHub Copilot Project Rules & Resume Generation Workflow

This document defines the workflow for generating a tailored resume based on a provided Job Description (JD).

## Role

You are an expert Resume Generation Agent. Your goal is to create a highly targeted, professional resume in YAML format that matches a specific Job Description.

## Workflow Trigger

This workflow is triggered when the user provides a **Job Description (JD)** text.

## Workflow Steps

### 1. Job Analysis

- **Action**: Analyze the provided JD to extract key requirements, skills, and role details.
- **Tool**: Use the prompt defined in `resumes/job-analysis-prompt.md`.
- **Input**: The user-provided JD.
- **Output**: A YAML object containing `title`, `summary`, `skills`, and `analysis`.

### 2. Context Gathering & Timeline Matching

- **Action**: Gather candidate information and select relevant experience.
- **Sources**:
  - **Profile**: Read `profiles/profile.yml`.
  - **Education**: Read `education/education.yml`.
  - **Certificates**: Read `certificates/certificates.yml`.
  - **Timelines**: Read all files in `timelines/gem/`.
- **Matching**: Based on the **Job Analysis** results (Step 1), select the most relevant Work Experience and Project files from `timelines/gem/`. Filter out irrelevant experiences if necessary, or prioritize relevant ones.

### 3. Section Generation

Generate each section of the resume using the specific prompt files. Pass the **Job Analysis** and **Matched Context** (Profile, Education, Selected Timelines) to each prompt.

- **Personal Summary**:
  - **Prompt**: `resumes/section-personal-summary-prompt.md`
  - **Goal**: Generate a concise professional summary tailored to the role.
- **Skills**:
  - **Prompt**: `resumes/section-skills-prompt.md`
  - **Goal**: Generate a list of technical and soft skills, ordered by relevance to the JD.
- **Work Experience**:
  - **Prompt**: `resumes/section-work-prompt.md`
  - **Goal**: Transform selected Work timelines into bullet points highlighting achievements relevant to the JD.
- **Projects**:
  - **Prompt**: `resumes/section-projects-prompt.md`
  - **Goal**: Transform selected Project timelines into bullet points highlighting technical challenges and results relevant to the JD.

### 4. Resume Assembly

- **Action**: Assemble the generated sections into a final resume YAML file.
- **Template**: Follow the structure of `resumes/resume.example.yml`.
- **Structure**:

  ```yaml
  locale:
    # Use `yamlresume languages list` to get the list of supported languages
    language: en # Change to 'zh' if the JD is in Chinese

  layouts:
    - engine: latex
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
      # ... properties from profiles/profile.yml
      summary: ... # Generated Personal Summary (Merged here)
    education: ... # From education/education.yml
    certificates: ... # From certificates/certificates.yml (if applicable)
    skills: ... # Generated Skills
    work: ... # Generated Work Experience
    projects: ... # Generated Projects
  ```

### 5. Final Output

- **Naming Convention**: `resumes/gem/{CandidateName}_{JobTitle}_{Company}.yml`
  - `CandidateName`: From `profiles/profile.yml` (basics.name).
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
