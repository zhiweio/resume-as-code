

# Currículum como Código

<p align="center">
  <img src="resume-builder-app/public/favicon.svg" width="72" height="72" alt="Logotipo del constructor de currículums" />
</p>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Node.js](https://img.shields.io/badge/Node.js-≥18-green.svg)](https://nodejs.org) [![pnpm](https://img.shields.io/badge/pnpm-≥9-orange.svg)](https://pnpm.io)

</div>

<div align="center">

**Deja de copiar y pegar currículums.** Mantén una única línea temporal en YAML de tu carrera y deja que los agentes de IA generen currículums perfectamente adaptados para cada solicitud de empleo, en minutos, no en horas.

</div>

![Captura de pantalla de la aplicación del constructor de currículums](assets/app-screenshot.png)

> [Ver currículum de ejemplo (EN · PDF)](assets/resume.pdf) · [查看中文简历 (PDF)](assets/resume_zh.pdf)

---

## Índice

- [Currículum como Código](#resume-as-code)
  - [Índice](#table-of-contents)
  - [Características destacadas](#highlights)
  - [Inicio rápido](#quick-start)
    - [Prerequisitos](#prerequisites)
    - [1. Instalar las habilidades para tu agente](#1-install-skills-for-your-agent)
    - [2. Construir tu línea temporal](#2-build-your-timeline)
    - [3. Configurar tu perfil](#3-configure-your-profile)
    - [4. Generar un currículum adaptado](#4-generate-a-tailored-resume)
    - [5. Vista previa y exportación a PDF](#5-preview-and-export-pdf)
  - [Aplicación del constructor de currículums](#resume-builder-app)
  - [Habilidades de agentes de IA](#ai-agent-skills)
    - [Compatibilidad con agentes](#agent-compatibility)
  - [Estructura del proyecto](#project-structure)
  - [Esquema de currículum en YAML](#yaml-resume-schema)
  - [Licencia](#license)
  - [Agradecimientos](#acknowledgments)

---

## Características destacadas

- **Única fuente de verdad** — todos los datos profesionales residen en archivos YAML modulares (perfiles, línea temporal, borradores)
- **3 habilidades para agentes de IA** — generación de currículums, pulido de línea temporal y preparación para entrevistas, impulsadas por LLMs
- **Pipeline de generación de 10 pasos** — investigación de la empresa → análisis de la oferta (JD) → generación de secciones → humanización (de-AI) → revisión de calidad → revisión final
- **Área de trabajo web local-first** — editor YAML Monaco + vista previa A4 pixel-perfect + exportación a PDF con un clic usando Puppeteer
- **Formato YAML dual** — detecta automáticamente tanto el nuevo esquema v1.0 como el formato legacy de [YAMLResume](https://yamlresume.dev/docs)
- **Multilenguaje** — inglés, chino simplificado/tradicional, español, francés, noruego, con conmutador de un clic
- **Soporte para 11+ agentes** — funciona con Claude Code, Codex, GitHub Copilot, Cursor, Windsurf, Cline, Trae, y más

---

## Inicio rápido

### Prerequisitos

- [Node.js](https://nodejs.org) ≥ 18 y [pnpm](https://pnpm.io) ≥ 9
- Un agente de código con IA (por ejemplo, [Claude Code](https://claude.ai/claude-code), GitHub Copilot, Cursor, etc.)

### 1. Instalar las habilidades para tu agente

```bash
git clone https://github.com/zhiweio/resume-as-code.git
cd resume-as-code
pnpm install
pnpm skills:install <agent>   # e.g. claude, copilot, cursor, windsurf, cline
```

Consulta la [tabla de compatibilidad de agentes](#agent-compatibility) completa a continuación.

### 2. Construir tu línea temporal

Abre tu agente de IA y pega descripciones sin procesar de tus empleos o proyectos pasados. El **Agente de Pulido de Línea Temporal** las estructurará utilizando la metodología STAR (trabajo) o 3W (proyecto) y las guardará en `data/timeline/`.

### 3. Configurar tu perfil

Rellena tus datos estáticos en `data/profiles/`:

| Archivo              | Contenido                                         |
| -------------------- | ------------------------------------------------- |
| `basics.yml`         | Nombre, teléfono, correo electrónico, URL, resumen, perfiles sociales |
| `education.yml`      | Instituciones, títulos, fechas                    |
| `certificates.yml`   | Certificaciones                                   |

Se proporcionan plantillas de ejemplo: copia `basics.example.yml` a `basics.yml` y edítalo.

### 4. Generar un currículum adaptado

Pega una Descripción de Puesto de Trabajo (JD) en tu agente. El **Agente de Generación de Currículum** hará lo siguiente:

1. Investigará el contexto empresarial de la empresa
2. Analizará a fondo la JD para inferir los requisitos reales del puesto
3. Emparejará experiencias relevantes de tu línea temporal
4. Generará secciones adaptadas (proyectos → trabajo → habilidades → resumen)
5. Ensamblará, aplicará humanización (de-AI), revisará y, opcionalmente, revisará

Resultado: `data/resumes/{Name}_{JobTitle}_{Company}.yml`

### 5. Vista previa y exportación a PDF

```bash
cd resume-builder-app
pnpm install    # también instala Chrome para Puppeteer
pnpm dev
```

Abre [localhost:5173](http://localhost:5173), carga tu YAML, realiza la vista previa, optimiza el diseño y exporta a PDF.

---

## Aplicación del constructor de currículums

Un área de trabajo de currículums local-first con una disposición de editor/vista previa en paneles divididos, construida con React, Vite, Monaco Editor, Tailwind CSS y Puppeteer.

**Características principales:**

| Característica                 | Descripción                                                        |
| ------------------------------ | ------------------------------------------------------------------ |
| Editor + Vista previa divididos| Editor YAML Monaco a la izquierda, vista previa A4 pixel-perfect a la derecha |
| Validación en vivo             | Validación de sintaxis y esquema YAML en tiempo real con diagnósticos en línea |
| Paginación determinista        | Paginación a nivel de bloque con lógica de mantener juntos         |
| Optimizar diseño               | Optimización de espacios con un clic (escala 0.7×–1.3×)            |
| Exportación a PDF              | Puppeteer local + Chromium headless para PDF de alta fidelidad     |
| Conmutador de idioma           | Cambiar renderizado 中文 / English con un clic                     |
| Formato dual                   | Detecta automáticamente yamlresume legacy o nuevo esquema v1.0 YAML|

**Inicio rápido:**

```bash
cd resume-builder-app
pnpm install
pnpm dev        # Web: :5173, Exportación a PDF: :3001
pnpm build      # Compilación para producción
```

La aplicación también admite la [YAMLResume CLI](https://yamlresume.dev/docs) para la generación de PDF basada en LaTeX:

```bash
pnpm yamlresume build "data/resumes/Your_Resume.yml"
```

Consulta [`resume-builder-app/README.md`](resume-builder-app/README.md) para detalles completos de arquitectura y desarrollo.

---

## Habilidades de agentes de IA

Tres [Habilidades de Agente](https://agentskills.io) portables bajo [`skills/`](skills/), cada una autocontenida como `SKILL.md` + `references/` + `assets/`:

| Habilidad                                                          | Activador                                   | Resultado                                     |
| ------------------------------------------------------------------ | ------------------------------------------- | --------------------------------------------- |
| [`resume-generation`](skills/resume-generation/SKILL.md)           | El usuario proporciona una Descripción de Puesto (JD) | Currículum YAML adaptado en `data/resumes/`   |
| [`timeline-polishing`](skills/timeline-polishing/SKILL.md)         | El usuario proporciona notas de trabajo o proyecto en bruto | YAML estructurado en `data/timeline/`       |
| [`interview-preparation`](skills/interview-preparation/SKILL.md)   | Currículum + Análisis de JD + Análisis de Empresa | Guía de entrevista en Markdown en `data/interviews/` |

### Compatibilidad con agentes

```bash
pnpm skills:install <agent>          # un agente
pnpm skills:install all              # todos los compatibles
pnpm skills:uninstall <agent>|all    # eliminación limpia
```

| Agente                                                                       | Cómo                                                                              |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| **Claude Code**                                                                | `pnpm skills:install claude` o `/plugin marketplace add zhiweio/resume-as-code`   |
| **GitHub Copilot**                                                             | Sin configuración (se incluye `.github/copilot-instructions.md`)                  |
| **Codex** / **OpenCode** / **Aider** / **Qoder** / **Continue** / **RooCode** | Sin configuración (lee `AGENTS.md`)                                               |
| **Cursor**                                                                     | Sin configuración (vía `AGENTS.md`) o `pnpm skills:install cursor`                |
| **Trae**                                                                       | Sin configuración (se incluye `.trae/rules/project_rules.md`)                     |
| **Windsurf**                                                                   | `pnpm skills:install windsurf`                                                    |
| **Cline** / **RooCode**                                                        | `pnpm skills:install cline`                                                       |

Consulta [`skills/README.md`](skills/README.md) para instrucciones detalladas de los agentes y cómo agregar nuevos agentes.

---

## Estructura del proyecto

```text
.
├── AGENTS.md                 # Punto de entrada universal para todos los agentes de código
├── skills/                   # Tres habilidadesidades de Agente portables
│   ├── resume-generation/    #   JD → currículum YAML adaptado (pipeline de 10 pasos)
│   ├── timeline-polishing/   #   Notas en bruto → línea temporal YAML STAR/3W
│   └── interview-preparation/#   Currículum + JD → guía de entrevista
├── scripts/
│   └── install-skills.mjs    # Instalador multi-agente en un solo comando
├── resume-builder-app/       # Área de trabajo web local-first (React + Vite + Puppeteer)
├── data/                     # Todo el contenido propietariopropiedad del usuario
│   ├── profiles/             #   Datos estáticos del candidato (basicos, educación, certificados)
│   ├── timeline/             #   Biblioteca maestra de línea temporal (YAML pulido)
│   ├── drafts/               #   Notas en bruto para el pulido
│   ├── resumes/              #   Currículums adaptados generados
│   ├── interviews/           #   Guías de entrevista generadas
│   └── .cache/               #   Artefactos intermedios por ejecución (ignorgitignored)
└── docs/
    └── yaml-schema.md        # Referencia de formato YAML (nuevo esquema v1.0 + legacy)
```

---

## Esquema de currículum en YAML

El constructor admite dos formatos de YAML, detectados automáticamente al cargar:

- **Nuevo Esquema v1.0** — tipos de sección discriminados, IDs estables, indicadores de visibilidad, sugerencias de diseño, anulaciones de tema
- **Legacy (YAMLResume)** — compatible con el ecosistema [YAMLResume](https://yamlresume.dev/docs) y su compilador LaTeX

Para la documentación completa del esquema con ejemplos y una tabla comparativa, consulta **[docs/yaml-schema.md](docs/yaml-schema.md)**.

---

## Licencia

[MIT](LICENSE)

---

## Agradecimientos

- [blader/humanizer](https://github.com/blader/humanizer) — Detección y eliminación de patrones de escritura con IA en inglés
- [op7418/humanizer-zh](https://github.com/op7418/humanizer-zh) — Detección y eliminación de patrones de escritura con IA en chino
- [itMrBoy/resumePolice](https://github.com/itMrBoy/resumePolice) — Marco integral de revisión de currículums
