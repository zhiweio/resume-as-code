# Interview Preparation Guide: Wang Zhiwei for Advanced Specialist Big Data Engineer AD at BMW China

## 1. Personal Introduction Strategy

**Script Strategy**:

- **Tone**: Professional, confident, and enthusiastic about the intersection of Big Data and Automated Driving.
- **Structure**: Professional Identity -> Core Expertise (Business & Technical) -> Strategic Alignment with BMW China.

**Draft Script**:

"Good morning/afternoon. My name is **Wang Zhiwei**, and I am a **Senior Data Engineer** with over **6 years of experience** specializing in designing and optimizing distributed big data systems and cloud-native architectures.

Throughout my career, I have focused on building enterprise-grade data platforms that handle massive scale and complexity.
Technically, my core expertise lies in **Cloud Ecosystems (AWS and Azure)** and the **Big Data Stack (Spark, Flink, Kafka)**. I have a strong background in **Kubernetes** for container orchestration and **Terraform** for Infrastructure as Code, ensuring that the systems I build are not only performant but also scalable and maintainable.

From a business perspective, I have successfully led high-impact projects such as the **Bayer Customer Data Platform**, where I architected a serverless data lakehouse, and a massive **10TB+ Data Warehouse Migration**, where I built custom tools to automate 99% of the transition. My experience spans from real-time streaming for financial analysis to batch processing for retail insights, giving me a versatile approach to solving data challenges.

I am particularly excited about this **Advanced Specialist Big Data Engineer** role at **BMW China** because it sits right at the cutting edge of **Automated Driving (AD)** technology. I understand that BMW is heavily investing in localizing AD features for the Chinese market, which requires robust, high-throughput backend systems to process sensor data and manage complex requirements. My experience in **managing cross-cloud integrations**, **optimizing query performance by 5x**, and **leading technical teams** directly aligns with your need for someone who can define Big Data Architecture and steer development teams. I am eager to bring my expertise in distributed systems to help BMW build the next generation of its AD data platform."

---

## 2. Project Deep Dives

### Project 1: Bayer Customer Data Platform (CDP)

**STAR Analysis**

- **Situation**: Bayer needed a unified view of customer data which was siloed across 8+ disparate systems (Salesforce, Databricks, etc.), leading to inefficient operations and a lack of actionable insights. The existing infrastructure was costly and slow.
- **Task**: Architect and build a cloud-native Data Lakehouse on AWS to unify this data, ensure strict SLAs for data freshness, and reduce operational costs.
- **Action**:
  - **Architecture**: I designed a **Serverless Data Lakehouse** architecture. I chose **AWS Glue** for ETL to avoid managing server instances and **AWS Lambda** for event-driven processing.
  - **Depth (Implementation)**:
    - Implemented **Terraform** for IaC to provision the entire stack, which allowed us to replicate environments easily and reduced deployment time by 60%.
    - Used **AWS Step Functions** to orchestrate complex dependencies between MySQL, SQL Server, and PostgreSQL sources.
    - Optimized Glue jobs by tuning worker types and enabling job bookmarks to process only incremental data.
  - **Alignment**: This demonstrates my ability to design **cloud-native systems** on **AWS**, a key requirement for the BMW role. It also shows my experience with **CI/CD** (GitHub Actions) and cost optimization.
- **Result**: The new architecture **reduced compute costs by 40%** while meeting strict data freshness SLAs. Infrastructure reliability hit **99.9% uptime** due to the robust IaC foundation.

### Project 2: Enterprise Data Warehouse Migration to AWS

**STAR Analysis**

- **Situation**: The company had a legacy 10TB+ data warehouse that was becoming expensive and hard to scale. They decided to migrate to **Amazon Redshift**. The challenge was the sheer volume of data and the complexity of over 2,000 tables with intricate DDLs.
- **Task**: Lead the migration strategy, ensuring data integrity, minimal downtime, and performance improvement post-migration.
- **Action**:
  - **Breadth**: Designed a lift-and-shift followed by optimization strategy.
  - **Depth (Implementation)**:
    - **Automation**: I developed a custom Python tool (`dm4`) using **AST parsing (`sqlglot`)** to automatically translate DDLs from the legacy dialect to Redshift SQL, achieving 99% accuracy. This saved weeks of manual effort.
    - **Data Transfer**: Engineered a high-throughput pipeline using **UNIX named pipes** and `bcp` to stream data directly to S3/Redshift, bypassing local disk I/O bottlenecks. This accelerated transfer by **300%**.
    - **Optimization**: Post-migration, I analyzed query patterns to define optimal **Distribution Keys (Key vs. Even)** and **Sort Keys**, which is crucial for Redshift performance.
  - **Alignment**: Shows deep **Python** coding skills, internal understanding of **Database Internals**, and ability to handle **Large Scale Data Migration**, relevant for managing AD data lifecycles.
- **Result**: Successfully migrated 10TB+ data. The optimizations resulted in a **5x improvement** in complex analytical query performance.

### Project 3: Retail Master Data Management Platform

**STAR Analysis**

- **Situation**: Retail data was inconsistent across systems, causing operational discrepancies. The business needed a centralized governance system.
- **Task**: Design a Master Data Management (MDM) solution that could handle high-concurrency reads and writes while maintaining historical versioning.
- **Action**:
  - **Architecture**: Built a solution on **Azure Cosmos DB** for the storage layer due to its low latency and global distribution capabilities.
  - **Depth**:
    - Implemented a **Cross-Cloud Bridge** using **Synapse Link** to sync data between Azure Dataverse (operational) and AWS (analytical).
    - Designed the document model in Cosmos DB to support efficient querying by partition keys, ensuring sub-second response times.
  - **Alignment**: Demonstrates **Cross-Cloud experience (Azure + AWS)** and **NoSQL (Cosmos DB)** expertise, which is valuable as BMW operates in a multi-cloud environment.
- **Result**: Reduced data discrepancies by **95%** and streamlined retail operations.

---

## 3. Technical Q&A Bank

### Category 1: Specific Technical Questions

#### **Apache Spark & Distributed Systems**

- **Q: How does Spark handle memory management, and what is the difference between On-Heap and Off-Heap memory?**
  - **A**: Spark uses a unified memory manager for execution and storage. **On-Heap** is JVM heap memory, subject to Garbage Collection (GC). **Off-Heap** (managed by `sun.misc.Unsafe`) is outside JVM GC, which reduces GC pauses but requires manual management. For AD data processing (heavy serialization), Off-Heap is often preferred to improve stability.
- **Q: Explain the Catalyst Optimizer in Spark SQL.**
  - **A**: Catalyst is an extensible query optimizer. It goes through 4 phases: Analysis (resolving references), Logical Optimization (predicate pushdown, constant folding), Physical Planning (selecting join strategies like Broadcast vs. SortMerge), and Code Generation (generating Java bytecode for RDDs).
- **Q: What are the common Join strategies in Spark? When would you use Broadcast Hash Join?**
  - **A**: Common strategies: Broadcast Hash Join, Shuffle Hash Join, Sort Merge Join. **Broadcast Hash Join** is used when one table is small enough (default <10MB) to fit in memory. It broadcasts the small table to all executors, avoiding a massive shuffle of the large table.

#### **Kubernetes (K8s) & Cloud**

- **Q: How do you expose a service in Kubernetes? What is the difference between ClusterIP, NodePort, and LoadBalancer?**
  - **A**: **ClusterIP** exposes the service on an internal IP (default). **NodePort** exposes it on a static port on each Node's IP. **LoadBalancer** creates an external load balancer (like AWS ELB) to route traffic to the service. For an AD platform, internal microservices likely use ClusterIP, while public APIs use Ingress/LoadBalancer.
- **Q: Explain the concept of a Pod's lifecycle and the role of the Kubelet.**
  - **A**: Pods are ephemeral. States: Pending, Running, Succeeded, Failed. The **Kubelet** runs on each node, ensuring containers defined in the PodSpec are running and healthy. It communicates with the control plane (API Server).

#### **Kafka & Streaming**

- **Q: How does Kafka guarantee message ordering?**
  - **A**: Kafka guarantees ordering **only within a partition**, not across the entire topic. To ensure total ordering, you would need a single partition (sacrificing scalability) or ensure related events (e.g., same sensor ID) go to the same partition using a consistent partition key.
- **Q: What is "Zero-Copy" in Kafka and why is it important for high throughput?**
  - **A**: Zero-Copy (via `sendfile` syscall) allows data to be copied directly from disk buffer to network buffer in the OS kernel, bypassing the application (JVM) memory. This reduces context switches and CPU usage, enabling Kafka to saturate network bandwidth.

### Category 2: Architecture/Design Questions

- **Q: Design a data ingestion system for Automated Driving logs (TB/day).**
  - **A**:
    - **Ingestion**: Vehicles upload to **AWS S3** / **AliCloud OSS** (Object Storage) via signed URLs for high throughput.
    - **Queuing**: Metadata events sent to **Kafka** to trigger processing.
    - **Processing**: **Spark/Flink** on **EKS/ACK** reads from S3, performs validation/ETL (e.g., extracting sensor frames).
    - **Storage**: Hot data (metadata) to **Elasticsearch** for search; Cold data (raw logs) stays in S3 (Glacier for archiving).
    - **Orchestration**: **Airflow** to manage batch jobs.
- **Q: How do you handle Data Quality in a distributed pipeline?**
  - **A**: Implement **Circuit Breakers** (stop pipeline if error rate > threshold). Use **Dead Letter Queues (DLQ)** for bad records. Integrate tools like **Great Expectations** or **Deequ** within Spark jobs to validate schema and statistics (e.g., null checks, value ranges) before writing to production tables.

### Category 3: Domain-Specific Questions (Automated Driving)

- **Q: How does the "China Data Platform Strategy" impact architecture decisions?**
  - **A**: Data compliance (GDPR/PIPL) is critical. Mapping data and sensitive geo-locations must stay in China. Cross-border data transfer is strictly regulated. The architecture must support **Local Processing** (in China cloud regions) and perhaps only share aggregated/anonymized insights globally.
- **Q: Why are NoSQL databases (like MongoDB/Elasticsearch) often used in AD?**
  - **A**: AD data is often semi-structured (JSON logs, sensor configs) or requires complex geospatial queries. **MongoDB** handles flexible schemas well. **Elasticsearch** is essential for indexing vast amounts of log data for quick debugging and retrieval by developers.

---

## 4. Behavioral & Cultural Fit

### Scenario 1: Conflict with Product Owner/Stakeholder

- **Question**: "Tell me about a time you disagreed with a Product Owner about a technical requirement or timeline."
- **Suggested Answer**:
  - **Context**: In the Bayer CDP project, the PO wanted a real-time dashboard immediately, but the data quality was not yet stable.
  - **Action**: I explained the risk: "Fast data is useless if it's wrong." I proposed a phased approach: first release a T+1 batch version with high accuracy, then iterate to real-time. I used metrics (data discrepancy rates) to back up my argument.
  - **Result**: The PO agreed. We avoided a reputation-damaging release, and the eventual real-time rollout was smooth.
  - **Trait**: Shows **Stakeholder Management** and prioritizing **Quality**.

### Scenario 2: Leading a Team under Pressure

- **Question**: "Describe a situation where your team faced a tight deadline and how you managed it."
- **Suggested Answer**:
  - **Context**: During the Warehouse Migration, we hit an unexpected bottleneck with the legacy system's export speed 2 weeks before the deadline.
  - **Action**: As the lead, I first calmed the team. Then, I re-evaluated our approach. I identified that we could parallelize the export using the `bcp` tool I mentioned. I re-assigned tasks: one engineer focused on the script, another on testing. I took on the role of unblocking them and communicating status to management.
  - **Result**: We delivered on time. The team felt supported, not burnt out.
  - **Trait**: Shows **Technical Leadership** and **Problem Solving**.

---

## 5. Questions to Ask

1.  **Strategic (Business)**: "I noticed the JD emphasizes the 'China data platform strategy'. How does the roadmap for the China platform differ from the global BMW stack, and what are the biggest challenges in aligning local compliance (PIPL) with global engineering standards?"
2.  **Technical (Architecture)**: "For the AD platform, are you currently leaning more towards a centralized Data Lakehouse approach (e.g., Databricks/Iceberg) or a more decoupled microservices architecture for handling the petabyte-scale sensor data? What drove that decision?"
3.  **Team (Culture)**: "The role mentions steering both internal teams and external partners. How is the collaboration structured between the BMW core engineering team and the external tech partners in China? How do you ensure technical quality across these distributed teams?"
