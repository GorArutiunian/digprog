#!/usr/bin/env python3
"""L001 v2 — DigProg lecture per MASTER BRIEF (16:9, editorial motion)."""
from __future__ import annotations

import asyncio
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "L001-v2"
STILLS = OUT / "stills"
CLIPS = OUT / "clips"
W, H = 1920, 1080
VOICE = "en-US-AndrewNeural"
BG = (11, 15, 13)
ACCENT = (196, 245, 66)
MUTED = (150, 165, 155)
INK = (245, 248, 245)
WARM = (242, 196, 168)
PANEL = (18, 26, 22)

SCRIPT = """Lesson one. What a business is.

I want one clean definition. Not a textbook. Not a motivational speech. A rule you can use.

Here it is.

A business solves a costly problem for people who can pay — and you get paid to solve it.

Say that again in your head. Costly problem. People who can pay. You get paid.

That sentence is the whole lesson. Everything else is support.

If the problem is real, the buyer can pay, and money moves to you for the solution, you are in business territory.

If money never moves, you may still be learning. You may still be building skill. You may still be doing useful work. You are not running a business yet.

Hold that distinction. It protects you from confusing activity with a firm.

Now the structure. Every real business has three parts. Only three.

Customer. The person with the problem who can pay.

Offer. What they buy from you to fix that problem.

Delivery. How you keep the promise after they pay.

Customer. Offer. Delivery.

Miss one, and you still have a project — not a firm. A beautiful website with no paying customer is not a firm. A free favor with no offer is not a firm. An offer you cannot deliver is not a firm.

Here is the contrast in one line.

No payment means it is not a business yet.

Not because the work is worthless. Because a business is a paid exchange, not a hope and not a hobby with branding.

Before the next lesson, write one sentence by hand.

I help blank do blank so they can blank.

Make it specific. Name a real person type. Name a real outcome. Ugly wording is fine. Vague wording is not.

When that sentence is clear, you are ready for the next lesson: startup versus operating company.
"""

# Relative weights for timing (sum arbitrary; scaled to audio)
BEATS = [
    ("00-title", 0.04),
    ("01-hook", 0.08),
    ("02-definition", 0.22),
    ("03-three-parts", 0.28),
    ("04-contrast", 0.16),
    ("05-action", 0.16),
    ("06-end", 0.06),
]


def font(size: int) -> ImageFont.FreeTypeFont:
    for p in (
        "/System/Library/Fonts/Supplemental/Arial Black.ttf",
        "/Library/Fonts/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    ):
        try:
            return ImageFont.truetype(p, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def atmosphere() -> Image.Image:
    """Dark cinematic base: soft desk glow + screen-stage feel."""
    im = Image.new("RGB", (W, H), BG)
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    g = ImageDraw.Draw(glow)
    # screen-like rectangle glow center
    g.rounded_rectangle([280, 160, 1640, 820], radius=28, fill=(40, 70, 50))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    im = Image.blend(im, glow, 0.35)
    # subtle bokeh dots
    d = ImageDraw.Draw(im)
    for i, (x, y, r) in enumerate(
        [(220, 180, 6), (1700, 220, 5), (240, 900, 7), (1680, 860, 5), (960, 980, 4)]
    ):
        col = (30 + i * 4, 45 + i * 3, 35)
        d.ellipse([x - r, y - r, x + r, y + r], fill=col)
    # top accent hairline
    d.rectangle([0, 0, W, 2], fill=ACCENT)
    # fake desk reflection strip
    d.rectangle([0, 1000, W, H], fill=(8, 10, 9))
    for x in range(0, W, 8):
        shade = 10 + (x % 40) // 10
        d.line([(x, 1000), (x, H)], fill=(shade, shade + 2, shade))
    return im


def draw_mark(d: ImageDraw.ImageDraw) -> None:
    d.rounded_rectangle([64, 40, 208, 82], radius=10, fill=WARM)
    d.text((80, 48), "DigProg", font=font(24), fill=(40, 28, 20))


def still_title() -> Image.Image:
    im = atmosphere()
    d = ImageDraw.Draw(im)
    draw_mark(d)
    d.text((120, 400), "Lesson 01", font=font(34), fill=MUTED)
    d.text((120, 460), "What a business is", font=font(78), fill=INK)
    return im


def still_hook() -> Image.Image:
    im = atmosphere()
    d = ImageDraw.Draw(im)
    # center claim on "screen"
    d.rounded_rectangle([360, 340, 1560, 640], radius=22, fill=PANEL)
    tw = "Paid problem-solving"
    f = font(64)
    bb = d.textbbox((0, 0), tw, font=f)
    d.text(((W - (bb[2] - bb[0])) / 2, 450), tw, font=f, fill=INK)
    return im


def still_definition() -> Image.Image:
    im = atmosphere()
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([300, 300, 1620, 720], radius=22, fill=PANEL)
    d.text((360, 380), "Solve a costly problem.", font=font(56), fill=INK)
    d.text((360, 500), "Get paid for it.", font=font(56), fill=ACCENT)
    return im


def still_three_parts() -> Image.Image:
    im = atmosphere()
    d = ImageDraw.Draw(im)
    boxes = [("Customer", "who pays"), ("Offer", "what they buy"), ("Delivery", "promise kept")]
    gap = 40
    bw = 480
    total = 3 * bw + 2 * gap
    x0 = (W - total) // 2
    y = 360
    for i, (t, s) in enumerate(boxes):
        x = x0 + i * (bw + gap)
        d.rounded_rectangle([x, y, x + bw, y + 280], radius=20, fill=PANEL, outline=ACCENT, width=2)
        d.text((x + 36, y + 70), t, font=font(44), fill=INK)
        d.text((x + 36, y + 150), s, font=font(28), fill=MUTED)
        if i < 2:
            cx = x + bw + gap // 2
            d.polygon([(cx - 14, y + 130), (cx + 12, y + 140), (cx - 14, y + 150)], fill=ACCENT)
    return im


def still_contrast() -> Image.Image:
    im = atmosphere()
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([280, 380, 1640, 620], radius=22, fill=PANEL)
    text = "No payment → not a business yet"
    f = font(48)
    bb = d.textbbox((0, 0), text, font=f)
    d.text(((W - (bb[2] - bb[0])) / 2, 460), text, font=f, fill=INK)
    return im


def still_action() -> Image.Image:
    im = atmosphere()
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([280, 320, 1640, 700], radius=22, fill=PANEL)
    d.text((360, 400), "I help ___ do ___", font=font(52), fill=INK)
    d.text((360, 520), "so they can ___.", font=font(52), fill=ACCENT)
    return im


def still_end() -> Image.Image:
    im = atmosphere()
    d = ImageDraw.Draw(im)
    d.text((120, 470), "Next: Startup vs operating company", font=font(42), fill=MUTED)
    return im


MAKERS = [
    still_title,
    still_hook,
    still_definition,
    still_three_parts,
    still_contrast,
    still_action,
    still_end,
]


async def tts(path: Path) -> None:
    import edge_tts

    await edge_tts.Communicate(SCRIPT.strip(), VOICE).save(str(path))


def probe(path: Path) -> float:
    return float(
        subprocess.check_output(
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
    )


def make_clip(still: Path, seconds: float, out: Path) -> None:
    """Subtle editorial push-in (MEDIUM-LOW motion)."""
    frames = max(1, int(seconds * 30))
    # zoom from 1.0 to ~1.06 over the clip
    z_end = 1.06
    cmd = [
        "ffmpeg",
        "-y",
        "-loop",
        "1",
        "-i",
        str(still),
        "-vf",
        (
            f"scale=8000:-1,"
            f"zoompan=z='min(1+0.06*on/{frames},{z_end})':"
            f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
            f"d={frames}:s={W}x{H}:fps=30,"
            f"format=yuv420p"
        ),
        "-t",
        f"{seconds:.3f}",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-an",
        str(out),
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def concat_clips(paths: list[Path], out: Path) -> None:
    lst = OUT / "clips.txt"
    lst.write_text("".join(f"file '{p}'\n" for p in paths))
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(lst),
            "-c",
            "copy",
            str(out),
        ],
        check=True,
        capture_output=True,
    )


def mux(video: Path, audio: Path, out: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(video),
            "-i",
            str(audio),
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-shortest",
            "-movflags",
            "+faststart",
            str(out),
        ],
        check=True,
        capture_output=True,
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    STILLS.mkdir(parents=True, exist_ok=True)
    CLIPS.mkdir(parents=True, exist_ok=True)

    voice = OUT / "voice.mp3"
    print("TTS…")
    asyncio.run(tts(voice))
    dur = probe(voice)
    print(f"voice {dur:.1f}s")

    # ensure ~2:30–3:00: if voice short, that's ok; if long, use it
    weights = [w for _, w in BEATS]
    tw = sum(weights)
    seconds = [dur * (w / tw) for w in weights]

    print("Stills…")
    still_paths = []
    for (name, _), maker in zip(BEATS, MAKERS):
        p = STILLS / f"{name}.jpg"
        maker().save(p, quality=95)
        still_paths.append(p)

    print("Clips (editorial zoom)…")
    clip_paths = []
    for (name, _), still, sec in zip(BEATS, still_paths, seconds):
        cp = CLIPS / f"{name}.mp4"
        print(f"  {name} {sec:.1f}s")
        make_clip(still, sec, cp)
        clip_paths.append(cp)

    silent = OUT / "video_silent.mp4"
    print("Concat…")
    concat_clips(clip_paths, silent)

    final = OUT / "L001-what-a-business-is.mp4"
    print("Mux…")
    mux(silent, voice, final)
    Image.open(still_paths[2]).save(OUT / "cover.jpg", quality=95)
    print("DONE", final)
    print("DURATION", f"{probe(final):.1f}s")


if __name__ == "__main__":
    main()
