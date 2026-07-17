export const ROLES = [
  "AI Lead Engineer",
  "Generative AI Developer",
  "Agentic AI Builder",
  "End-to-End Full-Stack AI Engineer",
  "Forward Deployed Engineer at heart",
];

export const STATS = [
  { value: "2.5+", label: "Years building enterprise GenAI" },
  { value: "6+", label: "Production AI systems shipped" },
  { value: "83", label: "AI use cases reviewed for Responsible AI" },
  { value: "IEEE", label: "Published researcher (I2CT 2024)" },
];

export const IDENTITY_CARDS = [
  {
    icon: "🧠",
    title: "AI Engineer, end to end",
    desc: "Solution architecture → agent design → backend → frontend → deployment → evaluation → production ops.",
  },
  {
    icon: "🤝",
    title: "Forward-deployed mindset",
    desc: "Partners directly with Finance, Legal, Commercial & Product stakeholders to turn ambiguous problems into shipped AI products.",
  },
  {
    icon: "🛡️",
    title: "Responsible AI leader",
    desc: "Co-founded GSK's Global Functions Responsible AI Forum; enterprise security, RBAC and governance by default.",
  },
  {
    icon: "⚡",
    title: "AI-accelerated engineering",
    desc: "Builds with GitHub Copilot and Claude Code daily — shipping production systems at unusual speed without cutting corners.",
  },
];

export const EXPERIENCE = [
  {
    tag: "Product & Lead Engineer",
    title: "ViiV Finance Commentary Tool",
    impact: "~1-week manual commentary cycle → minutes",
    desc: "Secure, role-aware finance platform where Country, Regional and Global finance leaders self-serve monthly P&L, SG&A and headcount variance commentary. Databricks Genie Ask-AI assistant + SQL Warehouse engines, entitlement-based RBAC with guardrails, OIDC/JWKS auth, 8-way parallel query execution, and a Modify → Validate → Finalize workflow with automated roll-ups.",
    chips: ["FastAPI", "React (Vite)", "Databricks Genie", "RBAC", "OIDC/JWKS", "Guardrails"],
    viz: "pipeline",
  },
  {
    tag: "Architect & Full-Stack Developer",
    title: "BISON — Conversational Financial Analytics",
    impact: "Finance answers without an analyst, via NL-to-SQL",
    desc: "Conversational NL-to-SQL assistant over a Databricks warehouse: an 8-phase LangGraph pipeline covering follow-up detection, entity resolution (Azure AI Search), template matching, SQL generation and answer synthesis with memory. Shipped full-stack with a Next.js chat UI, charts, CSV export, GPT-4o via Kong, SSO, a 30+ scenario Playwright eval suite and Dockerized CI/CD.",
    chips: ["LangGraph", "NL-to-SQL", "GPT-4o", "Next.js", "Playwright evals", "Azure"],
    viz: "graph",
  },
  {
    tag: "Architect",
    title: "Vaccine & HIV Demand Forecasting",
    impact: "Weeks-long modelling exercise → on-demand minutes",
    desc: "Agentic analogue-forecasting microservice: an 8-stage LangChain pipeline with executor/reviewer factor scoring, a Claude grounding audit that strips hallucinations, and Monte-Carlo-banded uptake curves producing Worst/Base/Best launch forecasts. Per-stage deterministic fallbacks, async jobs with live progress streaming, React dashboard.",
    chips: ["LangChain", "GPT-5.5", "Claude Opus 4.8", "Monte Carlo", "PostgreSQL", "FastAPI"],
    viz: "curves",
  },
  {
    tag: "Builder",
    title: "Legal Document Intelligence (ICF)",
    impact: "~6 hours of legal review saved per document",
    desc: "GenAI document intelligence verifying site-level Informed Consent Forms against the GSK master template — Azure AI Document Intelligence parsing, embedding + cosine-similarity section alignment in Azure AI Search, GPT-4o deviation flagging. Celery async jobs, reviewer comparison view with highlighted deviations, Key Vault, LangSmith tracing. Adopted by legal teams.",
    chips: ["Azure OpenAI", "Embeddings", "Celery", "Azure AI Search", "LangSmith", "Docker"],
    viz: "docs",
  },
  {
    tag: "Governance Lead",
    title: "Responsible AI Governance",
    impact: "83 AI use cases reviewed, ~40–45 remediated",
    desc: "Reviewed AI use cases across HR, Procurement, Legal and Finance; built governance dashboards, managed the AI registry, presented to senior stakeholders, and co-founded the Global Functions Responsible AI Forum that standardized GSK's enterprise AI-review methodology.",
    chips: ["AI Governance", "Risk Review", "Dashboards", "Stakeholder Management"],
    viz: "shield",
  },
  {
    tag: "ML Engineer",
    title: "Marketing Mix Modelling (Japan)",
    impact: "95% validation accuracy, ~6h task → ~2h",
    desc: "Decision-tree account-classification model segmenting the Japanese market into 8 priority categories, giving the marketing team a reusable pipeline for targeting high-value accounts.",
    chips: ["Scikit-Learn", "Decision Trees", "Embeddings", "Pandas"],
    viz: "segments",
  },
];

export const PROJECTS = [
  {
    tag: "IEEE I2CT 2024 · Published Research",
    title: "Knowledge Graphs for Open-Source Ecosystems",
    desc: "GitHub ecosystems (repos, contributors, commits) modeled as a knowledge graph — PageRank, centrality and community detection surface influential contributors and collaboration clusters.",
    chips: ["Neo4j", "Python", "GraphML", "FastAPI"],
    link: "https://doi.org/10.1109/I2CT61223.2024.10544334",
    linkLabel: "Read the paper →",
    viz: "constellation",
  },
  {
    tag: "LLM Fine-Tuning",
    title: "Domain-Specialized LLM: Breast-Cancer Q&A",
    desc: "End-to-end supervised fine-tuning pipeline on Qwen2.5-1.5B — data prep through checkpointing — achieving +30% domain accuracy over base, with documented fine-tuning vs. RAG trade-offs.",
    chips: ["PyTorch", "Hugging Face", "SFT", "PEFT/LoRA"],
    viz: "loss",
  },
  {
    tag: "This Website",
    title: "Portfolio + RAG Chatbot",
    desc: "The site you're on: React + Framer Motion frontend, and a serverless RAG chatbot grounded in my resume — sanitized, chunked, embedded, retrieved by cosine similarity, answered by Gemini with streaming, rate limiting and a fair queue.",
    chips: ["React (Vite)", "Gemini", "RAG", "Vercel Edge", "SSE"],
    link: "https://github.com/crypto-vbg/vijith.github.io",
    linkLabel: "View source →",
    viz: "chat",
  },
  {
    tag: "Open Source & Profile",
    title: "More on GitHub",
    desc: "Experiments in agentic workflows, retrieval, evaluation harnesses and AI-accelerated development live on my GitHub — along with the code behind these projects.",
    chips: ["Agents", "RAG", "Evals", "Python"],
    link: "https://github.com/crypto-vbg",
    linkLabel: "github.com/crypto-vbg →",
    viz: "commits",
  },
];

export const SKILL_GROUPS = [
  {
    title: "Generative & Agentic AI",
    hint: "Designing systems where LLMs reason, plan and act",
    chips: ["Agentic AI", "Multi-Agent Orchestration", "LangGraph", "LangChain", "MCP", "Tool / Function Calling", "Structured Outputs", "ReAct", "NL-to-SQL", "Context Engineering", "Prompt Engineering", "Guardrails"],
  },
  {
    title: "RAG, Retrieval & LLMs",
    hint: "Grounding models in the right knowledge",
    chips: ["Hybrid & Agentic RAG", "GraphRAG", "Semantic Search", "Embeddings", "Azure AI Search", "Pinecone", "FAISS", "ChromaDB", "pgvector", "GPT-4o", "Azure OpenAI", "Claude", "Gemini", "Hugging Face"],
  },
  {
    title: "LLMOps & Evaluation",
    hint: "Keeping AI systems honest in production",
    chips: ["LLMOps", "MLOps", "RAGAS", "Playwright / pytest evals", "LangSmith", "Model Monitoring", "CI/CD", "MLflow", "Cost & Latency Optimization"],
  },
  {
    title: "Fine-Tuning & ML",
    hint: "When prompting isn't enough",
    chips: ["SFT", "PEFT / LoRA", "Small Language Models", "PyTorch", "Scikit-Learn", "XGBoost", "NLP", "Time-Series Forecasting", "Monte Carlo Simulation", "PySpark", "Pandas", "SQL", "Neo4j"],
  },
  {
    title: "Full-Stack, Cloud & Data",
    hint: "Shipping the whole product, not just the model",
    chips: ["Python", "FastAPI", "Pydantic", "REST APIs", "Microservices", "React / Next.js (Vite)", "Databricks", "PostgreSQL", "Azure", "Docker", "GitHub Actions", "OIDC/JWKS"],
  },
  {
    title: "AI-Accelerated Engineering",
    hint: "Building faster with AI in the loop",
    chips: ["GitHub Copilot", "Claude Code", "Agentic Workflows", "Eval-Driven Development", "Rapid Prototyping"],
  },
];

export const INTERESTS = [
  { emoji: "🏍️", title: "Motorcycle Riding", desc: "Where the mind clears and ideas arrive." },
  { emoji: "⛰️", title: "Mountain Adventures", desc: "Chasing hairpin bends and high-altitude views." },
  { emoji: "🛣️", title: "Long Road Trips", desc: "The longer the route, the better the story." },
  { emoji: "🌲", title: "Exploring Nature", desc: "Balance for a life spent among machines." },
];

export const LINKS = {
  email: "vijithkrish24@gmail.com",
  linkedin: "https://linkedin.com/in/vijith-bg",
  github: "https://github.com/crypto-vbg",
  paper: "https://doi.org/10.1109/I2CT61223.2024.10544334",
};
