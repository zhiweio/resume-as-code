# Resume as Code

This project aims to manage personal resumes through a "code-based" approach. The core concept is to maintain a comprehensive personal career timeline, and by analyzing the target Job Description (JD), automatically match the most relevant experiences to generate a highly customized resume.

## ✨ Core Features

- **Single Source of Truth**: All experiences (work, projects, education, certificates) are structured in YAML format, making them easy to maintain and version control.
- **Deep JD Analysis**: Utilizes LLMs to deeply parse job descriptions, extracting key skills, project experience, and soft skill requirements.
- **Intelligent Matching & Generation**: Based on JD analysis results, filters the most matching events from the Timeline to generate targeted resume content.
- **Multi-dimensional Management**: Supports management of personal profiles, education, certificates, and detailed project and work experiences.

## 📂 Directory Structure

```text
.
├── certificates/       # Certificate data
├── education/          # Education background data
├── profiles/           # Personal basic information
├── resumes/            # Prompts and examples for resume generation
│   ├── gem/            # Generated resume files
│   ├── job-analysis-prompt.md    # JD Analysis Prompt
│   ├── resume-prompt.md          # Resume Generation Prompt
│   └── ...
├── timelines/          # Core timeline data (work experience, project experience)
│   ├── gem/            # Specific timeline event files
│   └── ...
└── ...
```

## 🚀 Workflow

### 1. Maintain Personal Data

Maintain your personal data in the `timelines/`, `education/`, `certificates/`, and `profiles/` directories. It is recommended to refer to the `.example.yml` file formats.

- **Timelines**: Records detailed work and project experiences. This is the source material library for resume generation.
- **Profiles**: Personal contact information, social links, etc.

### 2. Analyze Target Job (JD Analysis)

Use the Prompt in `resumes/job-analysis-prompt.md`, combined with the target job's JD content, and send it to an LLM (such as ChatGPT, Claude, Gemini).

The LLM will return a structured job analysis report (in YAML format), containing skill keywords, core responsibilities, and experience requirements.

### 3. Generate Customized Resume

Provide the following content to the LLM (using `resumes/resume-prompt.md`):

1. **Job Analysis Report** (Output from the previous step)
2. **Relevant Timeline Events** (Select experiences relevant to the position from your `timelines/`)
3. **Personal Basic Information** (From `profiles/`, etc.)

The LLM will generate highly matched resume content for you based on the guiding principles of the Prompt (Relevance, Quantification, Professionalism).

## 🛠️ Development & Maintenance

This project uses pnpm for package management and includes basic formatting and code checking tools.

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
