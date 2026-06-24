import { useState, useCallback, useEffect, useRef } from 'react'
import { parse as parseYaml } from 'yaml'
import Editor from '@monaco-editor/react'
import { ResumeRenderer } from './renderer'
import { compileLegacy, compileNewSchema, isLegacyFormat } from '../compiler'
import type { RenderModel } from '../models'
import type { ResumeDocument } from '../schema'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './components/ui/resizable'

// ── Sample YAML (new schema format) ──────────────────────────────────────────
const SAMPLE_NEW_SCHEMA = `schema:
  version: "1.0"

document:
  title: "John Doe – Senior Data Engineer"
  language: en

basics:
  name: John Doe
  headline: "Senior Data Engineer · 7 YOE · AWS Certified Data Analytics Specialist"
  phone: "+1 (555) 000-0000"
  email: john.doe@example.com
  url: johndoe.dev
  summary:
    - "Data engineer with 7 years of experience delivering production-ready data platforms across life sciences, retail, SaaS, and enterprise intelligence domains. Specialized in end-to-end lakehouse architecture, real-time streaming pipelines, and agentic BI systems on AWS, with full CI/CD ownership from design through production."
  profiles:
    - network: GitHub
      url: https://github.com/johndoe
      username: github.com/johndoe
    - network: LinkedIn
      url: https://linkedin.com/in/johndoe
      username: linkedin.com/in/johndoe

sections:
  - id: work
    type: work
    items:
      - name: "Tech Solutions Inc."
        position: Senior Data Engineer
        startDate: Nov 2022
        summary:
          - "Delivered production-ready data platform programs for life sciences and retail clients, owning design, implementation, testing, CI/CD, and support across DEV, QA, and PROD environments."
          - "Architected an enterprise Customer Data Platform on AWS, unifying multiple data sources and legacy systems into a governed lakehouse and warehouse foundation serving 4 downstream applications."
          - "Designed an event-driven migration factory (Step Functions + Lambda + S3 events) that automated a 10 TB+ data warehouse migration, reducing end-to-end migration time by 70%."
          - "Led design and delivery of a two-plane NL2SQL data agent platform integrating LLM APIs with a governed semantic layer, vector search, and React / TypeScript front-end."
        keywords: [AWS, Python, Redshift, dbt, Databricks, Terraform, Step Functions, Lambda, FastAPI, CI/CD, Docker]
      - name: "SaaS Innovation Ltd."
        position: Data Engineer
        startDate: Jun 2021
        endDate: Nov 2022
        summary:
          - "Designed and operated real-time and batch data platforms for enterprise SaaS products, serving millions of enterprises and 180 million global records."
          - "Built streaming ETL pipelines with Kafka and Flink; managed lakehouse models across multiple systems and AWS S3."
          - "Drove Agile delivery as a core team member across bi-weekly sprints, consistently meeting velocity targets."
        keywords: [Python, Spark, Flink, Kafka, TiDB, AWS, Hive, CI/CD, Docker, Agile]
      - name: "Data Systems Corp."
        position: Data Engineer
        startDate: Jun 2019
        endDate: Jun 2021
        summary:
          - "Owned data engineering, building ETL pipelines and data models around 230 million+ enterprise entities."
          - "Improved data freshness from T+1 to near-real-time via optimized Python and Hive batch pipelines."
          - "Built and maintained search indexes supporting 100M+ document full-text search for enterprise risk signal detection."
        keywords: [Python, Hive, Airflow, MySQL, Elasticsearch, Hadoop, ETL]

  - id: education
    type: education
    items:
      - institution: "State University of Technology"
        degree: "Bachelor of Engineering"
        area: "Computer Science and Technology"
        startDate: Sep 2015
        endDate: Jul 2019
        summary:
          - "Third Prize — National University Cloud Computing Application Innovation Competition."
          - "GPA 3.6 / 4.0, ranked top 15% of cohort."

  - id: projects
    type: projects
    items:
      - name: "Enterprise Customer Data Platform"
        description: "End-to-end AWS customer data platform with governed ingestion, warehouse foundations, and secure data APIs."
        startDate: Dec 2022
        summary:
          - "Built from 0 to 1 on AWS, unifying multiple data sources into a governed lakehouse; delivered column-level masking, row-level security, and automated quality gates via Great Expectations + dbt tests."
          - "Exposed governed data via FastAPI + API Gateway REST APIs consumed by 4 downstream client applications in production."
        keywords: [AWS, Redshift, dbt, Glue, S3, FastAPI, Terraform, Great Expectations, Python]
      - name: "Enterprise Data Warehouse Migration"
        description: "Automated migration of 10 TB+ data warehouse to cloud-native architecture."
        startDate: Nov 2022
        endDate: May 2023
        summary:
          - "Designed an event-driven migration factory with Step Functions, Lambda, S3 events, and staging databases — turning a fully manual process into a one-click repeatable pipeline with 70% time reduction and zero data loss."
        keywords: [AWS, Step Functions, Lambda, RDS, Redshift, Python, Event-Driven]
      - name: "Real-time Analytics Platform"
        description: "High-throughput streaming data pipeline processing 500M+ events daily with sub-second latency."
        startDate: Aug 2023
        endDate: Feb 2024
        summary:
          - "Built end-to-end streaming architecture using Kafka, Flink, and Databricks Delta Lake, achieving 99.99% uptime and sub-100ms p99 latency for real-time dashboards."
          - "Implemented auto-scaling policies reducing infrastructure costs by 35% while maintaining performance SLAs."
        keywords: [Kafka, Apache Flink, Databricks, Delta Lake, Python, AWS, Prometheus, Grafana]
      - name: "Enterprise Data Agent Platform"
        description: "Full-stack agentic BI platform with governed semantics, NL2SQL, and interactive analytics."
        startDate: Feb 2026
        summary:
          - "Led end-to-end architecture of a two-plane system decoupling semantic governance from runtime execution, enabling business users to query data via natural language with automatic validation and explainability."
        keywords: [Python, LLM APIs, FastAPI, TypeScript, React, PostgreSQL, Vector Search, AWS, NL2SQL]
      - name: "Data Governance & Compliance Framework"
        description: "Centralized metadata and governance system for enterprise data estate."
        startDate: Mar 2024
        endDate: Sep 2024
        summary:
          - "Designed and implemented data contracts, automated PII detection, and audit logging serving 50+ data producers and 200+ consumers."
          - "Reduced compliance violations by 92% and data incident response time from 4 hours to 15 minutes through real-time monitoring."
        keywords: [Python, Apache Atlas, Data Contracts, dbt, PostgreSQL, Kubernetes, CI/CD]

  - id: awards
    type: awards
    items:
      - name: "Technical Leadership Award"
        awarder: "Tech Solutions Inc."
        date: 2024
        summary:
          - "Recognized for architecting and leading the enterprise data platform transformation, mentoring 8 junior engineers, and delivering 3 major platform initiatives on schedule."
      - name: "Open Source Contributor"
        awarder: "Apache Flink Community"
        date: 2023
        summary:
          - "Contributed 5 production-grade features and performance improvements to Apache Flink, adopted by major enterprises."
      - name: "Innovation Hackathon Winner"
        awarder: "SaaS Innovation Ltd."
        date: 2022
        summary:
          - "Led cross-functional team winning innovation competition with real-time data fabric prototype, later productized as core platform feature."

  - id: skills
    type: skills
    items:
      - name: Data Platform Engineering
        level: Expert
        keywords: [Python, SQL, dbt, Redshift, Snowflake, Databricks, Hive, Delta Lake, Apache Iceberg]
      - name: "Orchestration, Streaming & Compute"
        level: Advanced
        keywords: [Apache Airflow, Apache Spark, Apache Flink, Kafka, AWS Step Functions, AWS Glue, EMR]
      - name: "Cloud & Infrastructure"
        level: Advanced
        keywords: ["AWS (S3, EC2, Lambda, ECS, RDS, Glue, Redshift)", Terraform, Docker, CI/CD, GitHub Actions, Kubernetes]
      - name: "Quality, Security & Reliability"
        level: Advanced
        keywords: [Great Expectations, dbt tests, Column-level Masking, Row-level Security, Data Contracts, Compliance]
      - name: "APIs & Application Layer"
        level: Advanced
        keywords: [FastAPI, REST / OpenAPI, TypeScript, React, LLM APIs, gRPC]
      - name: "Delivery & Collaboration"
        level: Advanced
        keywords: [Agile / Scrum, Technical Design, Stakeholder Management, Cross-functional Leadership, Mentoring]

  - id: certificates
    type: certificates
    items:
      - name: "AWS Certified Data Analytics – Specialty"
        issuer: Amazon Web Services
        date: Jan 2024
      - name: "AWS Certified Solutions Architect – Associate"
        issuer: Amazon Web Services
        date: Mar 2023
      - name: "Apache Spark Certified Developer"
        issuer: Databricks
        date: Nov 2022
      - name: "Kubernetes Application Developer"
        issuer: Cloud Native Computing Foundation
        date: Jun 2023

  - id: langAndInterests
    type: langAndInterests
    languages:
      - language: English
        fluency: Native
      - language: Mandarin Chinese
        fluency: Professional Working
      - language: Japanese
        fluency: Elementary
    interests:
      - name: Open Source
        keywords: [data tooling, Apache community, contributor]
      - name: Technical Writing
        keywords: [architecture blogs, Medium publications, conference talks]
      - name: Community
        keywords: [mentoring junior engineers, conference speaking, knowledge sharing]
`

// ── Validation types ─────────────────────────────────────────────────────────
interface DiagnosticItem {
  severity: 'error' | 'warning' | 'info'
  message: string
  line?: number
}

type SourceStatus = 'new-schema' | 'legacy-adapted' | 'invalid'

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [yamlSource, setYamlSource] = useState(SAMPLE_NEW_SCHEMA)
  const [renderModel, setRenderModel] = useState<RenderModel | null>(null)
  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>([])
  const [sourceStatus, setSourceStatus] = useState<SourceStatus>('new-schema')
  const [isExporting, setIsExporting] = useState(false)
  const [optimized, setOptimized] = useState(false)
  const [spacingScale, setSpacingScale] = useState(1.0)
  const [langOverride, setLangOverride] = useState<'zh' | 'en' | null>(null)
  const [previewZoom, setPreviewZoom] = useState(1.0)
  const [showSocialIcons, setShowSocialIcons] = useState(true)
  const lastValidModel = useRef<RenderModel | null>(null)
  // Keep last parsed doc so language toggle can re-compile without re-parsing
  const lastParsedDoc = useRef<unknown>(null)

  // Compile YAML → RenderModel
  const compile = useCallback(
    (source: string, forceLang?: 'zh' | 'en' | null) => {
      const newDiagnostics: DiagnosticItem[] = []

      try {
        const parsed = parseYaml(source)
        if (!parsed || typeof parsed !== 'object') {
          newDiagnostics.push({
            severity: 'error',
            message: 'YAML parsed to empty or non-object value',
          })
          setDiagnostics(newDiagnostics)
          setSourceStatus('invalid')
          return
        }

        lastParsedDoc.current = parsed
        const effectiveLang = forceLang !== undefined ? forceLang : langOverride

        // Detect format and compile
        if (isLegacyFormat(parsed)) {
          const model = compileLegacy(parsed, effectiveLang ?? undefined)
          setRenderModel(model)
          lastValidModel.current = model
          setSourceStatus('legacy-adapted')
          newDiagnostics.push({
            severity: 'info',
            message: 'Legacy yamlresume format detected and adapted',
          })
        } else if (
          parsed.schema &&
          parsed.document &&
          parsed.basics &&
          parsed.sections
        ) {
          const model = compileNewSchema(
            parsed as ResumeDocument,
            effectiveLang ?? undefined,
          )
          setRenderModel(model)
          lastValidModel.current = model
          setSourceStatus('new-schema')
        } else {
          newDiagnostics.push({
            severity: 'error',
            message:
              'Unknown YAML structure — expected new schema (schema + document + basics + sections) or legacy format (content.basics)',
          })
          setSourceStatus('invalid')
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Unknown parse error'
        newDiagnostics.push({
          severity: 'error',
          message: `YAML syntax error: ${message}`,
        })
        setSourceStatus('invalid')
      }

      setDiagnostics(newDiagnostics)
    },
    [langOverride],
  )

  // Initial compile
  useEffect(() => {
    compile(yamlSource)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-compile when language override changes (without re-parsing)
  const handleLangToggle = useCallback(
    (lang: 'zh' | 'en') => {
      const next = langOverride === lang ? null : lang
      setLangOverride(next)
      compile(yamlSource, next)
    },
    [langOverride, yamlSource, compile],
  )

  // Export to PDF via local service
  const handleExport = useCallback(async () => {
    if (!renderModel || sourceStatus === 'invalid') return
    if (isExporting) {
      alert('An export task is already in progress. Please wait and try again.')
      return
    }
    setIsExporting(true)
    try {
      const resp = await fetch('http://localhost:3001/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: renderModel, filename: 'resume.pdf' }),
      })
      if (resp.ok) {
        const blob = await resp.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'resume.pdf'
        a.click()
        URL.revokeObjectURL(url)
      } else if (resp.status === 429) {
        alert(
          'An export task is already running on the server. Please wait and try again.',
        )
      } else {
        const errText = await resp.text()
        console.error('Export failed:', errText)
        alert(`Export failed: ${errText}`)
      }
    } catch (err) {
      console.error('Export service unavailable:', err)
      alert(
        'Export service unavailable. Please ensure the export service is running (pnpm dev).',
      )
    } finally {
      setIsExporting(false)
    }
  }, [renderModel, sourceStatus, isExporting])

  // The model to render: current valid or last valid (graceful degradation)
  const displayModel = renderModel ?? lastValidModel.current

  return (
    <div
      className="h-screen flex flex-col"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Toolbar ── */}
      <div className="no-print h-10 flex items-center gap-3 px-4 border-b border-stone-200 bg-white shrink-0">
        <span className="text-sm font-semibold text-stone-800">
          Resume Builder
        </span>
        <div className="h-4 w-px bg-stone-200" />

        {/* Status badge */}
        <span
          className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
            sourceStatus === 'new-schema'
              ? 'bg-emerald-100 text-emerald-700'
              : sourceStatus === 'legacy-adapted'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
          }`}
        >
          {sourceStatus === 'new-schema'
            ? '✓ Valid'
            : sourceStatus === 'legacy-adapted'
              ? '⚠ Legacy Adapted'
              : '✗ Invalid'}
        </span>

        {/* Diagnostics count */}
        {diagnostics.length > 0 && (
          <span className="text-xs text-stone-500">
            {diagnostics.length} diagnostic{diagnostics.length > 1 ? 's' : ''}
          </span>
        )}

        <div className="flex-1" />

        {/* Language toggle */}
        <div className="flex items-center rounded-sm border border-stone-300 overflow-hidden text-xs font-medium">
          {(['zh', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLangToggle(lang)}
              className={`h-7 px-3 transition-colors ${
                langOverride === lang
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              {lang === 'zh' ? '中文' : 'EN'}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-stone-200" />

        {/* Social icons toggle */}
        <button
          onClick={() => setShowSocialIcons((v) => !v)}
          className={`h-7 px-3 text-xs font-medium rounded-sm transition-colors ${
            showSocialIcons
              ? 'bg-stone-800 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-300'
          }`}
        >
          {showSocialIcons ? '🔗 Icons' : '🔗 Text'}
        </button>

        <div className="h-4 w-px bg-stone-200" />

        {/* Optimize button */}
        <button
          onClick={() => {
            if (optimized) {
              setOptimized(false)
              setSpacingScale(1.0)
            } else {
              setOptimized(true)
              setSpacingScale(0.85)
            }
          }}
          disabled={sourceStatus === 'invalid'}
          className={`h-7 px-3 text-xs font-medium rounded-sm transition-colors ${
            optimized
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-stone-100 text-stone-700 border border-stone-300 hover:bg-stone-200'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {optimized ? '✓ Optimized' : '⚡ Optimize Layout'}
        </button>

        {/* Spacing slider when optimized */}
        {optimized && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Spacing</span>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={spacingScale}
              onChange={(e) => setSpacingScale(parseFloat(e.target.value))}
              className="w-16 h-1 accent-blue-600"
            />
            <span className="text-xs text-stone-400 w-8">
              {Math.round(spacingScale * 100)}%
            </span>
          </div>
        )}

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={sourceStatus === 'invalid' || isExporting}
          className="h-7 px-3 text-xs font-medium bg-stone-900 text-white rounded-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? 'Exporting…' : 'Export PDF'}
        </button>
      </div>

      {/* ── Main split layout ── */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left: YAML Editor */}
        <ResizablePanel defaultSize={45} minSize={25}>
          <div className="h-full flex flex-col">
            {/* Diagnostics panel */}
            {diagnostics.length > 0 && (
              <div
                className="shrink-0 px-3 py-2 bg-stone-50 border-b border-stone-200 overflow-auto"
                style={{ maxHeight: 160 }}
              >
                {diagnostics.map((d, i) => (
                  <div
                    key={i}
                    className={`text-xs leading-relaxed break-words ${
                      d.severity === 'error'
                        ? 'text-red-600'
                        : d.severity === 'warning'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                    }`}
                  >
                    {d.severity === 'error'
                      ? '✗'
                      : d.severity === 'warning'
                        ? '⚠'
                        : 'ℹ'}{' '}
                    {d.message}
                    {d.line != null && (
                      <span className="text-stone-400 ml-1">
                        (line {d.line})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language="yaml"
                theme="vs-light"
                value={yamlSource}
                onChange={(value) => {
                  const src = value ?? ''
                  setYamlSource(src)
                  compile(src)
                }}
                options={{
                  fontSize: 12,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  renderWhitespace: 'selection',
                }}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Resume Preview */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <div className="h-full relative overflow-auto">
            {displayModel ? (
              <div
                style={{
                  transform: `scale(${previewZoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease',
                }}
              >
                <ResumeRenderer
                  model={displayModel}
                  optimized={optimized}
                  spacingScale={spacingScale}
                  showSocialIcons={showSocialIcons}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-400 text-sm">
                Enter valid YAML to see preview
              </div>
            )}

            {/* Floating zoom control — bottom-right of preview */}
            <div className="no-print sticky bottom-3 float-right mr-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-md shadow-sm px-2 py-1.5 z-10">
              <button
                onClick={() =>
                  setPreviewZoom((z) => Math.max(0.25, +(z - 0.1).toFixed(2)))
                }
                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded transition-colors text-sm font-medium"
                title="Zoom out"
              >
                −
              </button>
              <button
                onClick={() => setPreviewZoom(1.0)}
                className="min-w-[40px] h-6 flex items-center justify-center text-xs text-stone-600 hover:bg-stone-100 rounded transition-colors font-medium tabular-nums"
                title="Reset zoom"
              >
                {Math.round(previewZoom * 100)}%
              </button>
              <button
                onClick={() =>
                  setPreviewZoom((z) => Math.min(2.0, +(z + 0.1).toFixed(2)))
                }
                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded transition-colors text-sm font-medium"
                title="Zoom in"
              >
                +
              </button>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
