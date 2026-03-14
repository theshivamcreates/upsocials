"""
Tool: generate_image.py
Purpose: Generate a newsletter header image.
         Tries Nano Banana Pro (models/nano-banana-pro-preview) first.
         Falls back to a topic-relevant Unsplash photo if quota is exceeded
         (Nano Banana Pro requires a Google AI paid plan).
Input:  topic (str) - the newsletter topic
Output: saves image to .tmp/newsletter_image.png, returns the file path
Usage:  python tools/generate_image.py --topic "AI in healthcare"
"""

import os
import sys
import argparse
import requests
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY is missing from .env")
    sys.exit(1)

TMP_DIR = Path(__file__).parent.parent / ".tmp"
TMP_DIR.mkdir(exist_ok=True)
OUTPUT_PATH = TMP_DIR / "newsletter_image.png"

IMAGE_MODEL = "models/nano-banana-pro-preview"


def try_nano_banana(topic: str) -> Optional[bytes]:
    """Attempt image generation via Nano Banana Pro (requires paid tier)."""
    try:
        import google.genai as genai
        from google.genai import types

        client = genai.Client(api_key=GEMINI_API_KEY)
        prompt = (
            f"Create a professional, visually striking newsletter header image for the topic: '{topic}'. "
            f"Modern flat design, clean composition, vibrant professional colors, landscape format. "
            f"Abstract visuals relevant to the topic. No text overlay."
        )
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )
        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                return part.inline_data.data
        return None

    except Exception as e:
        error_str = str(e)
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str or "quota" in error_str.lower():
            print(f"[generate_image] ⚠️  Nano Banana Pro quota exceeded (paid plan required). Using Unsplash fallback.")
        elif "INVALID_ARGUMENT" in error_str and "paid" in error_str.lower():
            print(f"[generate_image] ⚠️  Nano Banana Pro requires a paid Google AI plan. Using Unsplash fallback.")
        else:
            print(f"[generate_image] ⚠️  Nano Banana Pro unavailable: {e}. Using Unsplash fallback.")
        return None


def fetch_picsum_image(topic: str) -> bytes:
    """Fetch a random high-quality photo from Picsum (free, no API key needed)."""
    # Use a deterministic seed from topic so same topic gets same style of image
    seed = abs(hash(topic)) % 1000
    url = f"https://picsum.photos/seed/{seed}/1200/400"
    print(f"[generate_image] Fetching Picsum photo (seed={seed}) as fallback...")
    response = requests.get(url, timeout=15, allow_redirects=True)
    response.raise_for_status()
    return response.content


def generate_image(topic: str) -> str:
    """Generate a newsletter header image, trying Nano Banana Pro first."""
    print(f"[generate_image] Generating image for topic: '{topic}'")

    # Try Nano Banana Pro first
    print(f"[generate_image] Trying {IMAGE_MODEL}...")
    image_bytes = try_nano_banana(topic)

    # Fall back to Unsplash if Nano Banana Pro isn't available
    if not image_bytes:
        image_bytes = fetch_picsum_image(topic)

    with open(OUTPUT_PATH, "wb") as f:
        f.write(image_bytes)

    print(f"[generate_image] ✅ Image saved to: {OUTPUT_PATH} ({len(image_bytes):,} bytes)")
    return str(OUTPUT_PATH)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate newsletter header image")
    parser.add_argument("--topic", required=True, help="Newsletter topic")
    args = parser.parse_args()
    path = generate_image(args.topic)
    print(path)
