# Workflow Index

All workflows live in this folder. Each file is a self-contained SOP.

## Naming Convention

```
[verb]_[noun].md
```
Examples: `scrape_website.md`, `generate_report.md`, `upload_to_sheets.md`

## Workflow Template

When creating a new workflow, use this structure:

```markdown
---
description: One-line summary of what this workflow does
inputs:
  - input_1: description
  - input_2: description
outputs:
  - output_1: description
tools:
  - tools/script_name.py
---

## Objective
What this workflow accomplishes and why.

## Required Inputs
List and describe each input.

## Steps
1. Step one — tool to call, expected output
2. Step two — ...

## Edge Cases & Notes
Document rate limits, API quirks, known failures, and how to handle them.

## Output
Where results go (Google Sheet URL, Slide deck, file path, etc.)
```
