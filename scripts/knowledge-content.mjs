// Sanitized portfolio knowledge base for the RAG chatbot.
// Source: Resume.pdf + portfolio brief. Phone number intentionally excluded.
// Each chunk is embedded independently; keep chunks focused on one topic.

export const CHUNKS = [
  {
    id: "identity",
    section: "About",
    text: `Vijith BG is an AI Lead Engineer based in Bengaluru, India, with 2.5+ years of experience designing, architecting, and delivering enterprise-scale Generative AI products from concept to production. At GSK (GlaxoSmithKline) he leads the development of AI platforms, partnering directly with Finance, Legal, Commercial, and Product stakeholders to transform ambiguous business problems into secure, scalable AI solutions. He works much like a Forward Deployed Engineer: understanding business problems, architecting solutions, and delivering complete AI-powered products end to end.`,
  },
  {
    id: "lifecycle",
    section: "About",
    text: `Vijith's work spans the complete AI product lifecycle: solution architecture, agent design, backend engineering, frontend development, deployment, evaluation, and production operations. He has built multi-agent systems, enterprise RAG platforms, conversational analytics using NL-to-SQL, LLM fine-tuning pipelines, and AI governance frameworks, working with models including GPT, Claude, and Gemini. He has led cross-functional product teams (UX designers, frontend engineers, architects, product managers) to deliver production systems that automate complex enterprise workflows, reducing manual processes from weeks to minutes while maintaining enterprise-grade security, RBAC, Responsible AI compliance, observability, and operational reliability.`,
  },
  {
    id: "competencies",
    section: "Skills",
    text: `Core competencies: Agentic AI & Multi-Agent Systems, GenAI Solution Architecture, RAG & Retrieval, LLM Fine-Tuning, LLMOps & Evaluation, NL-to-SQL & Conversational Analytics, Full-Stack Delivery (Python/FastAPI, React), Enterprise Security & RBAC, Responsible AI & Governance, Technical & Product Leadership, Functional Stakeholder Management, AI-Accelerated Engineering.`,
  },
  {
    id: "skills-genai",
    section: "Skills",
    text: `Generative & Agentic AI skills: Agentic AI, Multi-Agent Orchestration, LangGraph, LangChain, MCP (Model Context Protocol), Tool/Function Calling, Structured Outputs, ReAct, NL-to-SQL, Context Engineering, Prompt Engineering, Guardrails. RAG, Retrieval & LLMs: Hybrid & Agentic RAG, GraphRAG, Semantic Search, Embeddings, Azure AI Search, Vector DBs (Pinecone, FAISS, ChromaDB, pgvector), OpenAI (GPT-4o), Azure OpenAI, Claude, Gemini, Hugging Face.`,
  },
  {
    id: "skills-ops",
    section: "Skills",
    text: `LLMOps & Evaluation skills: LLMOps, MLOps, LLM Evaluation (RAGAS), Playwright & pytest eval/regression suites, Observability with LangSmith, Model Monitoring, CI/CD, MLflow, Cost & Latency Optimization. Fine-Tuning & Machine Learning: LLM Fine-Tuning (SFT, PEFT/LoRA), Small Language Models, PyTorch, Scikit-Learn, XGBoost, NLP, Time-Series Forecasting, Monte Carlo Simulation, PySpark, Pandas, SQL, Neo4j.`,
  },
  {
    id: "skills-fullstack",
    section: "Skills",
    text: `Full-Stack, Cloud & Data skills: Python, FastAPI, Pydantic, REST APIs, Microservices, React and Next.js (Vite), Databricks (Genie + SQL Warehouse), PostgreSQL, SAP, Azure, Docker, GitHub Actions CI/CD, OIDC/JWKS authentication. Vijith uses AI-accelerated development workflows daily, including GitHub Copilot and Claude Code.`,
  },
  {
    id: "gsk-role",
    section: "Experience",
    text: `Since January 2024, Vijith works at GSK (GlaxoSmithKline) as Technical Associate, AI Lead Engineer in Global Functions. He leads design and delivery of enterprise Generative AI products for Finance, Legal, Commercial, and Product stakeholders, owning them from solution architecture through production operations.`,
  },
  {
    id: "viiv",
    section: "Experience",
    text: `ViiV Finance Commentary Tool (GSK) — Product & Lead Engineer. Vijith led design and delivery with a 4-person cross-functional pod (UX, UI, architecture, PM) of a secure, role-aware finance platform that lets Country, Regional, and Global finance leaders self-serve monthly P&L, SG&A, and headcount variance commentary, compressing a ~1-week manual commentary cycle to minutes. He built a production FastAPI backend and React (Vite) frontend with two engines: a Databricks Genie conversational Ask-AI assistant (Sales, SG&A, Headcount spaces) and a Databricks SQL Warehouse path powering dashboards, tiles, and filters. He enforced entitlement-based RBAC (global/regional/country scoping) with guardrails, a Genie row-scope safety-net, OIDC/JWKS auth, and OAuth token auto-refresh with pooled connection recycling. He also added short-TTL query caching, 8-way parallel query execution, and designed the variance-alert and Modify → Validate → Finalize commentary workflow with automated Region/Global roll-ups.`,
  },
  {
    id: "bison",
    section: "Experience",
    text: `BISON — Conversational Financial Analytics, NL-to-SQL (GSK) — Architect & Full-Stack Developer. Vijith built BISON, a conversational NL-to-SQL assistant answering finance questions (turnover, SG&A, plan-vs-actual, YoY/QoQ) over a Databricks warehouse via an 8-phase LangGraph pipeline: follow-up detection, entity extraction/resolution (Azure AI Search), template matching, SQL generation/execution, and answer synthesis with conversation memory. He shipped it full-stack: Next.js/React chat UI with interactive charts and CSV export, FastAPI backend, GPT-4o via Kong gateway, and SSO. He owned production quality with a 30+ scenario Playwright evaluation/regression suite (coreference, query routing, metric fidelity, deterministic outputs), Dockerized GitHub Actions CI/CD to Azure App Service, feature-flagged rollout, and audit logging.`,
  },
  {
    id: "forecasting",
    section: "Experience",
    text: `Vaccine & HIV Demand Forecasting — Agentic Analogue Platform (GSK). Vijith architected an agentic forecasting microservice (FastAPI, GPT-5.5 + Claude Opus 4.8 via Kong gateway, PostgreSQL): an 8-stage LangChain analogue-blend pipeline with executor/reviewer factor scoring, a Claude grounding audit that strips hallucinations, and Monte-Carlo-banded uptake curves, producing probabilistic Worst/Base/Best launch forecasts across Vaccines and HIV brands. It lets analysts generate a defensible brand demand forecast on demand in minutes instead of a weeks-long manual modelling exercise. Hardened with per-stage deterministic fallbacks (auditable output during model-gateway outages), async jobs with live progress streaming, and a React dashboard.`,
  },
  {
    id: "icf",
    section: "Experience",
    text: `Legal Document Intelligence — ICF (GSK). Vijith built a GenAI document-intelligence tool (two FastAPI microservices) that verifies a site-level Informed Consent Form against the GSK master template: parsing PDFs with Azure AI Document Intelligence, aligning sections via Azure OpenAI embeddings + cosine similarity indexed in Azure AI Search, and using GPT-4o via Kong gateway to flag missing clauses and deviations from GSK legal procedures — saving ~6 hours of review per document and compressing a cycle that ran up to two weeks; adopted by legal teams. Production engineering included Celery async processing for long-running LLM jobs with task-status/result APIs, a reviewer comparison view and PDF viewer with highlighted deviations, Azure Blob storage, Key Vault secrets, managed identity, Docker deployment, and LangSmith tracing.`,
  },
  {
    id: "governance",
    section: "Experience",
    text: `Responsible AI Governance (GSK). Vijith reviewed 83 AI use cases across two quarters (HR, Procurement, Legal, Finance) and flagged ~40–45 for remediation across high/medium risk. He built governance dashboards, managed the AI registry, presented to senior Finance and Legal stakeholders, and co-founded the Global Functions Responsible AI Forum, which standardized the enterprise AI-review methodology.`,
  },
  {
    id: "mmm",
    section: "Experience",
    text: `Marketing Mix Modelling, Japan (GSK). Vijith built a decision-tree account-classification model (with embedding-based features explored) segmenting the market's accounts into 8 priority categories at 95% validation accuracy — automating a manual ~6-hour classification into ~2 hours and giving the marketing team a reusable pipeline to target high-value accounts.`,
  },
  {
    id: "knowledge-graphs",
    section: "Projects",
    text: `Knowledge Graphs for Open-Source Software Ecosystems (Neo4j, Python, GraphML, FastAPI). Vijith modeled GitHub open-source ecosystems (repositories, contributors, commits) as a knowledge graph and applied PageRank, centrality, and community detection to surface influential contributors and collaboration clusters. This research was published at IEEE I2CT 2024, DOI: 10.1109/I2CT61223.2024.10544334 — Vijith is an IEEE-published researcher.`,
  },
  {
    id: "fine-tuning-project",
    section: "Projects",
    text: `Domain-Specialized LLM Fine-Tuning: Breast-Cancer Q&A (PyTorch, Hugging Face, Qwen2.5-1.5B). Vijith built an end-to-end supervised fine-tuning pipeline (data prep through checkpointing), achieving +30% domain-specific response accuracy over the base model, and documented fine-tuning vs. RAG trade-offs.`,
  },
  {
    id: "education",
    section: "Background",
    text: `Education: B.Tech in Computer Science & Engineering from PES University, Bengaluru (2020–2024), CGPA 8.46. Certification: Databricks Certified Generative AI Engineer Associate, Credential ID 145101786, valid May 2025 – May 2027.`,
  },
  {
    id: "awards",
    section: "Background",
    text: `Awards & recognition at GSK: 4× Silver Award — for Responsible AI governance leadership; Finance Analytics accuracy & UI; reliability & ownership on the ICF legal-intelligence project; and 1st place in the Q4 GP&T Hackathon. Bronze Award for proactive risk identification & delivery. Global Recognition Award, GSK (2024).`,
  },
  {
    id: "personal",
    section: "Personal",
    text: `Beyond engineering, Vijith is a motorcycle rider who loves mountain adventures, long road trips, and exploring nature. Riding through the mountains is where he finds clarity — the same patience and focus he brings to debugging distributed AI systems. His ideal weekend is a long ride to the hills, far from the city. These journeys shape his personal brand: the calm of nature balancing the intensity of engineering.`,
  },
  {
    id: "contact",
    section: "Contact",
    text: `Contact Vijith BG: email vijithkrish24@gmail.com, LinkedIn linkedin.com/in/vijith-bg, GitHub github.com/crypto-vbg. He is based in Bengaluru, India. (Phone number is not shared through this chatbot.)`,
  },
  {
    id: "this-site",
    section: "Portfolio",
    text: `This portfolio website itself is one of Vijith's projects: a React (Vite) single-page app with cinematic Framer Motion animations, deployed on Vercel. The chatbot you are talking to is a Retrieval-Augmented Generation (RAG) assistant Vijith built: his resume and portfolio content are sanitized, chunked, and embedded; user queries retrieve the most relevant context via cosine similarity; and Google Gemini generates grounded answers through a serverless edge function with rate limiting and a fair request queue.`,
  },
];
