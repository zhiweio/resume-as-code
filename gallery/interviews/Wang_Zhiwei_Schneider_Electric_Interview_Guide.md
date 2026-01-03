# Interview Preparation Guide: Wang Zhiwei for Principal Data Architect at Schneider Electric

## 1. Personal Introduction Strategy

**Strategy**: As a Senior Data Architect with over 6 years of experience, your introduction should immediately establish your authority in designing scalable, cloud-native data solutions. You need to bridge your technical expertise in AWS/Azure and Big Data with the strategic needs of Schneider Electric—specifically, the unification of OT and IT data to drive energy management and automation efficiency. Emphasize your leadership in migration projects and cross-functional collaboration.

**Draft Script**:

"Hi, I'm **Wang Zhiwei**, a **Senior Data Architect** with over **6 years of experience** specializing in designing and delivering enterprise-grade, cloud-native data solutions. My core focus lies in modernizing legacy data ecosystems and building high-throughput real-time data pipelines using **AWS, Azure, Spark, and Flink**.

In my recent role as a Technical Lead at Cognizant, I spearheaded the digital transformation for a major client (Bayer), where I architected a unified **Customer Data Platform (CDP)** and led a strategic **10TB+ Enterprise Data Warehouse migration to AWS Redshift**. This experience honed my ability to manage complex, cross-functional projects involving ERP and CRM integrations, ensuring data governance and security while delivering tangible business value like a **40% reduction in query latency** and significant cost savings.

I am particularly drawn to **Schneider Electric** because of your commitment to digital transformation in the **Energy Management and Automation** sector. I understand your goal is to unify data across **OT (MES) and IT (ERP, CRM)** systems to enable advanced analytics. My background in hybrid cloud architectures (AWS/Azure) and my experience dealing with large-scale industrial and enterprise data make me well-equipped to lead your **Global Data & Performance** initiatives. I am eager to bring my expertise in data architecture and team leadership to help build your next-generation Enterprise Data Platform."

---

## 2. Project Deep Dives

### Project 1: Bayer Customer Data Platform (CDP)

**STAR Analysis**

- **Situation**: The client (Bayer) had fragmented customer data scattered across Salesforce, Databricks, and legacy systems, preventing a 360-degree view of the customer and hindering effective analytics.
- **Task**: As the Technical Lead, my role was to architect a unified, serverless data lakehouse on AWS to serve as the Single Source of Truth (SSOT).
- **Action**:
  - **Breadth (Architecture)**: I designed a **Lakehouse architecture** on AWS. I chose a serverless approach to minimize operational overhead and scale automatically. The architecture ingested data from Salesforce and legacy systems into a raw zone in S3, processed it using **AWS Glue/Spark**, and stored refined data in a curated zone for consumption.
  - **Depth (Implementation)**: I utilized **Terraform** for Infrastructure as Code (IaC) to ensure reproducible deployments. For the integration layer, I implemented event-driven workflows using **AWS Step Functions** and **Lambda** to trigger processing jobs upon data arrival. I enforced data quality checks within the pipeline to ensure reliability.
  - **Alignment**: This project directly demonstrates my ability to integrate disparate systems (CRM, legacy), a key requirement for Schneider's OT/IT unification. It also highlights my expertise in **AWS**, **Data Governance**, and **Stakeholder Management**.
- **Result**: Successfully established a SSOT, reducing deployment time by **60%** via Terraform and optimizing compute costs by **40%** through serverless orchestration.

### Project 2: Enterprise Data Warehouse Migration to AWS

**STAR Analysis**

- **Situation**: The organization was facing scalability bottlenecks with an on-premise 10TB+ SQL Server data warehouse, leading to slow reporting and high maintenance costs.
- **Task**: Lead the strategic migration of this massive dataset to a cloud-native solution on **Amazon Redshift**.
- **Action**:
  - **Breadth (Architecture)**: I designed a "lift and shift" followed by "optimize" strategy. We used **AWS DMS (Database Migration Service)** for the initial load and CDC (Change Data Capture). The target was **Redshift** for its columnar storage and massive parallel processing (MPP) capabilities.
  - **Depth (Implementation)**: I architected a serverless migration factory. I used **Python** scripts triggered by **Lambda** to automate schema conversion and data validation. I optimized Redshift distribution and sort keys based on query patterns to maximize performance. I also handled the complexity of mapping SQL Server stored procedures to Redshift SQL.
  - **Alignment**: This proves my capability in **Data Architecture (OLAP)**, **Cloud Migration**, and **Project Management**. It shows I can handle the scale and complexity required for Schneider's enterprise data platform.
- **Result**: Achieved a **300% acceleration** in data transfer, a **5x improvement** in query performance, and reduced infrastructure costs by **25%**.

### Project 3: Retail Master Data Management (MDM) Platform

**STAR Analysis**

- **Situation**: The retail business suffered from critical data inconsistencies across systems, leading to reporting discrepancies and operational errors.
- **Task**: Design and implement a centralized MDM system to govern retail data assets.
- **Action**:
  - **Breadth (Architecture)**: I chose **Azure** as the platform, leveraging **Cosmos DB** for its multi-model capabilities and global distribution, and **Power Platform** for a user-friendly data stewardship interface.
  - **Depth (Implementation)**: I designed the data model in Cosmos DB to handle high-volume reads/writes with sub-second latency. I implemented a "Zero Code" framework where metadata defined the validation rules, allowing business users to manage rules without engineering support. Automated ETL pipelines synchronized the master data back to downstream systems.
  - **Alignment**: This highlights my **Azure** expertise and experience with **Data Governance** and **Master Data Management**, which is crucial for ensuring data quality across Schneider's global operations.
- **Result**: Reduced data discrepancies by **95%** and significantly lowered manual maintenance overhead.

---

## 3. Technical Q&A Bank

### Category 1: Specific Technical Questions

**Q1: You mentioned using Spark and Flink. When would you choose Flink over Spark Structured Streaming?**

- **Answer**: **Flink** is a true streaming engine (event-driven), processing data row-by-row with very low latency. It is ideal for complex event processing, stateful computations, and scenarios requiring sub-second latency (e.g., fraud detection, industrial sensor monitoring). **Spark Structured Streaming** is micro-batch based. It processes data in small batches. It is generally easier to integrate if you are already in the Spark ecosystem and is sufficient for latencies in the seconds range. For Schneider's OT data (MES), if we need real-time anomaly detection on sensor data, Flink is the better choice.

**Q2: Explain the difference between OLTP and OLAP. How does this impact your database choice?**

- **Answer**: **OLTP (Online Transaction Processing)** is designed for transactional systems (high concurrency, small reads/writes, ACID compliance). Examples: SQL Server, PostgreSQL. **OLAP (Online Analytical Processing)** is designed for complex queries and aggregations on large datasets (fewer writes, massive reads). Examples: Redshift, Snowflake. In my architecture, I use OLTP databases (like Cosmos DB or RDS) for operational applications (MDM, transactional apps) and OLAP warehouses (Redshift, Synapse) for analytics and reporting.

**Q3: How does Kafka ensure high throughput and durability?**

- **Answer**: **Throughput**: Kafka uses **Sequential I/O** (appending to logs) which is much faster than random I/O. It also uses **Zero-Copy** to transfer data from disk to network buffer without copying it into application memory. **Durability**: Data is replicated across multiple brokers. A producer can wait for acknowledgments (acks=all) to ensure data is written to the leader and in-sync replicas before considering it sent.

**Q4: In your Redshift migration, how did you handle Distribution Keys and Sort Keys?**

- **Answer**: **Distribution Keys** determine how data is distributed across nodes. I chose keys based on the columns most frequently used in JOIN clauses to minimize data shuffling (network I/O) during queries. **Sort Keys** determine the order of data on disk. I selected columns used in WHERE clauses or range filters. This allows Redshift to skip scanning large blocks of data (Zone Maps), significantly speeding up queries.

**Q5: How do you manage state in a serverless architecture (Lambda)?**

- **Answer**: Lambda is stateless by design. To manage state, I use external services. For workflow orchestration (state transitions), I use **AWS Step Functions**. For data persistence, I use **DynamoDB** (for fast lookups) or **S3** (for payloads). This decouples compute from storage, allowing them to scale independently.

### Category 2: Architecture & Design Questions

**Q6: How would you design a data architecture to unify OT (MES) and IT (ERP) data?**

- **Answer**: I would implement a **Data Mesh** or **Hub-and-Spoke** architecture.
  1.  **Ingestion**: Use IoT Hub/Greengrass for OT data (streaming) and CDC/Batch ETL for ERP data.
  2.  **Raw Layer (Data Lake)**: Store raw data in S3/ADLS (Bronze layer) to preserve history.
  3.  **Integration Layer**: Use Spark/Glue to clean and harmonize data. Here, we map OT tags to IT business context (e.g., linking a sensor ID to a production order in ERP).
  4.  **Serving Layer**: Publish curated data to a Data Warehouse (Redshift/Synapse) for BI and an API layer for applications.
  5.  **Governance**: Implement a Data Catalog to track lineage and definitions across both domains.

**Q7: How do you handle Data Governance and Security in a cloud environment?**

- **Answer**:
  - **Security**: Implement **IAM roles** with least privilege access. Use **Encryption at Rest** (KMS) and **in Transit** (TLS). Implement network isolation using VPCs and PrivateLinks.
  - **Governance**: Use tools like **AWS Glue Data Catalog** or **Azure Purview**. Define data ownership, quality rules, and retention policies. Implement automated data quality checks (e.g., using Great Expectations) in the ETL pipeline to quarantine bad data before it hits the warehouse.

**Q8: What are the trade-offs between a Data Lake and a Data Warehouse? Why use a Lakehouse?**

- **Answer**:
  - **Data Lake**: Low cost storage (S3), handles structured/unstructured data, schema-on-read. _Con_: Can become a "swamp" without governance, slower query performance.
  - **Data Warehouse**: High performance SQL, schema-on-write, ACID compliance. _Con_: Expensive storage, rigid schema, hard to handle unstructured data.
  - **Lakehouse**: Combines the best of both. It adds a transactional layer (like Delta Lake or Iceberg) on top of the Data Lake storage. This gives you ACID transactions, time travel, and schema enforcement on low-cost storage, which is ideal for Schneider's diverse data needs.

### Category 3: Domain-Specific Questions (Energy & Automation)

**Q9: How does data latency impact Industrial Automation scenarios?**

- **Answer**: In industrial automation, latency is critical. For **monitoring**, seconds/minutes might be acceptable. But for **control loops** or **predictive maintenance** (stopping a machine before failure), we need sub-second or millisecond latency. This dictates the architecture: Edge computing (processing data on the device/factory floor) is often necessary to reduce the round-trip time to the cloud.

**Q10: What challenges do you foresee in integrating legacy MES systems?**

- **Answer**: Legacy MES often use proprietary protocols (OPC DA, Modbus) and are not cloud-ready. Data is often siloed and lacks context (just raw tag values). The challenge is to extract this data securely (without disrupting operations) and enrich it with context from the ERP system (e.g., what product was being made when the temperature spiked?).

---

## 4. Behavioral & Cultural Fit

**Q1: Describe a time you had a conflict with a stakeholder regarding a technical decision.**

- **Scenario**: A business stakeholder wants a feature delivered immediately, but you know the "quick fix" will create technical debt and scalability issues later.
- **Strategy**: Focus on **Empathy** and **Data-Driven Persuasion**. Acknowledge their business pressure. Explain the long-term risks (cost, stability) in non-technical terms. Propose a phased approach: a tactical interim solution to unblock them, while committing to the strategic long-term fix in parallel.
- **Example**: "In the Retail MDM project, the business wanted to bypass the validation rules to migrate data faster. I explained that 'dirty data' would break the downstream reporting they relied on. We compromised by loading the data into a 'staging' area first, allowing them to see it, but flagging it as 'unverified' until it passed validation."

**Q2: How do you manage a team under tight deadlines?**

- **Scenario**: The migration deadline is approaching, and you are behind schedule due to unforeseen data complexity.
- **Strategy**: **Prioritization** and **Communication**. Don't just ask the team to work harder. Re-evaluate the scope—what is the MVP? Can we migrate the critical tables first? Communicate the risk early to management. Remove blockers for the team.
- **Example**: "During the Redshift migration, we hit performance issues. I re-prioritized the critical financial reports for the go-live date and deferred the archival data migration. I also jumped in to help code the complex stored procedure conversions to unblock the junior engineers."

---

## 5. Questions to Ask (Reverse Interview)

**Q1 (Business/Strategic)**: "I noticed Schneider's strong focus on 'Digital Transformation & Data Architecture'. How do you see the 'Enterprise Data Platform' evolving over the next 2-3 years to support AI-driven energy efficiency services for your customers?"

**Q2 (Team/Technical)**: "You mentioned a hybrid cloud environment (AWS/Azure). How is the team currently managing the complexity of data governance and lineage across these two clouds? Are you looking to consolidate or build a federated mesh?"

**Q3 (Challenges)**: "What is the biggest technical bottleneck the team is currently facing in unifying the OT and IT data? Is it more about the technical integration or the data quality/standardization?"
