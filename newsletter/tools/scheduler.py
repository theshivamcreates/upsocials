"""
Tool: scheduler.py
Purpose: Orchestrates the full newsletter pipeline and runs it every N minutes.
         You provide the topic and how many editions to send.
Input:  --topic (str), --editions (int), --interval (int, minutes — default from .env)
Output: Sends one newsletter per interval, stops after N editions
Usage:  python tools/scheduler.py --topic "AI in healthcare" --editions 3
"""

import os
import sys
import time
import argparse
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

INTERVAL_MINUTES = int(os.getenv("SEND_INTERVAL_MINUTES", "5"))

# Ensure tools dir is in path
sys.path.insert(0, str(Path(__file__).parent))

from generate_image import generate_image
from generate_newsletter import generate_newsletter
from send_email import send_email


def run_pipeline(topic: str, edition: int) -> None:
    """Run one full newsletter cycle: image → HTML → send."""
    print(f"\n{'='*60}")
    print(f" EDITION #{edition} — {topic}")
    print(f"{'='*60}")

    # Step 1: Generate image
    image_path = generate_image(topic)

    # Step 2: Generate newsletter HTML
    html_body = generate_newsletter(topic, edition)

    # Step 3: Send email
    send_email(topic, html_body, image_path, edition)

    print(f" ✅ Edition #{edition} complete.")


def main():
    parser = argparse.ArgumentParser(description="Automated newsletter scheduler")
    parser.add_argument("--topic", required=True, help="Newsletter topic")
    parser.add_argument("--editions", type=int, required=True, help="Total editions to send")
    parser.add_argument(
        "--interval",
        type=int,
        default=INTERVAL_MINUTES,
        help=f"Minutes between sends (default: {INTERVAL_MINUTES} from .env)"
    )
    args = parser.parse_args()

    print(f"\n🚀 Newsletter Scheduler Started")
    print(f"   Topic    : {args.topic}")
    print(f"   Editions : {args.editions}")
    print(f"   Interval : every {args.interval} minute(s)")
    print(f"   Recipient: {os.getenv('RECIPIENT_EMAIL')}\n")

    for edition in range(1, args.editions + 1):
        run_pipeline(args.topic, edition)

        if edition < args.editions:
            wait_seconds = args.interval * 60
            print(f"\n⏳ Next edition in {args.interval} minute(s)... (Ctrl+C to stop)\n")
            try:
                time.sleep(wait_seconds)
            except KeyboardInterrupt:
                print("\n🛑 Scheduler stopped by user.")
                sys.exit(0)

    print(f"\n🎉 All {args.editions} editions sent successfully!")


if __name__ == "__main__":
    main()
