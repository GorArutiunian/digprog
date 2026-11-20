# DigProg L001 — run, render, update

## Paths

- Remotion project: `02-course-digprog/course/remotion-lecture`
- Lesson package: `02-course-digprog/course/lessons/L001`
- Deliverables: `02-course-digprog/course/output/L001-final`
- Site: `02-course-digprog/site` (lesson at `/app/classroom`)
- Shared tokens: `02-course-digprog/shared/tokens.ts` (+ `tokens.css`)

## Preview site

```bash
cd 02-course-digprog/site
npm install
npm run dev
# open http://localhost:5173/app/classroom
```

## Re-render video

```bash
cd 02-course-digprog/course/remotion-lecture
npx remotion render src/index.ts L001Editorial ../output/L001-final/L001-What-a-business-is.mp4 --codec=h264
# then recompress + copy into site/public/lessons/L001/
```

## Update narration

1. Edit script sections in the voice generation script / `L001-narration-script.txt`
2. Regenerate `public/voice-l001-final.mp3` + `timeline.json`
3. Update scene constants in `src/L001Editorial.tsx` (`S` object)
4. Refresh captions from timeline sentences
5. Re-render

## Add a later lesson

1. Copy `lessons/L001/` → `lessons/L00N/`
2. Create `L00NEditorial.tsx` + register in `Root.tsx`
3. Point site data + `public/lessons/L00N/` at the new manifest
4. Keep using `shared/tokens.ts` for color/type

## Voice note

Final VO uses Edge TTS `en-US-BrianNeural` at `+0%` (ElevenLabs key not present). Replace with licensed ElevenLabs when authorized; keep timestamps aligned.
