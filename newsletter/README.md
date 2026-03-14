# WAT Framework — UPSOCIALS

This project is built on the **WAT** (Workflows · Agents · Tools) architecture.

## How It Works

| Layer | Location | Purpose |
|-------|----------|---------|
| **Workflows** | `workflows/` | Markdown SOPs — define the what and how |
| **Agent** | You (AI) | Reads workflows, orchestrates tools, handles failures |
| **Tools** | `tools/` | Python scripts — deterministic execution |

## Directory Layout

```
.
├── claude.md           # Agent operating instructions
├── workflows/          # Markdown SOPs for every repeatable task
├── tools/              # Python execution scripts
├── .tmp/               # Temporary / intermediate files (disposable)
├── .env                # API keys (never committed)
├── credentials.json    # Google OAuth (gitignored)
└── token.json          # Google OAuth token (gitignored)
```

## Getting Started

1. Copy `.env` and fill in your API keys.
2. Install Python dependencies per-tool (see each tool's header comments).
3. Pick a workflow from `workflows/`, read it, then ask the agent to run it.

## Principles

- **Deterministic execution wins.** Tools handle the tedious work; the agent handles decisions.
- **Workflows are living docs.** Update them when you discover better methods or edge cases.
- **Local files are disposable.** Deliverables live in cloud services (Google Sheets, Slides, etc.).
