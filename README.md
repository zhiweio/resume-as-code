# Resume as Code

This project implements a "Resume as Code" philosophy, leveraging LLMs (Large Language Models) and structured data to automate the creation of highly tailored, professional resumes.

It solves the common pain points of resume maintenance:

- **Fragmentation**: Keeping multiple versions of Word/PDF files for different job applications.
- **Inconsistency**: Difficulty in maintaining consistent formatting and content across versions.
- **Time-Consuming**: Manually tailoring resumes for each Job Description (JD) is tedious.

By maintaining a single "Master Timeline" of your career and using AI agents to dynamically assemble resumes, you can generate a perfect match for any job opportunity in minutes.

## ✨ Core Features

- **Single Source of Truth**: All career data (work, projects, education, certificates) is stored in modular YAML files.
- **AI-Powered Agents**:
  - **Resume Generation Agent**: Analyzes JDs and assembles targeted resumes.
  - **Timeline Polishing Agent**: Polishes raw experience descriptions using STAR/3W methodologies.
- **Standardized Format**: Built on the [YAMLResume](https://yamlresume.dev/docs) standard, ensuring compatibility with a rich ecosystem of themes and export tools.
- **Automated Validation**: Integrated validation ensures generated resumes are syntactically correct and ready for compilation.
- **Multi-Format Export**: Supports exporting to PDF (LaTeX), HTML, and Markdown via the YAMLResume compiler.

## 🏗️ Architecture & Workflow

The system operates through two primary AI agents:

### 1. Timeline Polishing Agent

_Input: Raw text description of a job or project._
_Output: Structured, polished YAML file in `timelines/gem/`._

1.  **Input Analysis**: Identifies if the input is Work Experience or a Project.
2.  **Polishing**: Applies **STAR** (Situation, Task, Action, Result) for work or **3W** (What, Why, How) for projects.
3.  **Enrichment**: Infers relevant technical keywords and industry context.
4.  **Storage**: Saves the polished artifact to the timeline library.

### 2. Resume Generation Agent

_Input: Target Job Description (JD)._
_Output: A complete, tailored resume YAML file in `resumes/gem/`._

1.  **Job Analysis**: Extracts key skills, requirements, and role context from the JD.
2.  **Matching**: Selects the most relevant experiences from the Timeline library based on the analysis.
3.  **Section Generation**: Generates tailored Summary, Skills, Work, and Project sections.
4.  **Assembly**: Combines all sections with static profile data (Education, Certificates) into a final YAMLResume-compliant file.
5.  **Validation**: Validates the output against the schema.

## 📂 Directory Structure

```text
.
├── profiles/           # Personal basic information (static)
├── resumes/            # Resume generation artifacts
│   ├── gem/            # Final generated resume files
│   ├── temp/           # Intermediate generation artifacts
│   ├── job-analysis-prompt.md    # Prompt for analyzing JDs
│   ├── resume-prompt.md          # Prompt for resume assembly
│   └── section-*-prompt.md       # Prompts for specific sections
├── timelines/          # Master Timeline Library
│   ├── gem/            # Polished timeline event files (YAML)
│   ├── timeline-project-prompt.md # Prompt for polishing projects
│   └── timeline-work-experience-prompt.md # Prompt for polishing work exp
└── ...
```

## 🚀 Usage Guide

### Prerequisites

- **Node.js** & **pnpm** installed.
- **YAMLResume CLI** installed (`pnpm add -g @yamlresume/cli` or use via `pnpm exec`).
- An LLM interface (e.g., GitHub Copilot Chat in VS Code).

### Step 1: Build Your Timeline Library

Don't write a resume yet. First, build your database of experiences.

1.  Open Copilot Chat.
2.  Paste a raw description of a past job or project.
3.  The **Timeline Polishing Agent** will format it into a structured YAML file in `timelines/gem/`.
4.  Review and save the file.

### Step 2: Configure Static Data

Fill in your static information in the `profiles/` directory:

- `profiles/basics.yml`: Contact info, social links.
- `profiles/education.yml`: Academic history.
- `profiles/certificates.yml`: Certifications.

### Step 3: Generate a Resume

When you find a job you want to apply for:

1.  Copy the Job Description (JD).
2.  Paste it into Copilot Chat.
3.  The **Resume Generation Agent** will:
    - Analyze the JD.
    - Select relevant timeline events.
    - Generate tailored content.
    - Assemble a final YAML file in `resumes/gem/` (e.g., `Name_JobTitle_Company.yml`).

### Step 4: Compile & Export

Use the YAMLResume CLI to compile your resume into PDF or HTML.

```bash
# Validate the generated resume
pnpm yamlresume validate "resumes/gem/Your_Resume.yml"

# Build the resume to PDF, HTML, and Markdown
pnpm yamlresume build "resumes/gem/Your_Resume.yml"
```

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Format code
pnpm format

# Type check
pnpm check
```

## 📄 License

MIT
