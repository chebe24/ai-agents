# ctx-research.md — Lightweight Context for Perplexity (Research)
# Copy everything below this line and paste as your opening message.
# Last updated: 2026-03-16
# ─────────────────────────────────────────────────────────────────

## Research Context

I'm building a personal automation system called **Gateway-OS** using Google Apps Script (GAS).
It's a modular webhook router: external tools POST to a central endpoint, which routes to
self-contained Agent scripts that log results to Google Sheets.

**My constraints:**
- No-code / low-code preferred — I'm not a professional developer
- Free tools only — Google Workspace ecosystem (GAS, Sheets, Drive)
- Modular architecture — new capabilities are added as independent Agent blocks
- All code lives in GitHub (`chebe24/nexus-command`), deployed via clasp CLI
- Running on Google Apps Script V8 runtime (JavaScript-like, serverless, no npm)
- CI/CD via GitHub Actions — dev auto-deploys, prod requires manual approval

**Current agents:**
- `log` — LoggerAgent: structured event logging to Google Sheets
- `inventory` — InventoryAgent: Drive folder scanning
- `fileops` — filename validation against V6 naming convention
- `route` — ModelRouterAgent: routes tasks to Claude / GPT-4o / Gemini / Perplexity

**AI model routing strategy (already implemented):**
- Claude → complex code, architecture, debugging, long-form writing
- Perplexity → research, current events, citations (that's you)
- ChatGPT (GPT-4o) → quick scripts, prototypes, web/multimedia tasks
- Gemini → Mandarin/Chinese content, OCR, translation, Google-native tasks

**My workflow:**
- Claude → coding and implementation
- Perplexity → research (that's you)
- Gemini / ChatGPT → PRDs, documentation, planning

Frame your research answers with these constraints in mind.
Prefer solutions that work within Google's ecosystem before suggesting external services.
Cite sources. Flag anything that requires paid services or infrastructure beyond GAS + GitHub.
