#!/usr/bin/env python3
"""DigProg course lesson: 16:9, ~3 min, topic explainer (classroom, not Shorts)."""
from __future__ import annotations

import asyncio
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "L001-what-is-a-business"
SLIDES = OUT / "slides"
W, H = 1920, 1080
VOICE = "en-US-AndrewNeural"

# (section, headline, bullets) — timing scaled to match voice
SCENES: list[tuple[str, str, list[str]]] = [
    (
        "Lesson 01 · Module 1",
        "What is a business?",
        [
            "Simple English. No MBA.",
            "For people with a 9-to-5 who want something real.",
        ],
    ),
    (
        "Definition",
        "A business solves a painful problem",
        [
            "for people who can pay,",
            "and you get paid to solve it.",
            "If nobody pays — it is a hobby.",
        ],
    ),
    (
        "Three parts",
        "Every real business has three parts",
        [
            "1. Customer — who has the problem",
            "2. Offer — what you sell to fix it",
            "3. Delivery — how you keep the promise",
        ],
    ),
    (
        "Not this",
        "What is NOT a business (yet)",
        [
            "Posting content with no offer",
            "An idea you never tested with humans",
            "A logo, site, and zero conversations",
        ],
    ),
    (
        "Startup vs business",
        "Startup vs small business",
        [
            "Startup: still searching for what works",
            "Small business: known model, execute well",
            "DigProg starts simple — then you systemize",
        ],
    ),
    (
        "Example",
        "One clear example",
        [
            "Customer: tired office workers",
            "Problem: no time to learn sales",
            "Offer: short course + worksheets",
            "Pay → access → they do the work",
        ],
    ),
    (
        "Money words",
        "Four money words you need",
        [
            "Revenue = money in",
            "Cost = money out to deliver",
            "Profit = revenue − cost",
            "Cash = what is in the account now",
        ],
    ),
    (
        "Cash trap",
        "Cash is not the same as profit",
        [
            "You can look profitable on paper",
            "and still have empty accounts.",
            "Track cash weekly from day one.",
        ],
    ),
    (
        "Your job this week",
        "Your only job after this lesson",
        [
            "Finish this sentence:",
            "“I help ___ do ___ so they can ___.”",
            "Ugly is fine. Specific is better.",
        ],
    ),
    (
        "Next",
        "Next lesson",
        [
            "Startup vs small business — deeper",
            "Then: are you ready to build after work?",
            "Quiz unlocks when you pass.",
        ],
    ),
]


def font(size: int) -> ImageFont.FreeTypeFont:
    for p in (
        "/System/Library/Fonts/Supplemental/Arial Black.ttf",
        "/Library/Fonts/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ):
        try:
            return ImageFont.truetype(p, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def narration() -> str:
    # ~450 words ≈ 3 minutes at natural TTS pace
    return " ".join(
        [
            "Welcome to DigProg. Lesson one. What is a business?",
            "We will keep this simple. No M B A words. No guru water.",
            "This course is for mid class people with a real job,",
            "who can give about ninety minutes after work,",
            "and want to build something that can become a real business.",
            "Here is the definition we will use for the whole course.",
            "A business solves a painful problem for people who can pay,",
            "and you get paid to solve it.",
            "If nobody pays, it is not a business yet. It is a hobby, a project, or content.",
            "That one sentence will save you months of fake progress.",
            "Every real business has three parts. Remember them.",
            "First, the customer: the person who has the problem and can pay.",
            "Second, the offer: what they buy from you to fix that problem.",
            "Third, delivery: how you keep the promise after they pay.",
            "If any of these three is missing, you do not have a business. You have an idea.",
            "Now, what is not a business yet, even if it feels productive.",
            "Posting every day with no offer is not a business.",
            "An idea you never tested with real humans is not a business.",
            "A logo, a website, and zero conversations is not a business.",
            "Those things can help later. They are not the start.",
            "Two words people mix up: startup and small business.",
            "A startup is still searching for a model that works under uncertainty.",
            "A small business usually runs a known model and focuses on execution.",
            "DigProg starts simple, like a small clear offer,",
            "then you systemize once people pay.",
            "You do not need a fancy startup story on day one. You need a paying customer loop.",
            "Let us use one clear example.",
            "Customer: tired office workers who want a better income path.",
            "Problem: they do not know how to sell, and they have little time.",
            "Offer: a short practical course with worksheets they can finish after work.",
            "Delivery: they pay, they unlock lessons, they do the tasks, they get help through the system.",
            "That is a business shape. Simple. Clear. Paid.",
            "Before you build more, learn four money words.",
            "Revenue is money in.",
            "Cost is money out to deliver what you promised.",
            "Profit is revenue minus cost.",
            "Cash is what is actually in the account today.",
            "Cash is not the same as profit.",
            "You can look profitable on paper and still have empty accounts",
            "because money comes in late, or you spent too early.",
            "From day one, track cash every week. Not vanity metrics. Cash.",
            "Here is your only job after this lesson.",
            "Finish one sentence in writing.",
            "I help blank do blank so they can blank.",
            "Example shape: I help office workers learn simple sales so they can get their first clients.",
            "Ugly is fine. Vague is not. Specific beats clever.",
            "If you cannot finish that sentence, do not buy a domain yet.",
            "Talk to people. Rewrite the sentence. Then continue.",
            "Next lesson goes deeper on startup versus small business,",
            "and whether your life stage fits building after work.",
            "After the video, take the quiz. Pass it to unlock the next lesson.",
            "That is DigProg. One idea. One action. Then the next step.",
        ]
    )


def slide(section: str, headline: str, bullets: list[str], progress: float) -> Image.Image:
    im = Image.new("RGB", (W, H), (12, 16, 14))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 14, H], fill=(196, 245, 66))
    for x in range(1180, W, 40):
        d.line([(x, 0), (x, H)], fill=(22, 32, 26), width=1)
    for y in range(0, H, 40):
        d.line([(1180, y), (W, y)], fill=(22, 32, 26), width=1)

    d.rounded_rectangle([48, 36, 220, 84], radius=12, fill=(242, 196, 168))
    d.text((68, 46), "DigProg", font=font(28), fill=(40, 28, 20))
    d.text((250, 48), section, font=font(28), fill=(160, 175, 165))

    d.rounded_rectangle([48, H - 36, W - 48, H - 24], radius=6, fill=(35, 45, 38))
    pw = max(8, int((W - 96) * progress))
    d.rounded_rectangle([48, H - 36, 48 + pw, H - 24], radius=6, fill=(196, 245, 66))

    d.text((48, 120), headline, font=font(58), fill=(245, 250, 245))

    y = 230
    for i, line in enumerate(bullets):
        d.rounded_rectangle([48, y, 1120, y + 92], radius=16, fill=(24, 34, 28))
        d.ellipse([72, y + 30, 104, y + 62], fill=(196, 245, 66))
        d.text((82, y + 34), str(i + 1), font=font(22), fill=(20, 25, 18))
        d.text((130, y + 30), line, font=font(34), fill=(230, 238, 232))
        y += 108

    d.rounded_rectangle([1180, 120, W - 48, H - 70], radius=20, fill=(20, 28, 22))
    d.text((1220, 160), "Remember", font=font(32), fill=(196, 245, 66))
    for i, line in enumerate(
        ["If nobody pays,", "it is not a business yet.", "", "After work:", "90 focused minutes", "beats 5 random hours."]
    ):
        color = (150, 165, 155) if line in ("After work:",) else (235, 240, 235)
        d.text((1220, 230 + i * 52), line, font=font(34 if i < 2 else 32), fill=color)

    return im


async def make_voice(path: Path) -> None:
    import edge_tts

    await edge_tts.Communicate(narration(), VOICE).save(str(path))


def probe_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        text=True,
    ).strip()
    return float(out)


def write_slides(total_audio: float) -> Path:
    SLIDES.mkdir(parents=True, exist_ok=True)
    for old in SLIDES.glob("*"):
        old.unlink()

    n = len(SCENES)
    # Aim ~3 minutes visual; match voice length
    target = max(total_audio, 170)
    each = target / n
    concat = OUT / "concat.txt"
    lines: list[str] = []
    for i, (section, headline, bullets) in enumerate(SCENES):
        progress = (i + 1) / n
        path = SLIDES / f"s{i:02d}.jpg"
        slide(section, headline, bullets, progress).save(path, quality=93)
        # ffmpeg concat demuxer
        lines.append(f"file '{path}'")
        lines.append(f"duration {each:.3f}")
    # last file must be repeated without duration for concat demuxer
    lines.append(f"file '{SLIDES / f's{n-1:02d}.jpg'}'")
    concat.write_text("\n".join(lines) + "\n")
    return concat


def mux(concat: Path, voice: Path, out_mp4: Path) -> None:
    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(concat),
        "-i",
        str(voice),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-r",
        "30",
        "-c:a",
        "aac",
        "-shortest",
        "-movflags",
        "+faststart",
        str(out_mp4),
    ]
    subprocess.run(cmd, check=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    voice = OUT / "voice.mp3"
    print("TTS…")
    asyncio.run(make_voice(voice))
    dur = probe_duration(voice)
    print(f"voice {dur:.1f}s")
    print("Slides…")
    concat = write_slides(dur)
    video = OUT / "L001-what-is-a-business-16x9.mp4"
    print("Mux…")
    mux(concat, voice, video)
    slide(*SCENES[0], 0.08).save(OUT / "cover.jpg", quality=95)
    print("DONE", video)
    print("COVER", OUT / "cover.jpg")
    print(f"DURATION_TARGET ~{max(dur, 170):.0f}s")


if __name__ == "__main__":
    main()
