# DigProg webpage plan (DataCamp logic, no bloat)

**Base:** upgrade existing `Desktop/DigProg-site-mock` — do not rebuild from scratch.  
**Rule:** only pages that sell or teach. No fake Discord empire UI in v1.

## Public pages

| Page | Purpose | Content (short) |
|------|---------|-----------------|
| Landing | Convert → free module | Brand DigProg; promise; what’s inside; sample lesson; curriculum accordion; pricing; FAQ; CTA |
| Pricing | Choose plan | Starter / Builder / Operator (honest diffs) |
| Checkout | Pay | Stripe; email → account; instant access note |
| Login | Return | Email/password or magic link |
| Free lesson | Funnel | Module 0–1 unlocked without pay |

## Member pages (classroom)

| Page | Purpose |
|------|---------|
| Dashboard | Resume + % + roadmap + streak (light) |
| Classroom | Sidebar modules; **video → quiz → unlock next** |
| Book / Tools | PDF field guide + worksheets |
| Profile / billing | Plan, refunds, password |

**Defer:** community, live events, AI tutor, student showcase (teaser only on landing).

## Classroom interaction model
1. Play lesson video (host: YouTube unlisted or Cloudflare later; start local/files)  
2. Show quiz (2–4 Q) or micro-task  
3. Pass → mark complete → unlock next lesson id  
4. Fail → retry + link to book chapter  
5. Module projects (offer canvas, outreach log) required for capstone  

## Data shape (keep tiny)
```json
{
  "modules": [{ "id": 0, "title": "...", "lessons": [
    { "id": "L001", "title": "...", "video": "url", "bookChapter": "Ch0", "quizId": "Q001" }
  ]}],
  "quizzes": [{ "id": "Q001", "pass": 0.7, "questions": [] }]
}
```

## Payments
- Stripe Checkout (fees only when sold)  
- Webhook → grant plan entitlements  
- Free tier = M0–M1 only  

## Build order
1. Lesson JSON from `course/CURRICULUM-120.md`  
2. Quiz gate in classroom  
3. Stripe + free module  
4. Wire real videos as they render  
5. Polish landing copy from book Ch0–1  

## Brand
Hero = DigProg name + one promise. No purple AI cliché. Reuse mock visual direction.
