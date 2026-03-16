# ctx-full.md — Full Context for Claude (Coding / Implementation)
# Copy everything below this line and paste as your opening message.
# Last updated: 2026-03-16
# ─────────────────────────────────────────────────────────────────

## Project Context: Gateway-OS

You are helping Cary Hebert build and maintain **Gateway-OS** — a modular, webhook-based
automation system built on Google Apps Script (GAS).

**Owner:** Cary Hebert — 1st Grade French Immersion teacher, Baton Rouge LA.
Transitioning to Shanghai High School International Division, August 2026.
Prefers plain English. No-code solutions first. HSK 4 Mandarin in progress.

---

## What Gateway-OS Does

Receives POST requests from external tools (iOS Shortcuts, n8n, Make, curl),
routes them to self-contained Agent handlers, and logs results to Google Sheets.
Two fully separate GAS projects keep dev and prod isolated.

---

## Environment

| Env  | Account               | Sheet ID |
|------|-----------------------|----------|
| Dev  | cary.hebert@gmail.com | `1KVHxSLUSk1LpySX2K1ITRXqxJKV4h-dpnd_Ia4lV6_E` |
| Prod | cary.hebert@gmail.com | `1kWtc6Z_kdgCEMCkYyLd9U300MGxdZLr0NzNSESIUsUE` |

> **Note:** Both dev and prod currently write to the same prod sheet.
> Dev sheet was deleted; consolidated into prod sheet as of March 2026.

Credentials (script IDs, webhook URLs) are stored in `.env.local` at repo root — gitignored.
Load before any curl test: `source .env.local`

---

## Repo

GitHub: `chebe24/nexus-command`
Local path: `~/Developer.nosync/21_systems/nexus-command`

```
nexus-command/
├── dev-project/
│   ├── Config.gs           ← Constants (ENV, ACCOUNT, SPREADSHEET_ID)
│   ├── Utilities.gs        ← Shared helpers (logEvent, buildResponse, getOrCreateSheet)
│   ├── Router.gs           ← doPost — routes payload.action → correct Agent
│   ├── Code.gs             ← updateInventory (Drive scan)
│   ├── ModelRouterAgent.gs ← Routes tasks to Claude / GPT-4o / Gemini / Perplexity
│   ├── RelocationTracker.gs← SHSID onboarding doc tracker (in progress)
│   └── agents/
│       ├── LoggerAgent.gs      ← "log" action
│       └── InventoryAgent.gs   ← "inventory" action
├── prod-project/           ← Same structure, no AI keys yet
├── .github/workflows/
│   └── deploy.yml          ← CI/CD: auto-deploys dev; prod requires manual approval
├── .githooks/pre-commit    ← Memory update reminders (tracked, not .git/hooks/)
├── .env.local              ← Gitignored credentials (script IDs, webhook URLs, sheet IDs)
├── AGENTCONTEXT.md         ← Full project context (read this for deeper detail)
└── docs/                   ← ctx-full.md, ctx-docs.md, ctx-research.md, security-guide.md
```

---

## Architecture Pattern

Every Agent follows this exact contract:
1. `Router.gs` receives POST, reads `payload.action` (lowercased)
2. Routes to `AgentName_init(payload)`
3. Agent returns plain object: `{ code, message, data, env }`
4. Router wraps with `_Router_wrapResponse()` → ContentService JSON

New agents: `./ai-agents.sh agent AgentName`

---

## Active Routes

| `payload.action` | Handler                  | What it does |
|------------------|--------------------------|--------------|
| `log`            | LoggerAgent.gs           | Writes structured row to System Log tab |
| `fileops`        | Router.gs (inline)       | Validates and logs file operations |
| `inventory`      | InventoryAgent.gs        | Scans Drive folder, updates Inventory tab |
| `route`          | ModelRouterAgent.gs      | Routes task to Claude / GPT-4o / Gemini / Perplexity |

---

## ModelRouterAgent — Task Routing Logic

The `route` action reads `payload.task_type` and calls the matching AI:

| `task_type`                                       | Model      | Why |
|---------------------------------------------------|------------|-----|
| `complex_code`, `architecture`, `debugging`, `writing` | Claude Sonnet 4.6 | Best for multi-file reasoning and code quality |
| `quick_script`, `prototype`, `web_task`, `multimedia`  | GPT-4o     | Fast, capable generalist for lighter tasks |
| `mandarin`, `ocr`, `translation`, `chinese`            | Gemini 1.5 Flash | Native Google integration + multilingual strength |
| `research`, `current_events`, `sourced`                | Perplexity sonar | Web-grounded answers with citations |

All 4 API keys are active in Dev Script Properties. Prod is dev-only until promotion.

---

## LoggerAgent — Payload Shape

```json
{
  "action":    "log",
  "eventType": "SESSION_COMPLETE",
  "message":   "What was accomplished",
  "level":     "INFO",
  "data":      { "commit": "abc1234", "env": "dev" }
}
```

Required: `eventType`, `message`. Optional: `level` (INFO/WARN/ERROR), `data`.

---

## Webhook POST Pattern (GAS-specific)

GAS web apps always redirect POST → 302 → `script.googleusercontent.com/macros/echo?...`
**Never use `curl -L -X POST`** — it silently converts POST to GET after the redirect.

Two-step pattern (required):
```bash
source .env.local
REDIRECT=$(curl -s -o /dev/null -w "%{redirect_url}" -X POST "$DEV_WEBHOOK_URL" \
  -H "Content-Type: application/json" -d '{"action":"log", ...}')
curl -s "$REDIRECT"
```

---

## CI/CD (GitHub Actions)

- Push to `main` → auto-deploys `dev-project/` via clasp
- Prod deploy → requires manual approval in GitHub Actions tab (Environment: `production`)
- Secrets: `CLASDEV_JSON` (dev clasp token), `CLASPRC` (prod clasp token)
- After any `clasp push`: create a new deployment version in GAS editor or web app won't pick up changes

---

## V6 Filename Convention

```
Format:  NN-YYYY-MM-DD_Component_FileType_Title.ext
Example: 02-2026-03-01_Gateway_YAML_PatternRegistryV6.md
```

---

## Rules — Follow These Exactly

1. Think step by step — justify decisions with evidence
2. No-code first — suggest GUI before writing code
3. Confirm before any destructive action
4. Conventional commits: `type: message`
5. FERPA — never include real student names, grades, or IDs
6. Always confirm which Google account is active before clasp operations
7. Phase-by-phase — one phase at a time, wait for confirmation
8. Never guess — ask if context is missing
9. Changes in dev should mirror prod unless explicitly scoped otherwise
10. Code lives in GitHub only — never save .gs/.sh/.py/.js to local folders or Drive
