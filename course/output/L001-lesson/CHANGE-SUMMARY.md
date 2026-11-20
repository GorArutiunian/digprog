# L001 production upgrade — change summary

## Deliverables (this folder)

| File | Purpose |
|------|---------|
| `L001-What-a-business-is.mp4` | Finished 1080p / 30fps lesson (~106s) |
| `voice-l001-lesson.mp3` | Final narration audio |
| `L001-narration-script.txt` | Final script |
| `L001-What-a-business-is.srt` / `.vtt` | Captions |
| `L001-quiz.html` / `L001-quiz.json` | Separate post-video quiz |
| `timeline.json` | Audio-led section timing |
| `REFERENCE-ANALYSIS.md` | What was observed in the Opus reference |

## Editable source

- `02-course-digprog/course/remotion-lecture/src/L001Pro.tsx` (elevated motion composition)
- `Root.tsx` composition id: `L001Pro`
- Assets: `public/voice-l001-lesson.mp3`, `public/sfx-*.mp3`

## Visual upgrade vs prior lesson cut

- Full animated scenes (phone reactions → paid:0, connected framework, desk → guide morph, download path, Maya assembly, evidence contrast, framework reassembly)
- Softer depth/parallax stage, corner framing, coherent vector illustration system
- Meaning-led motion + brief holds; subtle SFX only on meaningful beats
- Same educational constraints: one objective, Maya example only, no quiz answers in-video, no removed absolute claims restored

## Checks performed

- Reference frames inspected (see REFERENCE-ANALYSIS.md)
- Runtime ≈ **106.2s** (90–120s window)
- Still-frame checks: hook, offer, Maya example, recap
- Export plays as 1920×1080 @ 30fps
- Quiz remains separate (`L001-quiz.html`)

## Remaining limitations

- Cannot claim full uninterrupted reference scrub (ad + download partial); craft notes are from inspected frames
- Remotion/CSS illustration ceiling is below Claude Opus music-video compositing; this is the elevated Cursor stack version
- Captions remain sentence-level from Edge TTS boundaries
- No underscore music bed (speech prioritized)
