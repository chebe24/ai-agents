# route-prompts.md — Gateway-OS Quick Route Templates
# Paste any block below into Claude Code as-is.
# Fill in the [...] placeholder, then hit Enter.
# Claude will fire the webhook and analyze the response.
# Last updated: 2026-03-16
# ─────────────────────────────────────────────────────────────────

## RESEARCH (Perplexity — cited, web-grounded)
```
gateway route research: [YOUR QUESTION HERE]
```

## CURRENT EVENTS (Perplexity — recent news)
```
gateway route current_events: [TOPIC] — past [7 days / 30 days / 6 months]
```

## CODE REVIEW / ARCHITECTURE (Claude)
```
gateway route architecture: [DESCRIBE YOUR SYSTEM OR PASTE CODE]
```

## DEBUGGING (Claude)
```
gateway route debugging:
ERROR: [PASTE ERROR]
CODE: [PASTE CODE]
```

## QUICK SCRIPT (GPT-4o)
```
gateway route quick_script: Write a [GAS / Python / Bash] script that [WHAT IT SHOULD DO]
```

## TRANSLATION / MANDARIN (Gemini)
```
gateway route mandarin: Translate to [Chinese / English / French]: [PASTE TEXT]
```

## OCR / TEXT CLEANUP (Gemini)
```
gateway route ocr: Clean and correct this OCR output: [PASTE RAW TEXT]
```

# ─────────────────────────────────────────────────────────────────
# HOW IT WORKS
# Claude Code recognizes the "gateway route" prefix, fires the
# two-step webhook POST to DEV_WEBHOOK_URL, and returns the AI
# response for analysis — no curl commands or API keys needed.
# ─────────────────────────────────────────────────────────────────
