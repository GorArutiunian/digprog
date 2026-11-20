# TO SARGIS — DigProg handoff (videos + program + book)

**From:** Gor (website / course product / quizzes / progress)  
**To:** Sargis (video creation / motion / narration export)  
**Product:** DigProg — one beginner business course (~100 short lessons)  
**Live site:** https://digprog.vercel.app  
**Repo:** https://github.com/GorArutiunian/digprog  

Read this whole file once. Then open the linked files. Then we talk.

---

## 1) Role split (clear)

| You (Sargis) | Gor |
|--------------|-----|
| Create lesson videos (Remotion / motion / VO) | Landing, waitlist, learn UI, progress, quizzes |
| Follow curriculum order + learning objectives | Course website (DataCamp/Coursera-style, one course) |
| Keep DigProg blue/orange + orange marker motif | Book / site copy / enroll flow |
| Deliver MP4 + captions + timeline per lesson | Wire your finished video into the classroom |

**Do not invent new pedagogy** without talking. Spine is fixed: **Customer → Offer → Delivery**, and **interest ≠ paying demand**.

---

## 2) Absolute stack used so far (video + course)

### Video production (your main stack)

| Tool | Version / note | Why |
|------|----------------|-----|
| **Remotion** | `4.0.545` (`remotion`, `@remotion/cli`, `@remotion/renderer`) | Deterministic 1920×1080 lesson videos |
| **React + TypeScript** | React 19 | Composition UI |
| **SVG / CSS-in-JS in Remotion** | Frame-driven `interpolate` / `spring` | Diagrams, marker, UI mocks |
| **edge-tts** | `en-US-BrianNeural`, rate `+0%` | Narration until ElevenLabs is approved |
| **FFmpeg / ffprobe** | Homebrew | Loudnorm (~−16 LUFS), web compress, posters, contact sheets |
| **Python 3 + venv** | project `.venv` at `content-ops/.venv` | VO concat, timelines, caption generation |

**Project folder for video:**  
`02-course-digprog/course/remotion-lecture/`

**Reference finished lesson (watch this first):**  
`course/output/L001-final/L001-What-a-business-is.mp4`  
Composition id: **`L001Editorial`**  
Source: `course/remotion-lecture/src/L001Editorial.tsx`  
Tokens: `course/remotion-lecture/src/tokens.ts` + `shared/tokens.ts`

### Website / product (Gor — for your awareness)

| Tool | Note |
|------|------|
| Vite + React 19 + React Router | `02-course-digprog/site/` |
| Vercel | Hosting + `/api/waitlist` |
| Waitlist store | GitHub JSONL now; Neon SQL ready (`site/db/001_waitlist.sql`) |
| Optional email | Resend (`RESEND_API_KEY`) |
| Playwright | Site verification scripts |

### Brand (both of you — non-negotiable)

```
Primary blue:   #2457E6
Deep blue:      #102A56
Bright blue:    #7EA6FF
Primary orange: #FF8A3D
Dark orange:    #A83B08
Light bg:       #F6F8FC
Video dark:     #0B1730
Text:           #13233D
Secondary text: #52627A
Light text:     #F7FAFF
```

- Blue = structure / customer / navigation  
- Orange = attention / offer / CTA / recurring **marker**  
- Delivery = deep blue with label  
- White text on orange is weak — use **dark text on orange**

---

## 3) How you install & run the video stack

```bash
# from machine with Node 20+ and ffmpeg
cd 02-course-digprog/course/remotion-lecture
npm install

# preview studio
npx remotion studio src/index.ts

# render the finished L01 composition
npx remotion render src/index.ts L001Editorial ../output/L001-final/L001-What-a-business-is.mp4 --codec=h264
```

Voice pipeline (Python), from content-ops root with `.venv`:

```bash
# edge-tts is already used in prior scripts; install if needed:
# .venv/bin/pip install edge-tts
```

Deliverables per lesson (same pattern as L001):

1. `voice-L0XX.mp3` (loudnorm ≈ −16 LUFS, TP ≤ −1.5 dBTP)  
2. `timeline.json` / alignment  
3. Remotion composition synced to audio  
4. Master MP4 1920×1080 ≥30fps  
5. Web MP4 (crf ~23)  
6. SRT + VTT  
7. Poster jpg  
8. Short storyboard notes  

**Target length:** ~90–120 seconds per lesson (L001 final ≈ **108s**).

---

## 4) Creative / instructional rules (from L001 brief)

**One objective per lesson.** Example L001:  
“Identify the customer, offer, and delivery in a simple business example.”

**Keep:** definition, framework, one worked example, interest vs paying demand, recap + quiz handoff.  
**Remove from early lessons:** hobby spectrum fluff, LLC/barter edge cases, absolute claims (“no revenue = not a business”), “exam ready for everything.”

**Motion:** purposeful (connect, transform, deliver, focus). Recurring orange marker. No particle spam, no endless camera, no talking avatar unless we ask.

**Audio:** speech first; no music during dense explanation unless ducked and licensed.

---

## 5) The program (curriculum) — latest version

**Canonical files (open these):**

- Readable outline: `course/FULL-COURSE-CURRICULUM.md`  
- Full machine file (100 lessons × 8 quiz questions + attachments): `course/FULL-COURSE-CURRICULUM.json`  
- Personal worksheets: `course/attachments/`  
- L001 package: `course/lessons/L001/` + `course/output/L001-final/`

### Levels (= modules)

| Level | ID | Title | Goal |
|------:|----|-------|------|
| 1 | M01 | Foundations | What a business is; DigProg loop |
| 2 | M02 | Pick a lane | Painful problem worth charging for |
| 3 | M03 | Offer | Package something buyable this week |
| 4 | M04 | Proof & first customers | First paying evidence |
| 5 | M05 | Systems | Ship, collect, repeat |
| 6 | M06 | Launch map | 10-step roadmap to live |

**Scale:** **100 lessons** · ~**229 minutes** of video · **8 quiz questions per lesson** · personal worksheets on selected lessons.

**Your first production priority:**  
1. Study L001 fully (video + storyboard + script)  
2. Produce **L002** next (Money words) using same system  
3. Continue Level 1 (M01) before jumping modules  

Maya ($79 invoicing guide) is the recurring worked example — reuse objects for continuity.

---

## 6) The book — latest pre-final draft

**Open:** `book/BOOK-PREFINAL-DRAFT.md`  

Also older spines (reference only):  
- `book/STUDY-GUIDE-V1.md`  
- PDFs in `book/` if you want print reading  

Book = **why + worksheets**. Video = **show the move**. Quiz = **prove it**.  
Pre-final = broader discussion so we can judge the spine before final PDF polish.

Chapters mirror modules: Foundations → Offer → Market → Sales → Systems → Capstone.

---

## 7) UGC / distribution (optional later)

If/when we clip lessons for social: `UGC-100-PER-DAY-GUIDE.md`  
Not your day-1 job. Course videos first.

---

## 8) What “done” looks like for a lesson (your checklist)

- [ ] Script locked to one objective  
- [ ] VO recorded + loudnorm  
- [ ] Timeline / captions accurate (names, $79, Maya)  
- [ ] Remotion composition matches spoken beats (±~200ms on key cues)  
- [ ] Master + web MP4  
- [ ] Poster  
- [ ] Drop in `course/output/L0XX-final/` and ping Gor to mount on site  

---

## 9) How we work week to week

1. Gor ships learn/progress/quiz UI topic-by-topic.  
2. You ship videos in curriculum order.  
3. We review L0XX together (clarity, sync, brand).  
4. Unlock next lesson on the site only when video + quiz are ready enough.

**Talk soon after you finish reading this + watching L001 + skimming the curriculum MD + book pre-final.**

— DigProg / Gor
