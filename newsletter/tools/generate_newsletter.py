"""
Tool: generate_newsletter.py
Purpose: Use Gemini to write a full HTML newsletter for a given topic
Input:  topic (str), edition_number (int) - which edition this is in the series
Output: saves to .tmp/newsletter.html, returns the HTML string
Usage:  python tools/generate_newsletter.py --topic "AI in healthcare" --edition 1
"""

import os
import sys
import argparse
from pathlib import Path
from dotenv import load_dotenv
import google.genai as genai
from google.genai import types

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY is missing from .env")
    sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)

TMP_DIR = Path(__file__).parent.parent / ".tmp"
TMP_DIR.mkdir(exist_ok=True)
OUTPUT_PATH = TMP_DIR / "newsletter.html"

TEXT_MODEL = "gemini-2.0-flash"

NEWSLETTER_PROMPT = """
You are an expert newsletter writer. Write a professional, engaging HTML newsletter for the topic below.

TOPIC: {topic}
EDITION: #{edition}

Requirements:
- Write ONLY the inner body content — no <html>, <head>, or <body> tags
- Use inline CSS only (email clients strip external/embedded CSS)
- Max width 600px, centered
- Structure:
    1. Leave this exactly at the top (do not remove): <!-- IMAGE_PLACEHOLDER -->
    2. Headline (bold, large, topic-related)
    3. A short welcome/intro (2 sentences)
    4. Main article: 3-4 insightful paragraphs about the topic
    5. A "Key Takeaway" callout box (left border, light background)
    6. Closing with a CTA button ("Learn More" with href="#")
    7. Footer: "Edition #{edition}" and "Unsubscribe" (href="#")
- Tone: professional, informative, slightly conversational
- Color palette: deep navy (#0f172a), accent blue (#3b82f6), light gray background (#f8fafc)
- Font: Arial or sans-serif (email-safe)

Return ONLY raw HTML, no markdown code fences, no explanations.
"""


def generate_newsletter(topic: str, edition: int) -> str:
    """Use Gemini to generate a full HTML newsletter."""
    print(f"[generate_newsletter] Writing newsletter: '{topic}' (Edition #{edition})")

    prompt = NEWSLETTER_PROMPT.format(topic=topic, edition=edition)

    try:
        response = client.models.generate_content(
            model=TEXT_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.8,
                max_output_tokens=4096,
            ),
        )

        html_content = response.text.strip()

        # Strip accidental markdown fences
        if html_content.startswith("```"):
            lines = html_content.split("\n")
            html_content = "\n".join(lines[1:])
        if html_content.endswith("```"):
            lines = html_content.split("\n")
            html_content = "\n".join(lines[:-1])

        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            f.write(html_content)

        print(f"[generate_newsletter] ✅ Newsletter saved to: {OUTPUT_PATH}")
        return html_content

    except Exception as e:
        print(f"ERROR generating newsletter: {e}")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate HTML newsletter")
    parser.add_argument("--topic", required=True, help="Newsletter topic")
    parser.add_argument("--edition", type=int, default=1, help="Edition number")
    args = parser.parse_args()
    html = generate_newsletter(args.topic, args.edition)
    print(html)
