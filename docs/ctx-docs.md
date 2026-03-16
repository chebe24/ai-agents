# ctx-docs.md — Medium Context for Gemini / ChatGPT (PRDs, MVPs, Documentation)
# Copy everything below this line and paste as your opening message.
# Last updated: 2026-03-16
# ─────────────────────────────────────────────────────────────────

## Project Context: Gateway-OS

You are helping Cary Hebert write documentation, PRDs, or MVP plans for **Gateway-OS**.

**Owner:** Cary Hebert — 1st Grade French Immersion teacher, Baton Rouge LA.
Transitioning to Shanghai High School International Division, August 2026.
Non-technical background. Plain English preferred. No jargon without explanation.

---

## What Gateway-OS Is

A personal automation system built on Google Apps Script. It works like a switchboard:
- External tools (iPhone Shortcuts, automation platforms) send requests to a central webhook
- The system routes each request to the right "Agent" — a small, focused script
- Every action is logged to a Google Sheet dashboard

Think of it as a modular command center: each Agent is a self-contained block
that can be added, removed, or swapped without touching anything else.

---

## Current Agents (Modules)

| Agent | Action key | What It Does |
|-------|------------|-------------|
| LoggerAgent | `log` | Records structured events to the System Log sheet tab |
| InventoryAgent | `inventory` | Scans a Google Drive folder and catalogs automation files |
| FileOps | `fileops` | Validates file names against the V6 naming convention |
| ModelRouterAgent | `route` | Routes tasks to Claude, GPT-4o, Gemini, or Perplexity based on task type |

---

## AI Model Routing (ModelRouterAgent)

The system intelligently assigns tasks to the right AI model:

| Task Type | Model | Reason |
|-----------|-------|--------|
| Complex code, architecture, debugging, writing | **Claude** | Best multi-step reasoning and code quality |
| Quick scripts, prototypes, web tasks | **ChatGPT (GPT-4o)** | Fast, capable generalist |
| Mandarin, OCR, translation, Chinese content | **Gemini** | Native Google integration + multilingual |
| Research, current events, cited answers | **Perplexity** | Web-grounded with citations |

---

## Technology Stack (plain language)

- **Google Apps Script** — scripting language (like JavaScript, runs in Google's cloud for free)
- **Google Sheets** — the dashboard and database
- **Webhooks** — communication method (external tool sends a message; system responds)
- **GitHub** — where all code is stored (`chebe24/nexus-command`)
- **clasp** — command-line tool that pushes code from local machine to Google Apps Script
- **GitHub Actions** — CI/CD pipeline: dev deploys automatically; prod requires manual approval

---

## Design Principles

- **Modular** — each Agent is independent; add or remove without breaking others
- **No hardcoded secrets** — all sensitive IDs in `.env.local` (local) or Script Properties (GAS)
- **Logged** — every action writes to a Google Sheet for audit and review
- **Plain** — no infrastructure more complex than Google's free tools
- **AI-routed** — tasks are assigned to the best model for the job, not one-size-fits-all

---

## Naming Convention (V6)

All files follow: `NN-YYYY-MM-DD_Component_FileType_Title.ext`
Example: `02-2026-03-01_Gateway_YAML_PatternRegistryV6.md`

---

## What I Need From You

When writing PRDs, MVPs, or documentation for this project:
- Use plain, non-technical language where possible
- Structure output as: Overview → Goals → Components → Steps → Success Criteria
- Each new Agent or feature should be described as a self-contained module
- Flag any dependencies on existing agents clearly
- Do not suggest adding external services, databases, or paid tools unless asked
- Reference the correct model for implementation tasks:
  - Code → Claude
  - Research → Perplexity
  - Docs/PRDs → you (Gemini or ChatGPT)
