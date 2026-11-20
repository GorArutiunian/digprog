# L001 verification report

**Lesson:** DigProg · What a business is  
**Date:** 2026-11-20  
**Composition:** `L001Editorial` · 1920×1080 · 30 fps · **107.95 s** (in 90–120s target; ~108s with end hold)

## Environment (observed)

| Item | Status |
|------|--------|
| Remotion 4.0.545 | Used for render |
| FFmpeg / ffprobe | Used for loudness, compress, contact frames |
| Edge TTS BrianNeural +0% | Final VO (ElevenLabs key **not** present) |
| Vite React site | Extended `Classroom` — not rewritten |
| Playwright | 6/6 checks passed against preview |
| YouTube ref R_ErmTs7g9I | Prior session frame inspection; principles only |
| DataCamp Excel lesson | Not logged in this session — used documented UX observations |

## Video checks

| Check | Evidence |
|-------|----------|
| Duration 90–120s | ffprobe **107.95 s** |
| Resolution / fps | 1920×1080 @ 30 |
| Frame count | 3238 frames |
| Loudness | Integrated ≈ **−16 LUFS**, true peak ≈ **−1.5 dBTP** (voice master) |
| Scenes vs narration | Timeline-driven `S` constants; contact frames at 5s (hook+zero), 58s (Maya offer), 96s (recap CTA) |
| Captions | `L001.srt` / `L001.vtt` from sentence alignment |
| No music | Speech-only mix |
| Orange contrast fix | Active Offer nodes use **dark text on orange** (re-rendered) |

### Limitations (video)

- Full continuous watch was assisted by contact sheets + motion test (0–8s) + style frames; not every intermediate frame was watched in real time.
- Remotion uses system font stack for Manrope (Google Fonts on web); embed WOFF2 for pixel-identical video type.
- Edge TTS is a stand-in until a licensed ElevenLabs (or equivalent) voice is authorized — **not** disguised as that service.
- Delivery card appears mid–example_parts (~60s); early example frames correctly show Customer/Offer only.

## Website checks (Playwright)

All passed (`site/scripts/verify-l001.mjs` → `test-results/l001/`):

1. Desktop lesson loads video  
2. Transcript seek (~10.8s)  
3. Quiz feedback only after submit  
4. Mobile: no horizontal overflow  
5. Tablet screenshot  
6. Play control keyboard-focusable  

### Limitations (web)

- Progress persisted in **localStorage** (`digprog-l001-progress-v1`) — prototype, not a backend.
- Previous/Next disabled (only L01 exists).
- Captions rely on browser `<track>`; native UI varies by browser.
- Reduced-motion: site CSS disables transitions; video remains user-controlled.

## Quality categories (evidence-based)

| Category | Observation | Remaining weakness |
|----------|-------------|-------------------|
| Teaching clarity | Single objective; Maya example; interest≠payment; no spectrum/LLC claims | Could tighten delivery-scene reading hold |
| Motion quality | Purposeful marker, transforms, dimming; no particle/camera spam | Some scenes still fade rather than match-cut |
| Typography / composition | Large labels, caption-safe bottom band, brand badge | Manrope not embedded in Remotion binary |
| Voice | Warm BrianNeural ~131–144 WPM with holds; clear prices | Not a premium licensed studio voice |
| Sync | Audio-led timeline; section starts matched to VO | Sub-200ms word↔glyph polish not exhaustively measured |
| Web usability | DataCamp-like player + panel + practice | Member shell chrome still older mint theme beside L01 |
| Brand consistency | Shared `#2457E6` / `#FF8A3D` tokens in video + L01 UI | Landing/member chrome not fully retokenized |

## Deliverable index

- Master: `L001-What-a-business-is.mp4`
- Web: `L001-What-a-business-is.web.mp4` → site `public/lessons/L001/video.mp4`
- Voice: `voice-l001-final.mp3` + `voice-config.json` + `pronunciation-notes.md`
- Captions / transcript / timeline / alignment / poster / storyboard / quiz / manifest
- Run instructions: `RUN.md`
- Editable source: `remotion-lecture/src/L001Editorial.tsx`
