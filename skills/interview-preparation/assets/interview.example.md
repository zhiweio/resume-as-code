# Interview Preparation Guide: John Doe for Principal Data Architect at EcoPower Solutions

## 1. Technical Deep-Probing Reconnaissance

### 1.1 Candidate Risk Profile

**One-Sentence Risk Assessment:** Strong cloud data architecture background with hands-on AWS/Azure delivery, but the claimed "leadership" in the CDP project may mask individual-contributor work rather than true team leadership, and the resume shows no demonstrated experience with OT/IoT protocols despite EcoPower requiring OT/IT convergence.

**Top 3 Core Skepticisms:**

1. **Leadership depth**: The resume titles the candidate "Technical Lead" on the CDP project, but the described actions (designing architecture, writing Terraform, implementing Lambda functions) are individual-contributor tasks. Did the candidate truly lead a team, or were they the sole implementer?
2. **Streaming at scale**: The resume lists Spark and Flink but provides no evidence of production-grade real-time streaming at scale. The Redshift migration was batch-oriented. Is the Flink claim resume padding?
3. **OT/IoT blind spot**: EcoPower's core mission is unifying OT (MES, sensor data) with IT (ERP, CRM). The resume has zero experience with industrial protocols (OPC-UA, Modbus), edge computing, or MES integration. Can the candidate bridge this gap?

### 1.2 Assessment Framework

| Assessment Area                | Relevant Tech Points                                                         | Assessment Priority |
| ------------------------------ | ---------------------------------------------------------------------------- | ------------------- |
| Cloud Architecture (AWS/Azure) | Glue, Lambda, Step Functions, Redshift, S3, Cosmos DB, Terraform             | High Priority       |
| Data Pipeline & Streaming      | Spark, Flink, Kafka, real-time vs micro-batch trade-offs                     | High Priority       |
| Data Governance & Quality      | Glue Data Catalog, Great Expectations, data lineage                          | High Priority       |
| OT/IT Integration              | OPC-UA, Modbus, MES, edge computing, industrial data patterns                | High Priority       |
| Leadership & Team Management   | Technical lead scope, stakeholder management, cross-functional collaboration | High Priority       |
| Cloud Migration Strategy       | DMS, CDC, schema conversion, stored procedure migration                      | General Priority    |
| Domain Knowledge (Energy)      | Energy management, automation efficiency, digital transformation             | General Priority    |

---

## 2. Best-Practices Research

### 2.1 Data Pipeline & Streaming (Spark / Flink / Kafka)

- **Canonical Pattern:** Lambda architecture with a speed layer (Flink for sub-second anomaly detection) and a batch layer (Spark for hourly/daily aggregation). Kappa architecture (Kafka + Flink, replayable) is the modern alternative when the business can tolerate event-time semantics end-to-end.
- **Key Alternatives:**
  - Flink (true event-driven, per-event latency ~10–100ms) — operational complexity: state backend sizing, checkpoint tuning, backpressure handling.
  - Spark Structured Streaming (micro-batch, latency ~100ms–seconds) — simpler ops, reuses batch Spark skills, but cannot do true per-event processing.
  - Kafka Streams (embedded in app, no separate cluster) — lowest ops for Kafka-native shops, but JVM-only and limited to Kafka topics.
- **Production Pitfalls:**
  - Backpressure — observable via Flink `numRecordsInPerSecond` < `numRecordsOutPerSecond` sustained; root cause usually skewed keys or insufficient parallelism.
  - State blowup — observable via `checkpointSize` growth without rotation; root cause usually missing TTL on keyed state.
  - Late-data drops — observable via `numLateRecordsDropped` metric; root cause is watermark too aggressive for the use case.
- **Source:** Context7 (flink-docs), WebSearch "Flink state backend tuning 2025", DeepWiki (apache/flink).

### 2.2 OT/IT Integration (OPC-UA / MES / Edge)

- **Canonical Pattern:** Edge gateway (e.g., AWS IoT Greengrass or Azure IoT Edge) runs an OPC-UA client, normalizes industrial tags to a cloud-native payload (JSON over MQTT), buffers locally during network partitions, and streams to a cloud time-series store (Timestream / InfluxDB / TimescaleDB).
- **Key Alternatives:**
  - Direct OPC-UA to cloud (no edge) — lowest latency for read-only telemetry, but no buffering during partition and no local compute for filtering.
  - Edge + MQTT broker (e.g., HiveMQ Edge) — decouples protocol translation from cloud path; adds broker ops but enables local fan-out to multiple consumers.
  - Industrial Data Lake (e.g., AWS IoT SiteWise) — managed asset modeling and computed metrics, but locks you into a vendor's data model.
- **Production Pitfalls:**
  - Sensor noise vs. anomaly — observable via sustained high `anomaly_alert_rate` with no root cause; root cause is missing signal conditioning (Kalman filter, moving average) before threshold checks.
  - Edge buffer overflow — observable via `edge_buffer_size_bytes` approaching disk limit; root cause is cloud ingestion endpoint throttling or downtime.
  - Time skew across plants — observable via `event_time` histograms per site; root cause is NTP drift on legacy PLCs.
- **Source:** WebSearch "OPC-UA to MQTT gateway patterns 2025", WebFetch (AWS IoT Greengrass docs), DeepWiki (eclipse/mosquitto).

### 2.3 Data Governance & Quality (Lakehouse)

- **Canonical Pattern:** Zone-based lakehouse (Bronze raw → Silver cleansed → Gold curated) with schema registry (Glue Schema Registry or Confluent), column-level access control via Lake Formation, and declarative quality checks (Great Expectations or dbt tests) at every zone transition.
- **Key Alternatives:**
  - Great Expectations (Python-native, declarative expectations) — strong for batch, weaker for streaming; rich documentation but heavy JVM-style config.
  - dbt tests (SQL-native, integrated with transformation layer) — simplest for analytics engineers, but limited to SQL-expressible rules.
  - Deequ (Spark-native, AWS-maintained) — scales with Spark, but API is more verbose and community is smaller.
- **Production Pitfalls:**
  - Silent schema drift — observable via `unexpected_null_count` spike in Silver zone; root cause is upstream breaking change not caught by schema registry.
  - Quality check latency — observable via `quality_check_duration_p95` > SLA; root cause is full-table scans instead of incremental checks.
  - Quarantine backlog — observable via `quarantine_table_size` growth; root cause is no owner/process to triage rejected records.
- **Source:** Context7 (great_expectations), WebSearch "lakehouse data quality patterns 2025".

---

## 3. Personal Introduction Strategy

**Strategy**: As a Senior Data Architect with over 6 years of experience, your introduction should immediately establish your authority in designing scalable, cloud-native data solutions. You need to bridge your technical expertise in AWS/Azure and Big Data with the strategic needs of EcoPower Solutions — specifically, the unification of OT and IT data to drive energy management and automation efficiency. Emphasize your leadership in migration projects and cross-functional collaboration.

**Risk-Aware Framing**: The introduction proactively addresses the three Core Skepticisms: (1) the mention of "Technical Lead" and team coordination directly counters the leadership depth concern; (2) referencing Kafka and streaming architectures addresses the streaming-at-scale doubt; (3) acknowledging the OT/IT challenge head-on and positioning your data integration experience as transferable mitigates the OT blind spot.

**Draft Script**:

"Hi, I'm **John Doe**, a **Senior Data Architect** with over **6 years of experience** specializing in designing and delivering enterprise-grade, cloud-native data solutions. My core focus lies in modernizing legacy data ecosystems and building high-throughput real-time data pipelines using **AWS, Azure, Spark, and Flink**.

In my recent role as a Technical Lead at MegaConsulting, I spearheaded the digital transformation for a major client (BioLife Sciences), where I architected a unified **Customer Data Platform (CDP)** and led a strategic **10TB+ Enterprise Data Warehouse migration to AWS Redshift**. I coordinated a team of 4 engineers across two workstreams, managing sprint planning, code reviews, and stakeholder presentations. This experience honed my ability to manage complex, cross-functional projects involving ERP and CRM integrations, ensuring data governance and security while delivering tangible business value like a **40% reduction in query latency** and significant cost savings.

I am particularly drawn to **EcoPower Solutions** because of your commitment to digital transformation in the **Energy Management and Automation** sector. I understand your goal is to unify data across **OT (MES) and IT (ERP, CRM)** systems to enable advanced analytics. While my direct experience has been on the IT side, the fundamental challenge is the same — integrating heterogeneous, siloed data sources into a unified platform with governed, high-quality data. My background in hybrid cloud architectures (AWS/Azure) and my experience dealing with large-scale enterprise data integration make me well-equipped to lead your **Global Data & Performance** initiatives. I am eager to bring my expertise in data architecture and team leadership to help build your next-generation Enterprise Data Platform."

---

## 4. Project Deep Dives

### Project 1: BioLife Sciences Customer Data Platform (CDP)

**STAR Analysis**

- **Situation**: The client (BioLife Sciences) had fragmented customer data scattered across Salesforce, Databricks, and legacy systems, preventing a 360-degree view of the customer and hindering effective analytics.
- **Task**: As the Technical Lead, my role was to architect a unified, serverless data lakehouse on AWS to serve as the Single Source of Truth (SSOT).
- **Action**:
  - **Breadth (Architecture)**: I designed a **Lakehouse architecture** on AWS. I chose a serverless approach to minimize operational overhead and scale automatically. The architecture ingested data from Salesforce and legacy systems into a raw zone in S3, processed it using **AWS Glue/Spark**, and stored refined data in a curated zone for consumption.
  - **Depth (Implementation)**: I utilized **Terraform** for Infrastructure as Code (IaC) to ensure reproducible deployments. For the integration layer, I implemented event-driven workflows using **AWS Step Functions** and **Lambda** to trigger processing jobs upon data arrival. I enforced data quality checks within the pipeline to ensure reliability.
  - **Alignment**: This project directly demonstrates my ability to integrate disparate systems (CRM, legacy), a key requirement for EcoPower's OT/IT unification. It also highlights my expertise in **AWS**, **Data Governance**, and **Stakeholder Management**.
- **Result**: Successfully established a SSOT, reducing deployment time by **60%** via Terraform and optimizing compute costs by **40%** through serverless orchestration.

### Project 2: Enterprise Data Warehouse Migration to AWS

**STAR Analysis**

- **Situation**: The organization was facing scalability bottlenecks with an on-premise 10TB+ SQL Server data warehouse, leading to slow reporting and high maintenance costs.
- **Task**: Lead the strategic migration of this massive dataset to a cloud-native solution on **Amazon Redshift**.
- **Action**:
  - **Breadth (Architecture)**: I designed a "lift and shift" followed by "optimize" strategy. We used **AWS DMS (Database Migration Service)** for the initial load and CDC (Change Data Capture). The target was **Redshift** for its columnar storage and massive parallel processing (MPP) capabilities.
  - **Depth (Implementation)**: I architected a serverless migration factory. I used **Python** scripts triggered by **Lambda** to automate schema conversion and data validation. I optimized Redshift distribution and sort keys based on query patterns to maximize performance. I also handled the complexity of mapping SQL Server stored procedures to Redshift SQL.
  - **Alignment**: This proves my capability in **Data Architecture (OLAP)**, **Cloud Migration**, and **Project Management**. It shows I can handle the scale and complexity required for EcoPower's enterprise data platform.
- **Result**: Achieved a **300% acceleration** in data transfer, a **5x improvement** in query performance, and reduced infrastructure costs by **25%**.

### Project 3: Retail Master Data Management (MDM) Platform

**STAR Analysis**

- **Situation**: The retail business suffered from critical data inconsistencies across systems, leading to reporting discrepancies and operational errors.
- **Task**: Design and implement a centralized MDM system to govern retail data assets.
- **Action**:
  - **Breadth (Architecture)**: I chose **Azure** as the platform, leveraging **Cosmos DB** for its multi-model capabilities and global distribution, and **Power Platform** for a user-friendly data stewardship interface.
  - **Depth (Implementation)**: I designed the data model in Cosmos DB to handle high-volume reads/writes with sub-second latency. I implemented a "Zero Code" framework where metadata defined the validation rules, allowing business users to manage rules without engineering support. Automated ETL pipelines synchronized the master data back to downstream systems.
  - **Alignment**: This highlights my **Azure** expertise and experience with **Data Governance** and **Master Data Management**, which is crucial for ensuring data quality across EcoPower's global operations.
- **Result**: Reduced data discrepancies by **95%** and significantly lowered manual maintenance overhead.

---

## 5. Deep-Probing Technical Q&A

### Category 1: Specific Technical Questions

**1. [Main Question]** In the BioLife CDP project, you used AWS Glue and Spark for data processing. How did you handle schema evolution when upstream Salesforce fields changed?

- **Follow-up 1:** Did you use Glue's schema registry or a custom schema management approach? How did you detect breaking vs. non-breaking changes?
- **Follow-up 2:** What happened to downstream consumers when a schema change occurred? Did you implement any compatibility checks in the pipeline?
- **Scoring Points:**
  - **Weak (1–2):** Recites "schema registry" definition; cannot name a compatibility mode (backward/forward/full); no project link.
  - **Adequate (3–4):** Describes their actual schema-evolution handling with one concrete detail (e.g., "we added new columns as nullable"); names ≥1 compatibility mode.
  - **Strong (5):** Names ≥2 compatibility modes (backward, forward, full) with explicit trade-offs; cites ≥1 production failure mode (e.g., downstream consumer broke when a field was renamed); describes a detection mechanism (CI check, schema-registry webhook).
  - **Exceptional (6):** Quantifies the trade-off against the company's downstream-consumer count; proposes a versioned-contract approach (Protobuf/Avro with a registry) with a migration policy for breaking changes.
- **Reference Answer:**
  - **Core Answer:** We used the Glue Schema Registry with Avro as the wire format. New fields were added as nullable with defaults (backward-compatible); breaking changes (renames, type changes) required a versioned topic and a coordinated consumer migration window.
  - **Technical Detail:** We registered schemas with `COMPATIBILITY_BACKWARD` for the Bronze zone (tolerates new optional fields) and `COMPATIBILITY_FULL` for Silver/Gold (stricter, since downstream BI tools assume stability). A CI step ran `aws glue get-schema-version-diff` on every PR touching the ingestion contract. When Salesforce renamed `Account.BillingState` to `Account.BillingStateCode`, we caught it in CI, created a v2 schema, and gave downstream consumers a 2-week migration window before deprecating v1.
  - **Trade-offs / Alternatives:** (1) Confluent Schema Registry — richer compatibility controls and REST API, but adds a self-managed component (or Confluent Cloud cost). (2) dbt schema tests — SQL-native and integrated with transformation, but only validates at rest, not at ingestion. (3) No registry, manual review — zero infra, but relies on human discipline and breaks under team growth. Our choice (Glue Schema Registry) was the lowest-friction option inside an all-AWS shop.
  - **Resume Connection:** Maps directly to the CDP ingestion layer. The CI schema-diff check was added after a downstream Looker dashboard broke for 6 hours when a Salesforce field rename propagated unchecked.

**2. [Main Question]** Your Redshift migration involved 10TB+ of data. Walk me through how you designed the Distribution Keys and Sort Keys for your most critical analytical tables.

- **Follow-up 1:** How did you identify the optimal distribution strategy? Did you use Redshift's system tables (STV_BLOCKLIST, SVV_TABLE_INFO) to validate your choices post-migration?
- **Follow-up 2:** Did you encounter any data skew issues? How did you detect and resolve them?
- **Scoring Points:**
  - **Weak (1–2):** Recites "KEY distribution is best for joins"; cannot name a sort-key type; no project link.
  - **Adequate (3–4):** Describes their actual dist-key choice with one concrete detail (e.g., "we used customer_id as dist key"); names ≥1 sort-key type (compound or interleaved).
  - **Strong (5):** Names all 3 dist styles (KEY, ALL, EVEN) with explicit trade-offs; cites ≥1 system table used for validation (SVV_TABLE_INFO, STL_QUERY); describes a skew-detection method (e.g., `SELECT slice, count(*) FROM table GROUP BY slice`).
  - **Exceptional (6):** Quantifies the trade-off against the company's specific query workload (e.g., "80% of queries filter on date, so compound sort key on (date, customer_id) cut p95 from 8s to 1.2s"); proposes a workload-driven re-keying cadence.
- **Reference Answer:**
  - **Core Answer:** For the `fact_sales` table (the largest, ~4TB), we used `DISTSTYLE KEY(customer_id)` because 90% of our analytical queries joined facts to a `dim_customer` table on `customer_id`. We used a compound sort key on `(order_date, customer_id)` because the dominant query pattern was "last 30 days for customer X".
  - **Technical Detail:** We validated via `SVV_TABLE_INFO` (rows, size, skew) and `STL_QUERY` / `STL_EXPLAIN` (scan row counts, plan shape). Skew was checked with `SELECT slice, COUNT(*) FROM fact_sales GROUP BY slice ORDER BY slice` — a healthy table shows roughly equal counts per slice. We found 2x skew on `fact_inventory` because `product_id` was concentrated in 3 large SKUs; we switched that table to `DISTSTYLE EVEN` and accepted the broadcast cost on the (rare) inventory-customer join.
  - **Trade-offs / Alternatives:** (1) `DISTSTYLE ALL` (replicate small dim tables to every slice) — eliminates broadcast joins, but only viable for tables < 2–3GB. (2) `DISTSTYLE EVEN` (round-robin) — safest default when no clear join key, but forces broadcasts on every join. (3) Interleaved sort key — better for multi-dimensional filters, but 4x slower to load and requires `VACUUM REINDEX`. Our choice (KEY + compound sort) was workload-driven: we logged the top-20 queries for 2 weeks before committing.
  - **Resume Connection:** Maps to the Redshift migration project. The skew-detection query was added to a weekly ops dashboard after a p95 latency spike was traced to a silently skewed `fact_inventory` table.

**3. [Main Question]** You mentioned using Flink alongside Spark. In the context of EcoPower's OT data (sensor streams from MES), when would you choose Flink over Spark Structured Streaming, and what specific Flink features would you leverage?

- **Follow-up 1:** How would you handle late-arriving data from industrial sensors? Would you use Flink's watermark mechanism, and how would you configure the allowed lateness?
- **Follow-up 2:** For stateful computations on sensor streams (e.g., rolling averages over temperature readings), how would you manage state backend size and checkpointing intervals?
- **Scoring Points:**
  - **Weak (1–2):** Recites "Flink is lower latency"; cannot distinguish event-driven from micro-batch; no project link.
  - **Adequate (3–4):** Distinguishes true event-driven (Flink) from micro-batch (Spark); names ≥1 Flink feature (watermark, state backend) at a conceptual level.
  - **Strong (5):** Names ≥3 Flink-specific features (watermarks, allowed lateness, state backends, checkpoint intervals, savepoints) with explicit tuning guidance; cites ≥1 production failure mode (state blowup, backpressure).
  - **Exceptional (6):** Quantifies the latency/throughput trade-off against the company's specific OT use case (sub-second anomaly detection vs. hourly aggregation); proposes a hybrid (Flink for hot path, Spark for cold path) with reasoning.
- **Reference Answer:**
  - **Core Answer:** For EcoPower's sub-second anomaly detection on sensor streams, Flink is the right choice — its per-event processing model gives ~10–100ms latency vs. Spark's ~100ms–seconds micro-batch. I'd use Flink's event-time watermarks, RocksDB state backend, and unaligned checkpoints for the hot path; Spark Structured Streaming for the cold-path hourly/daily aggregation where its batch lineage and SQL surface area are more valuable.
  - **Technical Detail:** For late-arriving sensor data, I'd set the watermark to `event_time - 5s` (tuned to the observed network jitter from edge gateways) and `allowedLateness` to 30s — late events within 30s update the window result; beyond that they're routed to a side output for forensic analysis. For state, I'd use the RocksDB state backend (incremental checkpoints, scales to TBs) with a checkpoint interval of 1min (vs. the default 0) and unaligned checkpoints enabled to tolerate backpressure without checkpoint timeouts. State TTL would be set to 24h on rolling-window state to prevent unbounded growth.
  - **Trade-offs / Alternatives:** (1) Spark Structured Streaming — simpler ops (reuses batch Spark skills), but micro-batch latency caps at ~100ms and stateful processing is less flexible. (2) Kafka Streams — embedded in the app, no separate cluster, but JVM-only and limited to Kafka topics. (3) Lambda architecture (Flink hot + Spark cold) — operational complexity of two engines, but each is fit-for-purpose. Given EcoPower's mixed latency profile, the hybrid is the right call.
  - **Resume Connection:** `Gap to Prepare:` My Flink experience is at the POC level (a real-time alerting POC in the CDP project), not production at scale. The closest production analog is my Spark Structured Streaming work for near-real-time CRM sync. Recommended lab: deploy a Flink job on a Kafka stream of synthetic sensor data, intentionally inject late events and backpressure, and observe watermark + checkpoint behavior.

### Category 2: Architecture & Design Questions

**4. [Main Question]** You designed a serverless lakehouse architecture for the CDP. Walk me through why you chose serverless (Lambda + Step Functions) over a containerized approach (ECS/EKS) for the orchestration layer.

- **Follow-up 1:** At what scale would you reconsider this decision? What are the specific cost or latency breakpoints where containers become more economical?
- **Follow-up 2:** How did you handle cold start issues in Lambda for time-sensitive data processing jobs?
- **Scoring Points:**
  - **Weak (1–2):** Recites "serverless is cheaper"; cannot name a breakpoint; no project link.
  - **Adequate (3–4):** Names ≥1 serverless trade-off (cold start, invocation cost) and describes their actual choice with one concrete detail.
  - **Strong (5):** Names ≥3 trade-offs (cold start, invocation cost, max duration, vendor lock-in) with explicit breakpoints; cites ≥1 production failure mode (e.g., Lambda timeout on a long-running job).
  - **Exceptional (6):** Quantifies the cost crossover (e.g., "at >1M invocations/day with >5min average duration, Fargate becomes cheaper"); proposes a hybrid (Lambda for spiky short jobs, Fargate for sustained long jobs) with reasoning.
- **Reference Answer:**
  - **Core Answer:** We chose serverless (Lambda + Step Functions) because the CDP workload was spiky (intraday peaks from Salesforce sync) and job durations were <5min. The operational overhead of running a 24/7 ECS/EKS cluster for a workload that idled 60% of the day was not justified. We'd reconsider at the point where sustained throughput or job duration made the always-on cost amortize — roughly >1M invocations/day with >5min average duration.
  - **Technical Detail:** For cold starts, we used Provisioned Concurrency on the 3 most latency-sensitive Lambdas (the Salesforce ingestion triggers), eliminating cold-start latency for those at the cost of ~$50/month. For the rest, we accepted cold starts (200–500ms) because they were batch jobs where 500ms was irrelevant. Step Functions Standard Workflows were used for the orchestration (we needed exactly-once semantics and the per-execution pricing was acceptable at our volume); Express Workflows would have been cheaper but lacked the audit trail.
  - **Trade-offs / Alternatives:** (1) ECS on Fargate — predictable cost for sustained workloads, no 15min timeout, but you pay for the capacity even when idle. (2) EKS — most flexible, but the operational burden (upgrades, node management, observability) is significant and only worth it for large platform teams. (3) Airflow on EC2 — most expressive DAGs, but self-managed and the scheduler itself is a single point of failure. Our choice (Lambda + Step Functions) was the lowest-ops option for a 4-engineer team.
  - **Resume Connection:** Maps to the CDP orchestration layer. The Provisioned Concurrency decision was made after a cold-start spike caused a Salesforce sync to miss its SLA window during a peak.

**5. [Main Question]** EcoPower's target architecture requires a unified data platform across OT and IT. Given your experience with both AWS and Azure, which cloud would you recommend for this initiative, and why?

- **Follow-up 1:** What specific services would you use for OT data ingestion (sensor streams from MES)? How would you handle the protocol translation layer (OPC-UA to cloud-native formats)?
- **Follow-up 2:** How would you design the data governance layer to span both OT and IT domains? Would you use a single catalog or federated approach?
- **Scoring Points:**
  - **Weak (1–2):** Picks a cloud based on personal preference; cannot name an OT-specific service; no project link.
  - **Adequate (3–4):** Names ≥1 OT-specific service (IoT Greengrass, IoT Edge, SiteWise) and describes a conceptual ingestion path.
  - **Strong (5):** Compares ≥2 clouds across OT-specific services, edge compute, and protocol support; cites ≥1 production trade-off (e.g., "AWS IoT Greengrass has broader OPC-UA support, but Azure IoT Edge integrates better with existing Azure AD").
  - **Exceptional (6):** Proposes a concrete architecture grounded in EcoPower's hybrid footprint (e.g., "AWS for OT ingestion given Greengrass's OPC-UA client, Azure for IT given the existing Power BI / Synapse investment, with a federated governance layer via Purview + Glue Catalog cross-reference").
- **Reference Answer:**
  - **Core Answer:** Given EcoPower's existing Azure investment (Power BI, Synapse) for IT analytics and the stronger OT-specific service portfolio on AWS (IoT Greengrass, IoT SiteWise), I'd recommend a hybrid: AWS for OT ingestion and edge compute, Azure for IT analytics and BI, with a federated governance layer. A single-cloud approach would force a painful migration of either the OT tooling or the existing BI stack.
  - **Technical Detail:** OT ingestion: AWS IoT Greengrass on the edge gateway runs an OPC-UA client, normalizes tags to JSON over MQTT, buffers locally during partitions, and streams to AWS IoT Core → Timestream for hot queries and S3 (Bronze zone) for cold storage. Protocol translation is handled by the Greengrass OPC-UA connector. IT ingestion stays on Azure (Synapse Pipelines from ERP/CRM). Governance: Azure Purview as the primary catalog (it already scans Synapse and Power BI), with a custom Lambda that mirrors OT-asset metadata from IoT SiteWise into Purview via its REST API — one catalog, federated scanning.
  - **Trade-offs / Alternatives:** (1) All-AWS — simpler governance and billing, but requires migrating the existing Power BI / Synapse stack (high cost, high risk). (2) All-Azure — preserves IT investment, but Azure's OT portfolio (IoT Edge) is less mature than AWS's for OPC-UA. (3) Single catalog on either side — cleaner, but forces the other side's assets into a foreign catalog model. The hybrid is the pragmatic choice given EcoPower's starting point.
  - **Resume Connection:** `Gap to Prepare:` I have not architected an OT/IT hybrid in production. The closest analog is my hybrid AWS/Azure work in the Retail MDM project (Cosmos DB on Azure + S3 on AWS). Recommended lab: deploy an AWS IoT Greengrass core on a Raspberry Pi, connect a simulated OPC-UA server, and stream to Timestream.

### Category 3: Domain-Specific Questions

**6. [Main Question]** EcoPower's OT data comes from Manufacturing Execution Systems (MES) running on factory floors. This data is fundamentally different from IT data — high frequency, small payloads, often with strict latency requirements. How would you architect the ingestion layer for this type of data?

- **Follow-up 1:** How would you handle data buffering when the cloud ingestion endpoint is temporarily unavailable? What happens to the sensor data — is it lost, queued at the edge, or both?
- **Follow-up 2:** Industrial sensors often produce noisy data (spikes, dropouts, calibration drift). How would you design a data quality pipeline that distinguishes genuine anomalies from sensor noise?
- **Scoring Points:**
  - **Weak (1–2):** Recites "use Kafka"; cannot name an edge-buffering strategy; no project link.
  - **Adequate (3–4):** Names ≥1 edge-buffering strategy (local disk, MQTT broker) and describes a conceptual noise-handling approach (moving average, threshold).
  - **Strong (5):** Names ≥3 specific patterns (edge buffering with size/time-based flush, protocol gateway OPC-UA→MQTT, time-series store with downsampling) and ≥1 noise-handling technique (Kalman filter, Hampel filter) with explicit trade-offs.
  - **Exceptional (6):** Quantifies the trade-off against EcoPower's specific sensor profile (e.g., "at 1Hz per sensor across 10K sensors, raw ingest is 10K events/s — downsample to 0.1Hz at the edge for cold path, keep 1Hz for hot path"); proposes a tiered quality pipeline (edge filtering → cloud anomaly detection → human-in-the-loop triage).
- **Reference Answer:**
  - **Core Answer:** The ingestion layer should be edge-first: an OPC-UA client on a factory-floor gateway (AWS IoT Greengrass or Azure IoT Edge) normalizes industrial tags to JSON over MQTT, buffers locally to disk during cloud partitions, and streams to a cloud time-series store (Timestream) for hot queries and S3 for cold storage. Noise handling should be tiered: light filtering at the edge (moving average), heavier anomaly detection in the cloud (statistical or ML-based), with a human-in-the-loop triage for ambiguous cases.
  - **Technical Detail:** Edge buffering: Greengrass writes to a local SQLite ring buffer with a 7-day retention; if the cloud endpoint is unavailable, it backfills on reconnect. The MQTT topic structure is `ot/{site}/{line}/{sensor_id}/v1` for versioning. Cloud ingestion: IoT Core → Kinesis Data Firehose → Timestream (hot, 30-day TTL) and S3 (cold, Bronze zone). Noise handling: a Hampel filter at the edge (window=5, 3-sigma threshold) removes obvious spikes; in the cloud, an isolation-forest model flags anomalies that the Hampel filter passed, routing them to a `quarantine` topic for a domain expert to review.
  - **Trade-offs / Alternatives:** (1) Direct OPC-UA to cloud (no edge) — lowest latency for read-only telemetry, but no buffering during partition and no local compute for filtering. (2) Edge + Kafka (e.g., Confluent on edge) — higher throughput and replayability, but Kafka on the edge is operationally heavy. (3) AWS IoT SiteWise (managed) — handles asset modeling and computed metrics, but locks you into its data model. Our choice (Greengrass + Timestream) balances ops cost and flexibility.
  - **Resume Connection:** `Gap to Prepare:` I have no production OT experience. The closest analog is my real-time CRM sync pipeline (Kafka + Spark Structured Streaming), which shares the buffering and late-data patterns but not the protocol translation. Recommended lab: deploy Greengrass on a Raspberry Pi with a simulated OPC-UA server (e.g., `node-opcua`), inject network partitions, and observe the backfill behavior.

**7. [Main Question]** Energy management systems require both real-time monitoring (sub-second for critical alerts) and batch analytics (daily/weekly for efficiency reporting). How would you design a single data architecture that serves both latency profiles efficiently?

- **Follow-up 1:** How would you handle the "hot path" (real-time alerts) vs. the "cold path" (batch analytics) without duplicating data processing logic?
- **Follow-up 2:** What role would a time-series database (e.g., InfluxDB, Timestream) play in this architecture, and how would it interact with your existing Redshift/Synapse warehouse?
- **Scoring Points:**
  - **Weak (1–2):** Recites "Lambda architecture"; cannot name a specific service for either path; no project link.
  - **Adequate (3–4):** Describes a hot/cold path split with ≥1 service per path; names ≥1 time-series DB.
  - **Strong (5):** Names the Lambda or Kappa pattern with specific services (Flink + Timestream for hot, Spark + Redshift for cold); cites ≥1 data-consistency challenge between paths and a mitigation.
  - **Exceptional (6):** Quantifies the trade-off against EcoPower's specific alert SLA (e.g., "sub-second alert path via Flink + Timestream, daily batch via Spark + Redshift, with a 'warm' 5-min aggregation in Timestream for ops dashboards to avoid hitting Redshift"); proposes a unified semantic layer (e.g., dbt metrics) so business logic is defined once.
- **Reference Answer:**
  - **Core Answer:** I'd use a Lambda-style architecture: a hot path (Flink + Timestream) for sub-second alerts and a cold path (Spark + Redshift) for daily/weekly analytics. To avoid duplicating business logic, I'd define metrics once in a semantic layer (dbt metrics or a metrics store like Cube) and have both paths consume the same definitions. Timestream serves as the hot store (30-day TTL, sub-second queries); Redshift serves as the cold store (years of history, complex joins).
  - **Technical Detail:** Hot path: IoT Core → Kinesis → Flink (anomaly detection, alerting) → Timestream (hot store) + SNS (alert fanout). Cold path: S3 Bronze → Spark (Glue) → Redshift Silver/Gold (daily/weekly aggregates). The semantic layer: dbt metrics definitions live in a single repo; Flink jobs reference the same metric IDs (parsed at deploy time) so "energy efficiency KPI X" means the same thing in both paths. Timestream and Redshift are connected via Redshift Spectrum (Timestream data is exported to S3 hourly for Spectrum to query), so a BI tool can query both stores in a single SQL statement.
  - **Trade-offs / Alternatives:** (1) Kappa architecture (Kafka + Flink only, replay for batch) — simpler (one engine), but requires event-time semantics end-to-end and Redshift is still better for complex multi-year joins. (2) Single store (Redshift for everything) — simplest, but Redshift's p99 query latency (~seconds) cannot meet sub-second alert SLAs. (3) Single store (Timestream for everything) — great for hot, but Timestream's SQL surface and join capabilities are limited for complex analytics. The Lambda split is the right call for EcoPower's mixed profile.
  - **Resume Connection:** The hot/cold split mirrors my CDP architecture (Lambda for real-time CRM sync, Spark for daily aggregates), but at a different latency scale. The dbt-metrics-as-semantic-layer approach is a pattern I've used to keep Looker and ad-hoc SQL in sync.

---

## 6. Breadth Probe Questions

**8. [Main Question]** Your resume lists Kubernetes under "familiar with." If you were deploying the data processing layer of the CDP on K8s instead of Lambda, what specific challenges would you anticipate?

- **Follow-up 1:** How would you handle auto-scaling for Spark jobs on Kubernetes? What metrics would trigger scaling, and how would you avoid over-provisioning?
- **Follow-up 2:** How would you handle pod eviction during a shuffle stage — would you use local ephemeral storage or a remote shuffle service?
- **Scoring Points:**
  - **Weak (1–2):** Recites generic K8s features (pods, deployments) without connecting to data workloads; cannot name a stateful-workload challenge.
  - **Adequate (3–4):** Names ≥1 stateful-workload challenge (e.g., shuffle data loss on pod eviction) and a conceptual mitigation.
  - **Strong (5):** Names ≥3 specific challenges (shuffle eviction, ephemeral storage pressure, driver/executor lifecycle, network I/O contention) with mitigations; references the operator pattern (Spark Operator) and a remote shuffle service (e.g., Apache Celeborn).
  - **Exceptional (6):** Quantifies the cost/latency trade-off vs. the existing Lambda setup at the company's specific payload size; proposes a hybrid (K8s for sustained throughput, Lambda for spiky low-volume).
- **Reference Answer:**
  - **Core Answer:** The main challenges for Spark on K8s vs. serverless Lambda are: stateful workload lifecycle (shuffle data, executor state), resource bin-packing efficiency, and operational complexity (operator management, monitoring, upgrades).
  - **Technical Detail:** I'd use the Spark Operator for driver/executor lifecycle, configure pod-level resource requests/limits to avoid noisy-neighbor contention, and mount local ephemeral storage with a `medium: Memory` fallback for shuffle. For auto-scaling I'd track `spark_executor_active_tasks` and pending task queue depth rather than CPU alone. Pod eviction during shuffle is the highest-risk failure — I'd use a remote shuffle service (Apache Celeborn or AWS EMR Shuffle) to decouple shuffle storage from pod lifetime.
  - **Trade-offs / Alternatives:** (1) Pure K8s with local shuffle — lowest cost, but shuffle loss on eviction causes stage retry and wasted compute. (2) K8s + remote shuffle — higher storage cost, but eliminates retry storms and enables elastic executors. (3) Stay on Lambda — zero ops, but capped at 15min jobs and 10GB ephemeral; suits the spiky low-volume end of the workload.
  - **Resume Connection:** `Gap to Prepare:` I have not run Spark on K8s in production. The closest analog is my Terraform-managed Lambda orchestration in the CDP project — the IaC discipline transfers, but I'd need to study the Spark Operator CRD and K8s resource model hands-on before owning this in production. Recommended lab: deploy a 3-node K8s cluster, run a Spark job with intentional pod eviction, observe the retry behavior.

**9. [Main Question]** Your resume mentions "exposure to" Airflow. If you were to replace Step Functions with Airflow for orchestrating the CDP's data pipelines, what would be the key trade-offs?

- **Follow-up 1:** How would you handle Airflow's scheduler scaling for a pipeline with 200+ DAGs running across multiple environments?
- **Follow-up 2:** How would you handle Airflow's known pain point of backfill performance for historical reprocessing?
- **Scoring Points:**
  - **Weak (1–2):** Recites "Airflow has more operators"; cannot name a trade-off; no project link.
  - **Adequate (3–4):** Names ≥1 trade-off (self-managed vs. serverless, scheduler scaling) and describes a conceptual mitigation.
  - **Strong (5):** Names ≥3 trade-offs (self-managed ops, scheduler scaling, DAG-as-Python flexibility, backfill performance) with explicit pros/cons; cites ≥1 production failure mode (e.g., scheduler deadlock on a malformed DAG).
  - **Exceptional (6):** Quantifies the ops cost (e.g., "Airflow on EKS needs ~0.5 FTE for upgrades, monitoring, and DAG review") and proposes a hybrid (Airflow for complex cross-team DAGs, Step Functions for simple event-driven triggers).
- **Reference Answer:**
  - **Core Answer:** The key trade-offs are: Airflow gives you DAG-as-Python flexibility and a rich operator ecosystem, but you pay for it with self-managed ops (scheduler, webserver, DB) and known scaling pain points. For a 4-engineer team, I'd keep Step Functions for simple event-driven triggers and only introduce Airflow if the DAG complexity (cross-team dependencies, complex branching) justified the ops cost.
  - **Technical Detail:** For scheduler scaling at 200+ DAGs, I'd run Airflow on EKS with the KubernetesExecutor (each task gets its own pod, no worker contention), a Celery-based scheduler with 2+ schedulers for HA, and partition DAGs by team into separate Airflow deployments to limit blast radius. For backfill, I'd use Airflow's `max_active_runs` per DAG to throttle parallelism, and for large historical reprocessing I'd bypass Airflow entirely and run a one-off Glue/Spark job — Airflow is not designed for bulk backfill.
  - **Trade-offs / Alternatives:** (1) Step Functions — serverless, zero ops, but limited DAG expressiveness (no loops, limited branching) and per-execution pricing adds up at high volume. (2) Airflow on MWAA (managed) — removes the scheduler ops burden, but you lose control over the Airflow version and pay a premium. (3) Prefect / Dagster — modern alternatives with better dynamic DAGs and asset-centric models, but smaller ecosystem. Our choice (Step Functions) was the lowest-ops option for a small team.
  - **Resume Connection:** `Gap to Prepare:` My Airflow exposure is limited to a POC, not production. The closest production analog is my Step Functions orchestration in the CDP. Recommended lab: deploy Airflow on a local Kubernetes cluster (kind), port one CDP Step Functions workflow to an Airflow DAG, and compare the ops experience.

**10. [Main Question]** Your resume lists "familiar with" Databricks. If you were to migrate the CDP's Spark workloads from AWS Glue to Databricks, what specific benefits and trade-offs would you evaluate?

- **Follow-up 1:** How would you handle the cost model difference (Glue DPU-hours vs. Databricks DBUs)?
- **Follow-up 2:** How would you decide between Databricks SQL, Photon, and standard Databricks Runtime for different workload types?
- **Scoring Points:**
  - **Weak (1–2):** Recites "Databricks is faster"; cannot name a specific feature; no project link.
  - **Adequate (3–4):** Names ≥1 Databricks benefit (Photon, Delta Lake, MLflow integration) and a conceptual trade-off.
  - **Strong (5):** Names ≥3 specific features (Photon, Delta Lake, Unity Catalog, MLflow, Job orchestration) with explicit trade-offs; cites ≥1 cost consideration (DBU pricing, cluster auto-termination).
  - **Exceptional (6):** Quantifies the cost/performance trade-off (e.g., "Photon gives ~3x speedup on TPC-DS but at ~1.5x DBU cost, so net cost is ~0.5x for CPU-bound queries") and proposes a workload-based routing strategy.
- **Reference Answer:**
  - **Core Answer:** The main benefits of Databricks over Glue are: Photon (C++ vectorized engine, ~3x faster on CPU-bound queries), Unity Catalog (unified governance across SQL/Spark/ML), and integrated MLflow/Delta Live Tables. The main trade-offs are: cost (DBUs are ~1.5–2x Glue DPU-hours for equivalent compute), vendor lock-in (Delta Lake is open but Unity Catalog is not), and operational maturity (Databricks requires workspace management).
  - **Technical Detail:** Cost model: Glue charges per DPU-hour (~$0.44/DPU-hour) with a 1-min minimum; Databricks charges per DBU (~$0.15–0.55/DBU depending on tier) with a 1-min minimum but higher DBU count per instance. For a CPU-bound Spark job, Photon's ~3x speedup often offsets the higher DBU rate, yielding net lower cost. For I/O-bound jobs, the speedup is smaller and Glue wins. Workload routing: Databricks SQL + Photon for interactive BI queries (sub-second needed), standard Databricks Runtime for ETL batch (Photon's benefit is smaller), Delta Live Tables for declarative pipelines (reduces boilerplate).
  - **Trade-offs / Alternatives:** (1) Stay on Glue — cheapest for simple ETL, but no Unity Catalog equivalent and slower engine. (2) EMR Serverless — AWS-native, cheaper than Databricks, but no Photon/Unity Catalog. (3) Snowflake — best for SQL-only workloads, but Spark/ML story is weaker. The Databricks migration is justified if governance (Unity Catalog) or ML platform (MLflow) integration is a priority; for pure ETL, Glue/EMR is more cost-effective.
  - **Resume Connection:** `Gap to Prepare:` My Databricks exposure is limited to a training environment, not production. The closest production analog is my Glue/Spark work in the CDP. Recommended lab: deploy a Databricks community edition workspace, port one CDP Glue job, and benchmark cost/performance vs. the Glue baseline.

---

## 7. Behavioral & Cultural Fit

**11. [Main Question]** Describe a time you had a conflict with a stakeholder regarding a technical decision.

_(Risk connection: Tests the leadership depth identified in Skepticism #1 — can the candidate demonstrate real stakeholder influence, not just technical execution?)_

- **Scenario:** A business stakeholder wants a feature delivered immediately, but you know the "quick fix" will create technical debt and scalability issues later.
- **Scoring Points:**
  - **Weak (1–2):** Blames the stakeholder; describes the conflict as "I was right, they were wrong"; no resolution or learning.
  - **Adequate (3–4):** Describes a specific situation with personal role; reaches a compromise, but outcome is vague ("we agreed on a plan").
  - **Strong (5):** Complete STAR with quantified outcome (e.g., "shipped the tactical fix in 2 days, deferred the strategic fix to sprint 3, no production incidents") AND a specific transferable lesson (e.g., "I now frame trade-offs in the stakeholder's KPI language, not my technical language").
  - **Exceptional (6):** STAR + systems-level thinking — changed a process (e.g., "introduced a 30-min trade-off review for any feature >2 eng-days, which prevented 3 similar conflicts in the next quarter") AND connects the lesson to the target role's known cross-functional challenges.
- **Reference Answer (STAR):**
  - **Situation:** In the Retail MDM project, the business owner wanted to bypass validation rules to migrate 50K records before quarter-end. I knew this would corrupt the downstream reporting they themselves relied on.
  - **Task:** As the tech lead, I had to unblock their deadline without compromising data integrity.
  - **Action:** I said "yes" to their deadline, not their method. I proposed a 3-step plan: (1) load the records into a `staging_unverified` table within 4 hours so they could see the data; (2) run validation async and flag failures; (3) only promote verified records to the master table. I explained the risk in their language — "the dashboard you show the board will show wrong numbers if we skip step 2" — not in my language of referential integrity.
  - **Result:** They hit their quarter-end deadline with 47K of 50K records promoted (3K failed validation and were fixed in the next sprint). No downstream reporting incidents. Reflection: I learned to translate technical risk into the stakeholder's KPI before proposing a solution — I now open these conversations with "here's what you'll lose" rather than "here's what's wrong." I also introduced a 30-min trade-off review for any feature >2 eng-days, which prevented 3 similar conflicts in the next quarter.

**12. [Main Question]** How do you manage a team under tight deadlines?

_(Risk connection: Directly probes Skepticism #1 — the candidate must describe actual team management, not solo heroics.)_

- **Scenario:** The migration deadline is approaching, and you are behind schedule due to unforeseen data complexity.
- **Scoring Points:**
  - **Weak (1–2):** Describes working harder/longer hours; no team management; no prioritization; vague "we pulled it off."
  - **Adequate (3–4):** Describes a specific situation with some team coordination; outcome is unclear or learning is generic.
  - **Strong (5):** Complete STAR with quantified outcome (e.g., "delivered 80% of scope on time, deferred 20% with stakeholder sign-off, zero burnout") AND a specific transferable lesson (e.g., "I now re-prioritize scope, not effort, when behind schedule").
  - **Exceptional (6):** STAR + systems-level thinking — changed a process (e.g., "introduced a weekly risk-burn-down for any project >1 sprint behind, which caught 2 similar risks early in the next quarter") AND connects the lesson to the target role's known delivery pressure.
- **Reference Answer (STAR):**
  - **Situation:** During the Redshift migration, we hit performance issues on the stored-procedure conversion workstream 3 weeks before go-live. The original plan had 2 engineers on that workstream; they were behind by ~40%.
  - **Task:** As the tech lead, I had to recover the schedule without burning out the team or compromising the go-live date (which was tied to a fiscal-year reporting commitment).
  - **Action:** I did three things. First, I re-prioritized scope: I split the 200+ stored procedures into "critical for go-live" (80) and "deferred to sprint +1" (120), and got the business owner to sign off on the split in a 30-min meeting. Second, I jumped in to pair with the 2 engineers on the hardest conversions, unblocking them on 3 specific SQL Server → Redshift patterns (cursor → window function, temp table → CTE, dynamic SQL → prepared statements). Third, I set a daily 15-min standup focused only on blockers (no status updates) to surface issues within 24h instead of the weekly cadence.
  - **Result:** We delivered the 80 critical procedures on time for go-live; the remaining 120 shipped in the next sprint. Zero engineers burned out (no weekend work). Reflection: I learned to re-prioritize scope, not effort, when behind schedule — "what's the MVP for go-live?" is a more useful question than "how do we work faster?" I also introduced a weekly risk-burn-down for any project >1 sprint behind, which caught 2 similar risks early in the next quarter.

**13. [Main Question]** Tell me about a time you had to learn a new technology quickly to deliver a project.

_(Risk connection: Tests the OT/IoT gap identified in Skepticism #3 — can the candidate demonstrate a pattern of rapid, structured learning?)_

- **Scenario:** A project requires a technology you have not used in production, and the timeline does not allow for formal training.
- **Scoring Points:**
  - **Weak (1–2):** Describes reading docs/watching videos; no project outcome; vague "I figured it out."
  - **Adequate (3–4):** Describes a specific learning situation with a project link; outcome is unclear or learning method is generic.
  - **Strong (5):** Complete STAR with quantified outcome (e.g., "delivered the feature in 2 weeks, 0 production bugs in the first month") AND a specific transferable learning method (e.g., "I build a throwaway POC first to de-risk the unknowns, then implement for production").
  - **Exceptional (6):** STAR + systems-level thinking — created a reusable artifact (e.g., "wrote a runbook that reduced the team's ramp-up time on the same tech from 2 weeks to 3 days") AND connects the learning method to the target role's known tech gaps.
- **Reference Answer (STAR):**
  - **Situation:** In the CDP project, we needed to integrate with Salesforce's Bulk API 2.0 for the initial historical load. I had never used the Bulk API (only the REST API), and the historical load was on the critical path for go-live.
  - **Task:** I had 1 week to learn the Bulk API 2.0, build the ingestion job, and validate the data load against a 50M-row source.
  - **Action:** I used a structured 3-step approach. First, I built a throwaway POC in a notebook that loaded 10K rows end-to-end — this de-risked the unknowns (auth, batch sizing, retry semantics) in 1 day. Second, I read the official Salesforce docs and 2 engineering blog posts from companies that had done similar loads, noting their batch-size and parallelism recommendations. Third, I implemented the production job in Python with the `simple-salesforce` library, adding the retry and checkpointing logic the POC had shown was necessary. I ran a 1M-row test on day 4, found a throttling issue, and adjusted the batch size from 10K to 5K with a 2s delay between batches.
  - **Result:** The 50M-row historical load completed in 6 hours (vs. the projected 12), with 0 data-loss incidents. Reflection: I learned to always build a throwaway POC first — it surfaces the unknown unknowns in hours instead of days. I also wrote a 2-page runbook on the Bulk API 2.0 patterns (batch sizing, retry, checkpointing) that reduced the team's ramp-up time on the same tech from 2 weeks to 3 days for the next integration. I'd apply the same POC-first approach to ramping up on EcoPower's OT/IoT stack.

---

## 8. Questions to Ask (Reverse Interview)

**Q1 (Business/Strategic)**: "I noticed EcoPower's strong focus on 'Digital Transformation & Data Architecture'. How do you see the 'Enterprise Data Platform' evolving over the next 2–3 years to support AI-driven energy efficiency services for your customers?"

- _Why this question works:_ Tests whether the company has a real product vision (vs. a cost-center data team). Listen for specific customer-facing AI features, not internal analytics. A vague answer ("we're exploring AI") suggests the platform is a cost center; a specific answer ("we're building predictive maintenance for customer X") suggests a revenue enabler.

**Q2 (Team/Technical)**: "You mentioned a hybrid cloud environment (AWS/Azure). How is the team currently managing the complexity of data governance and lineage across these two clouds? Are you looking to consolidate or build a federated mesh?"

- _Why this question works:_ Surfaces the team's actual operational maturity. Listen for whether they have a real governance tool (Purview, Collibra, custom) or are "managing it in spreadsheets." Also signals whether the role will be building governance (greenfield) or maintaining an existing system (legacy).

**Q3 (Challenges)**: "What is the biggest technical bottleneck the team is currently facing in unifying the OT and IT data? Is it more about the technical integration or the data quality/standardization?"

- _Why this question works:_ Surfaces the real priority for the role. If the answer is "technical integration," the role is architecture-heavy; if "data quality/standardization," the role is governance-heavy. Either way, the answer tells you what to emphasize in your first 90 days.
