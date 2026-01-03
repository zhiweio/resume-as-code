# Wang Zhiwei

- Email: nocoding188@gmail.com
- Phone: +86 199 8888 8888
- URL: https://zhiweio.me

Profiles:

- GitHub: [@zhiweio](https://github.com/zhiweio)

## Basics

- Senior Data Engineer with 6+ years of experience specializing in distributed big data systems and cloud-native architectures, well-positioned to support high-scale Automated Driving (AD) R&D environments.
- Proficient in AWS and Azure ecosystems, utilizing Spark, Python, and Kubernetes to design robust backend applications and CI/CD workflows for enterprise-grade data processing.
- Proven ability to lead technical initiatives and define big data strategies, bridging the gap between complex business requirements and efficient, scalable infrastructure solutions.

## Education

### Suzhou University of Science and Technology

Bachelor, Computer Science and Technology, Sep 2015–Jul 2019

Summary:

- Awarded Third Prize in the 4th National University Cloud Computing Application Innovation Competition (2018).
- Project: "Implementation of Large-scale Distributed Functional Dependency Mining Algorithm Based on Spark".

## Work

### Senior Data Engineer

Cognizant Technology Solutions Shanghai Co. Ltd., Dec 2022–Present

URL: https://www.cognizant.com

Keywords: AWS (Glue, DMS), Databricks & Spark, Python, Cloud Migration, Data Architecture

Summary:

- Led the migration of a 10TB+ legacy data warehouse to AWS, utilizing AWS Glue and DMS to modernize infrastructure, resulting in a 40% reduction in query latency and 25% lower maintenance costs.
- Architected a unified Customer Data Platform (CDP) integrating 8+ disparate systems (Salesforce, Databricks) using Spark and Python, processing billions of records daily to enable a 360-degree customer view.
- Optimized core data processing workflows in Databricks by implementing advanced partitioning and caching strategies, reducing daily processing time from 6 hours to 2.5 hours (58% improvement).
- Designed a Master Data Management (MDM) solution on Azure Data Lake to resolve critical retail data inconsistencies, reducing discrepancies by 95% and streamlining operations.

### Data Engineer

Patsnap Information Technology (Suzhou) Co. Ltd., Jun 2021–Nov 2022

URL: https://www.patsnap.com

Keywords: AWS (S3, Athena, EMR), Apache Spark & Flink, Kafka, CI/CD (GitLab), TiDB

Summary:

- Architected a scalable data lake solution on AWS S3 and Athena for 1.8 billion global patent records, orchestrating Spark jobs via DolphinScheduler to support TB-scale financial analysis.
- Developed a custom "Spark Diff" engine to synchronize 500M+ daily records to TiDB, achieving minute-level processing for complex nested structures and ensuring efficient incremental updates.
- Built a real-time wide table system using Flink, Kafka, and TiCDC, patching open-source components to enable sub-second data ingestion for enterprise business insights.
- Designed "Guardian," a continuous delivery tool integrated with GitLab CI/CD, automating Docker deployments and reducing delivery costs for 10+ localized banking projects.

### Data Engineer

Intsig Information Co., Ltd., Jun 2019–Jun 2021

URL: https://www.intsig.com

Keywords: Real-time Streaming, Kafka & Redis, Python ETL, DevOps, Data Modeling

Summary:

- Engineered a high-throughput real-time data pipeline using Redis and Kafka, processing over 100 billion data points to ensure sub-second freshness for a platform with 230M+ entities.
- Architected a Python-based ETL optimization library that standardized incremental update logic across 1000+ dimensions, reducing boilerplate code by 90%.
- Led the DevOps transformation by migrating from SVN to GitLab and implementing CI/CD pipelines, significantly improving team development efficiency and deployment speed.

## Skills

- Cloud & Infrastructure: Expert, Keywords: AWS (EMR, Glue, Redshift), Azure (Synapse, Data Lake), Kubernetes & Docker, Terraform (IaC), CI/CD (GitLab, Jenkins)
- Big Data & Streaming: Expert, Keywords: Apache Spark & Flink, Kafka Event Streaming, Hadoop Ecosystem (Hive), Databricks Platform
- Data Architecture & Engineering: Advanced, Keywords: Data Warehouse & Lakehouse, ETL/ELT Pipeline Design, Serverless Data Processing, Airflow Orchestration
- Programming & Languages: Advanced, Keywords: Python & SQL, Java & Scala, Shell Scripting
- Database Systems: Advanced, Keywords: PostgreSQL & MySQL, NoSQL (MongoDB, Redis), TiDB (NewSQL), SQL Server

## Certificates

### AWS Certified Data Analytics – Specialty

AWS, Jan 2024

### AWS Certified Developer - Associate

AWS, Sep 2024

### Microsoft Certified Azure Data Engineer Associate

Microsoft, Jun 2024

### Databricks Certified Data Engineer Associate

Databricks, Mar 2023

### PingCAP Certified TiDB Professional

PingCAP, Mar 2022

## Projects

### Bayer Customer Data Platform (CDP)

Cloud-native data lakehouse unifying customer data across the enterprise., Dec 2022–Present

Keywords: AWS (Glue, Lambda, Redshift), Terraform, GitHub Actions, Data Lakehouse

Summary:

- Architected a serverless ETL architecture using AWS Glue and Lambda, optimizing compute costs by 40% while maintaining strict SLAs for data freshness.
- Established a robust Infrastructure as Code (IaC) foundation using Terraform and GitHub Actions, reducing deployment time by 60% and ensuring 99.9% infrastructure uptime.
- Designed an event-driven orchestration workflow with AWS Step Functions and EventBridge to manage complex dependencies across MySQL, SQL Server, and PostgreSQL.

### Enterprise Data Warehouse Migration to AWS

Strategic migration of a 10TB+ legacy warehouse to Amazon Redshift., Nov 2022–May 2022

Keywords: Amazon Redshift, Python, Database Migration, Performance Tuning

Summary:

- Developed a custom Python migration engine (`dm4`) using AST parsing (`sqlglot`) to achieve 99% automated DDL translation accuracy for over 2,000 tables.
- Engineered a high-throughput stream processing pipeline using UNIX named pipes and `bcp`, accelerating 10TB data transfer by 300% compared to traditional staging.
- Designed performant Redshift schemas with optimal Distribution and Sort Keys, resulting in a 5x improvement in complex analytical query performance.

### Retail Master Data Management Platform

Centralized retail data governance system on Microsoft Power Platform., May 2025–Dec 2025

Keywords: Azure Cosmos DB, Power Platform, Data Governance, Cross-Cloud Integration

Summary:

- Designed a billion-scale storage layer using Azure Cosmos DB, ensuring sub-second response times for current state queries while maintaining full historical versioning.
- Implemented a cross-cloud data synchronization bridge between Azure Dataverse and AWS analytical warehouses using Synapse Link and custom adapters.
