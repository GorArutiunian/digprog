# DigProg UGC — full professional guide (30 videos/day)

**Goal:** From tomorrow, post short recommendation-style videos that send people to the waitlist (`https://digprog.vercel.app`).  
**Waitlist window:** ~70 days → **400–500+ posts** minimum (30/day × 17 days already exceeds 500; 30×70 = 2,100 capacity).  
**Hard product deadline:** **1 December 2026** — course + book + payment + maintenance must be live (waitlist already is).

---

## 1) What UGC actually is (clear)

**UGC = User-Generated Content *style***: videos that look like a real person recommending a product to peers — not a polished studio ad.

| Type | Who is on camera | Cost | Trust | Notes for DigProg |
|------|------------------|------|-------|-------------------|
| **A. Real UGC** | Real creators / friends / freelancers | $$ or trade | Highest | Best long-term. Script + brief + pay $15–50/clip or product access |
| **B. Founder UGC** | You or Sargis on phone | Free | High | Fastest honest start tomorrow |
| **C. AI UGC** | Photo/avatar + lip-sync voice | Free–low on your PC/GPU | Medium | Scales to 30/day; disclose “AI avatar” if platform requires; never fake fake testimonials as real students |

DigProg should run **B immediately**, add **C for volume**, and recruit **A** when budget allows.

This is **not** the Remotion course-lesson stack. Course videos = teaching. UGC = **distribution / sales** to the waitlist.

---

## 2) Math that makes 30/day possible

You do **not** invent 30 unique stories by hand.

| Layer | Daily count | How |
|------|-------------|-----|
| Master scripts | 6–8 | From curriculum hooks |
| Avatar / face takes | 3–5 | Reuse faces × new audio |
| Formats | 4 | Hook / myth / tip / CTA |
| Aspect | 1 (9:16) | TikTok + Reels + Shorts |
| Accounts | 3–5 | Same export, staggered captions |
| **Posts** | **30+** | 8 uniques × 4 accounts ≈ 32 |

**70-day target:** 500 posts ≈ **~8 posts/day average**, or **30/day for ~17 active days**. Prefer sustained 15–30/day once pipeline works.

---

## 3) Free / nearly-free stack (PC + GPU + GitHub)

### Core (required)

| Step | Free tool | Role |
|------|-----------|------|
| Scripts | Cursor / local LLM / Notion | Hook bank |
| Voice | **edge-tts** (already in DigProg) or Piper TTS | Narration |
| Face stills | **ThisPersonDoesNotExist** / generated portraits you own | Avatar source (license carefully) |
| Talking head | **SadTalker** (Apache 2.0) or **Ditto** (Apache 2.0) | Image + audio → talking clip |
| Alt motion | **LivePortrait** (MIT) | Photo + driving video (not audio alone) |
| Orchestration | **ComfyUI** + LivePortrait / Wan nodes | Batch GPU jobs |
| Edit / captions | **CapCut** desktop (free) | Captions, CTA endcard, brand |
| Logo / endcard | DigProg `dp` mark | Always |
| Posting | Native apps + later Buffer/Later free tiers | Stagger |

### Avoid for commercial DigProg

- **Wav2Lip** open weights → README restricts non-commercial  
- Scraped celebrity faces / real people’s faces without consent  
- Fake “I made $10k with DigProg” claims  

### Recommended local pipeline (NVIDIA GPU ideal; Apple Silicon slower)

```text
Script → edge-tts WAV/MP3
     → SadTalker/Ditto (portrait + audio) → raw MP4
     → CapCut preset (captions + DigProg endcard + waitlist URL)
     → Export 1080×1920
     → Post to 3–5 accounts
```

**GitHub repos to clone (start here):**

1. https://github.com/OpenTalker/SadTalker  
2. https://github.com/antgroup/ditto-talkinghead  
3. https://github.com/KlingAIResearch/LivePortrait  
4. https://github.com/comfyanonymous/ComfyUI  

Install once on the GPU machine. Batch overnight.

### No-GPU fallback (start tomorrow)

1. Film yourself/Sargis on phone (true UGC).  
2. Or Remotion “recommendation card” videos (see example we shipped) until talking-head GPU is ready.  
3. CapCut captions + waitlist CTA.

---

## 4) Where to get “people” / models

| Source | How | Rule |
|--------|-----|------|
| You / Sargis | Phone selfie videos | Best trust |
| Friends | 5–10 clips for early access | Written permission |
| Freelance UGC | Instagram/TikTok “UGC creator” + $20–40 | Contract + usage rights |
| AI portraits | Generate once, store in `ugc/faces/` | Don’t impersonate real public figures |
| Stock talking-head SaaS | Only if free trial leftover | Prefer local open-source |

**Consent file:** keep a sheet `name | date | permission | clip IDs`.

---

## 5) Creative formula (every video)

**Length:** 15–35 seconds. Mute-first captions.

1. **Hook (0–2s):** Pain / myth  
2. **Person (2–12s):** “I used to think friends liking my app = business…”  
3. **Point (12–22s):** Customer → Offer → Delivery / DigProg short lessons  
4. **CTA (last 3–5s):** “Join the DigProg waitlist — 30% early bird” + URL  

**Never:** fake student results, fake waitlist numbers, scraped course footage.

### Hook bank (seed — expand to 100)

1. Friends love your app. Will they pay?  
2. Interest is not paying demand.  
3. A business has three parts…  
4. Stop building. Name who buys.  
5. $79 guide. Who’s the customer?  
6. Most courses are 40 hours of water.  
7. One lesson. One quiz. One action.  
8. Waitlist open — early bird 30% off.

---

## 6) Daily operating system (90–150 min)

### Morning (45–60 min) — produce

1. Pick 8 hooks from bank / curriculum.  
2. Generate 8 VO takes (`edge-tts`).  
3. Run batch talking-head OR film 8 phone takes.  
4. Drop into CapCut DigProg preset (logo, captions, orange CTA).  

### Afternoon (30–45 min) — multiply & post

1. Export 8× 9:16 masters.  
2. Duplicate captions per account (don’t spam identical text same minute).  
3. Post 8 × 4 accounts = 32. Stagger 15–40 min.  
4. Pin comment: `Waitlist → https://digprog.vercel.app`  

### Night (15 min) — measure

- Waitlist signups (GitHub waitlist JSONL / Neon later)  
- Keep top hooks; kill bottom hooks  

### Roles

| Person | Owns |
|--------|------|
| Gor | Site, waitlist, payment by Dec 1, CapCut brand kit, posting sheet |
| Sargis | Course Remotion lessons + can run GPU talking-head batch |

---

## 7) Calendar (must-hit)

| Date | Milestone |
|------|-----------|
| **Tomorrow** | First real posts (founder or Remotion UGC example) |
| **1 Dec 2026** | Full course + book + payments + maintenance ready |
| **+70 days** | ≥400–500 UGC posts shipped; waitlist converted to launch |

Dec 1 product checklist (Gor): enroll/pay, learn levels, L001+pipeline, book PDF, waitlist→student email, uptime/monitoring.

---

## 8) Account strategy

- 1–2 main DigProg brand accounts  
- 2–3 clip accounts (same creative, different handles)  
- Don’t mass-post identical files to one account in 2 minutes  
- Track strikes; rotate formats  

---

## 9) Compliance / platform risk

- Label AI avatars if required  
- No impersonation of real influencers  
- Music: CapCut free library or mute  
- Claims: educational waitlist, not income guarantees  

---

## 10) Example video shipped in this repo

Path: `course/output/UGC-example/UGC-Waitlist-Hook.mp4`  
Composition: Remotion `UGCWaitlistHook` (9:16 sales recommendation → waitlist).  

Use as **template** for CapCut / talking-head overlays until GPU avatars are online.

---

## 11) First 48 hours (do this)

1. Create `ugc/` folders: `hooks/ faces/ voice/ raw/ export/ posted-log.csv`  
2. Post **at least 5** videos tomorrow (phone or example Remotion).  
3. Clone SadTalker on GPU machine; run one test image+audio.  
4. Fill hook bank to 50 lines.  
5. Gor: payment + course polish toward Dec 1.  

**Success signal:** waitlist grows (even 5–20 people teaches the funnel). Volume without honesty kills the brand — keep claims clean.
