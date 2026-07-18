// ============================================================================
//  SITE CONFIG — edit THIS file to change any text or data on the website.
//  Components only render what's here; you shouldn't need to touch them.
//
//  Conventions:
//  • In any "title" field, text wrapped in *asterisks* renders with the
//    gradient accent (e.g. "not just *applications*").
//  • Paragraph fields support light Markdown: **bold**, links, bullets.
//  • The CHATBOT'S knowledge lives in api/_lib/knowledge.js — edit it and
//    redeploy; no build step needed.
// ============================================================================

export const SITE = {
  // ---- identity ----
  name: "Vijith BG",
  metaTitle: "Vijith BG — AI Lead Engineer",
  location: "Bengaluru, India",

  // ---- links (email intentionally omitted — LinkedIn is the contact channel) ----
  links: {
    linkedin: "https://linkedin.com/in/vijith-bg",
    github: "https://github.com/crypto-vbg",
    paper: "https://doi.org/10.1109/I2CT61223.2024.10544334",
  },

  // ---- navigation ----
  nav: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Beyond Code", href: "#journey" },
    { label: "Contact", href: "#contact" },
  ],

  // ---- hero ----
  hero: {
    // Full-bleed cinematic backdrop (the film this whole page is graded to match).
    // Phones and reduced-motion get the lightweight poster frame instead.
    film: {
      src: "/media/night-ride.mp4",
      poster: "/media/night-ride-poster.jpg",
    },
    badge: "Building production AI at GSK · Bengaluru, India",
    titleFirst: "Vijith",
    titleAccent: "BG",
    roles: [
      "AI Lead Engineer",
      "Generative AI Developer",
      "Agentic AI Builder",
      "End-to-End Full-Stack AI Engineer",
      "Forward Deployed Engineer at heart",
    ],
    description:
      "I don't just build software I build **intelligent, scalable AI systems**. From ambiguous business problem to production: multi-agent systems, enterprise RAG, NL-to-SQL analytics and LLM fine-tuning, shipped end to end with **security, evals and governance** built in.",
    ctaSecondary: "Explore my work ↓",
    stats: [
      { value: "2.5+", label: "Years building enterprise GenAI" },
      { value: "6+", label: "Production AI systems shipped" },
      { value: "83", label: "AI use cases reviewed for Responsible AI" },
      { value: "IEEE", label: "Published researcher (I2CT 2024)" },
    ],
  },

  // ---- about ----
  about: {
    kicker: "Scene 01 · Who I am",
    title: "From ambiguous problem to *production AI*",
    paragraphs: [
      "I'm an AI Lead Engineer at GSK with 2.5+ years designing, architecting and delivering enterprise-scale Generative AI products from concept to production.",
      "My work spans the complete AI product lifecycle: solution architecture, agent design, backend and frontend engineering, deployment, evaluation and production operations. I've built multi-agent systems, enterprise RAG platforms, conversational NL-to-SQL analytics, LLM fine-tuning pipelines and AI governance frameworks working with GPT, Claude and Gemini.",
      "Beyond engineering, I lead cross-functional pods of UX designers, engineers, architects and product managers, partnering directly with Finance, Legal and Commercial stakeholders. The result: enterprise workflows that took weeks now run in minutes with security, RBAC, Responsible AI compliance and observability built in from day one.",
      "Databricks Certified Generative AI Engineer · IEEE-published researcher · 4× Silver + Bronze awards at GSK.",
    ],
    photo: {
      src: "/media/profile.jpg",
      alt: "Vijith in the mountains, pines and hazy ranges behind",
      caption: "on location · where the ideas arrive",
    },
    cards: [
      {
        icon: "network",
        title: "AI Engineer, end to end",
        desc: "Solution architecture → agent design → backend → frontend → deployment → evaluation → production ops.",
      },
      {
        icon: "partners",
        title: "Forward-deployed mindset",
        desc: "Partners directly with Finance, Legal, Commercial & Product stakeholders to turn ambiguous problems into shipped AI products.",
      },
      {
        icon: "shield",
        title: "Responsible AI leader",
        desc: "Co-founded GSK's Global Functions Responsible AI Forum; enterprise security, RBAC and governance by default.",
      },
      {
        icon: "bolt",
        title: "AI-accelerated engineering",
        desc: "Builds with GitHub Copilot and Claude Code daily shipping production systems at unusual speed without cutting corners.",
      },
    ],
  },

  // ---- experience ----
  experience: {
    kicker: "Scene 02 · Experience",
    title: "Enterprise AI, *shipped and adopted*",
    subtitle:
      "Every system below runs in production at GSK used daily by finance, legal and commercial teams, compressing weeks of manual work into minutes.",
    org: "GSK (GlaxoSmithKline)",
    period: "AI Lead Engineer, Global Functions · Jan 2024 — Present",
    items: [
      {
        tag: "Product & Lead Engineer",
        title: "ViiV Finance Commentary Tool",
        impact: "~1-week manual commentary cycle → minutes",
        desc: "Secure, role-aware finance platform where Country, Regional and Global finance leaders self-serve monthly P&L, SG&A and headcount variance commentary. Databricks Genie Ask-AI assistant + SQL Warehouse engines, entitlement-based RBAC with guardrails, OIDC/JWKS auth, 8-way parallel query execution, and a Modify → Validate → Finalize workflow with automated roll-ups.",
        chips: ["FastAPI", "React (Vite)", "Databricks Genie", "RBAC", "OIDC/JWKS", "Guardrails"],
      },
      {
        tag: "Architect & Full-Stack Developer",
        title: "BISON — Conversational Financial Analytics",
        impact: "Finance answers without an analyst, via NL-to-SQL",
        desc: "Conversational NL-to-SQL assistant over a Databricks warehouse: an 8-phase LangGraph pipeline covering follow-up detection, entity resolution (Azure AI Search), template matching, SQL generation and answer synthesis with memory. Shipped full-stack with a Next.js chat UI, charts, CSV export, GPT-4o via Kong, SSO, a 30+ scenario Playwright eval suite and Dockerized CI/CD.",
        chips: ["LangGraph", "NL-to-SQL", "GPT-4o", "Next.js", "Playwright evals", "Azure"],
      },
      {
        tag: "Architect",
        title: "Vaccine & HIV Demand Forecasting",
        impact: "Weeks-long modelling exercise → on-demand minutes",
        desc: "Agentic analogue-forecasting microservice: an 8-stage LangChain pipeline with executor/reviewer factor scoring, a Claude grounding audit that strips hallucinations, and Monte-Carlo-banded uptake curves producing Worst/Base/Best launch forecasts. Per-stage deterministic fallbacks, async jobs with live progress streaming, React dashboard.",
        chips: ["LangChain", "GPT-5.5", "Claude Opus 4.8", "Monte Carlo", "PostgreSQL", "FastAPI"],
      },
      {
        tag: "Builder",
        title: "Legal Document Intelligence (ICF)",
        impact: "~6 hours of legal review saved per document",
        desc: "GenAI document intelligence verifying site-level Informed Consent Forms against the GSK master template Azure AI Document Intelligence parsing, embedding + cosine-similarity section alignment in Azure AI Search, GPT-4o deviation flagging. Celery async jobs, reviewer comparison view with highlighted deviations, Key Vault, LangSmith tracing. Adopted by legal teams.",
        chips: ["Azure OpenAI", "Embeddings", "Celery", "Azure AI Search", "LangSmith", "Docker"],
      },
      {
        tag: "Governance Lead",
        title: "Responsible AI Governance",
        impact: "83 AI use cases reviewed, ~40–45 remediated",
        desc: "Reviewed AI use cases across HR, Procurement, Legal and Finance; built governance dashboards, managed the AI registry, presented to senior stakeholders, and co-founded the Global Functions Responsible AI Forum that standardized GSK's enterprise AI-review methodology.",
        chips: ["AI Governance", "Risk Review", "Dashboards", "Stakeholder Management"],
      },
      {
        tag: "ML Engineer",
        title: "Marketing Mix Modelling (Japan)",
        impact: "95% validation accuracy, ~6h task → ~2h",
        desc: "Decision-tree account-classification model segmenting the Japanese market into 8 priority categories, giving the marketing team a reusable pipeline for targeting high-value accounts.",
        chips: ["Scikit-Learn", "Decision Trees", "Embeddings", "Pandas"],
      },
    ],
  },

  // ---- projects (viz: constellation | loss | chat | commits) ----
  projects: {
    kicker: "Scene 03 · Key projects & research",
    title: "Intelligent systems, *not just applications*",
    subtitle: "Research, fine-tuning and the AI running on this very page.",
    items: [
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
        desc: "End-to-end supervised fine-tuning pipeline on Qwen2.5-1.5B data prep through checkpointing achieving +30% domain accuracy over base, with documented fine-tuning vs. RAG trade-offs.",
        chips: ["PyTorch", "Hugging Face", "SFT", "PEFT/LoRA"],
        viz: "loss",
      },
      {
        tag: "This Website",
        title: "Portfolio + AI Chatbot",
        desc: "The site you're on: React + Framer Motion frontend, and a serverless chatbot grounded in my resume sanitized content inlined as full-context grounding, answered by Gemini with streaming, rate limiting and a fair queue.",
        chips: ["React (Vite)", "Gemini", "Vercel Edge", "SSE"],
        link: "https://github.com/crypto-vbg/vijith.github.io",
        linkLabel: "View source →",
        viz: "chat",
      },
      {
        tag: "Open Source & Profile",
        title: "More on GitHub",
        desc: "Experiments in agentic workflows, retrieval, evaluation harnesses and AI-accelerated development live on my GitHub along with the code behind these projects.",
        chips: ["Agents", "RAG", "Evals", "Python"],
        link: "https://github.com/crypto-vbg",
        linkLabel: "github.com/crypto-vbg →",
        viz: "commits",
      },
    ],
  },

  // ---- skills ----
  skills: {
    kicker: "Scene 04 · Capabilities",
    title: "The *full stack* of modern AI engineering",
    subtitle:
      "From agent orchestration to eval harnesses to the cloud infrastructure it all runs on one engineer, the whole lifecycle.",
    groups: [
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
    ],
  },

  // ---- journey / beyond code ----
  journey: {
    kicker: "Scene 05 · Beyond code",
    titleLine1: "Some systems I debug.",
    titleLine2: "Some roads I just ride.",
    text: "When I'm not orchestrating agents, I'm leaning into hairpin bends on mountain roads. Motorcycles, long routes and high altitudes that's where the best engineering ideas quietly arrive.",
    interests: [
      { emoji: "bike", title: "Motorcycle Riding", desc: "Where the mind clears and ideas arrive." },
      { emoji: "mountain", title: "Mountain Adventures", desc: "Chasing hairpin bends and high-altitude views." },
      { emoji: "road", title: "Long Road Trips", desc: "The longer the route, the better the story." },
      { emoji: "pine", title: "Exploring Nature", desc: "Balance for a life spent among machines." },
    ],
  },

  // ---- contact ----
  contact: {
    kicker: "Scene 06 · Contact",
    title: "Let's build something *intelligent*",
    subtitle:
      "Open to conversations about Generative AI, agentic systems and hard problems worth solving. Reach out on LinkedIn or ask the AI assistant in the corner about my work first. I built it.",
    buttons: [
      { label: "Connect on LinkedIn", href: "https://linkedin.com/in/vijith-bg", primary: true },
      { label: "GitHub", href: "https://github.com/crypto-vbg", primary: false },
    ],
  },

  // ---- footer ----
  footer: {
    left: "© {year} Vijith BG · Bengaluru, India",
    right: "written, directed & engineered with react, framer-motion & a lot of AI ✦",
  },

  // ---- chatbot widget ----
  chatbot: {
    title: "Vijith's AI Assistant",
    welcome:
      "Hi! I'm an AI assistant trained on **Vijith's portfolio**. Ask me about his AI projects, GSK work, skills — or his motorcycle adventures. 🏍️",
    placeholder: "Ask about Vijith's work…",
    footnote: "AI-generated from Vijith's portfolio · may be imperfect · contact via LinkedIn",
    suggestedQuestions: [
      "Tell me about yourself.",
      "What AI projects have you built?",
      "Explain your experience with Generative AI.",
      "What makes you different from other AI Engineers?",
      "Tell me about your hobbies.",
      "Why do you enjoy motorcycle riding?",
    ],
    queueMessages: [
      "Holding your spot in line…",
      "The assistant is helping other visitors…",
      "Good things come to those who queue ✨",
      "Almost there — thanks for your patience…",
    ],
    capacityMessage:
      "I'm at capacity right now and the queue is long. Please try again in a minute or two — or reach Vijith on [LinkedIn](https://linkedin.com/in/vijith-bg).",
  },
};
