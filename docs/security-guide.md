# AI-Agents Security Hardening Guide
## Research Summary & Enforceable Best Practices (March 2026)

**Status**: Compiled from Google Apps Script docs, GitHub security guides, and community best practices. **Hardcode these rules into all templates, READMEs, and workflows** so models/humans always follow them. Last updated: March 15, 2026.

**Core Principle**: Secrets (API keys, tokens, PII) **never** live in code, Git, or examples. Fetch via secure helpers from PropertiesService / GitHub Secrets / Secret Manager.

## 1. Threat Model & What to Protect

From GitHub and Google security docs: Common leaks happen via accidental commits, logs, or public libraries.

**Protect these explicitly** (list in every SECURITY.md):

| Category | Examples | Storage Rule |
|----------|----------|--------------|
| API Credentials | OpenAI/Anthropic keys, webhook secrets | PropertiesService / GitHub Secrets |
| OAuth / Service Accounts | Client secrets
