---
description: Automatically generate and send an HTML newsletter with an AI-generated image via Gmail every N minutes
inputs:
  - topic: The newsletter subject matter (e.g. "AI in healthcare")
  - editions: Total number of emails to send
  - interval: Minutes between each send (default: 5, set in .env)
outputs:
  - HTML newsletter emails delivered to RECIPIENT_EMAIL with inline generated image
tools:
  - tools/generate_image.py
  - tools/generate_newsletter.py
  - tools/send_email.py
  - tools/scheduler.py
---

## Objective

Send a series of AI-written HTML newsletters on a given topic to a configured recipient.
Each edition gets a freshly generated Nano Banana Pro header image and a new Gemini-written article.

## Required Inputs

| Input | Source | Example |
|---|---|---|
| `topic` | CLI argument | `"Future of Solar Energy"` |
| `editions` | CLI argument | `3` |
| `interval` | `.env` or CLI | `5` (minutes) |
| `GEMINI_API_KEY` | `.env` | From aistudio.google.com |
| `RECIPIENT_EMAIL` | `.env` | `theshivamcreates@gmail.com` |
| `credentials.json` | Project root | Gmail OAuth (Desktop App) |

## One-Time Setup (First Run Only)

1. Add your `GEMINI_API_KEY` to `.env`
2. Ensure `credentials.json` is in the project root
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. The first run will open a browser window for Gmail OAuth approval — approve it once and `token.json` is saved for all future runs

## How to Run

```bash
cd "/Users/shivam/Downloads/CODING /UPSOCIALS/CLAUDE TRY"
python tools/scheduler.py --topic "Your Topic Here" --editions 3
```

Override interval (default is from `.env`):
```bash
python tools/scheduler.py --topic "Future of Solar Energy" --editions 5 --interval 10
```

## Pipeline Steps (per edition)

1. **generate_image.py** — Sends topic prompt to Nano Banana Pro → saves `newsletter_image.png` to `.tmp/`
2. **generate_newsletter.py** — Sends topic to Gemini → writes full HTML newsletter → saves to `.tmp/newsletter.html`
3. **send_email.py** — Builds MIME email with inline image → sends via Gmail API
4. **scheduler.py** — Waits N minutes → repeats for next edition

## Edge Cases & Notes

- **Rate limits**: Gemini image generation may throttle at high frequency. If you hit 429 errors, increase `--interval` to 10+ minutes.
- **Token expiry**: `token.json` refreshes automatically. If it fails, delete `token.json` and re-auth.
- **Image failures**: If Nano Banana Pro returns no image, the email still sends without a header image (graceful fallback).
- **Stop mid-run**: Press `Ctrl+C` at any point — the scheduler exits cleanly.
- **Model name**: Image model is `gemini-2.0-flash-exp-image-generation`. Update in `generate_image.py` if Google releases a newer Nano Banana Pro model name.

## Output

Emails delivered to `RECIPIENT_EMAIL` with:
- Subject: `📰 {Topic} — Edition #{N}`
- Inline header image matching the topic
- Full article, key takeaway box, and CTA button
