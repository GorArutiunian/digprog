# DigProg

Waitlist landing, L01 classroom demo, full curriculum, pre-final book draft, and UGC guide.

## Live

- **GitHub:** https://github.com/GorArutiunian/digprog
- **Site (Vercel):** see latest production URL after deploy (`site/` is the app root)
- **Waitlist store:** private repo `digprog-waitlist-data` (JSONL) — upgrade to Neon via `DATABASE_URL` anytime

## Local site

```bash
cd site
npm install
npm run dev
```

Waitlist API needs env (see `site/.env.example`). On Vercel, `GITHUB_TOKEN` + `WAITLIST_GITHUB_REPO` are set. Prefer Neon for production scale:

1. Create Neon DB  
2. Run `site/db/001_waitlist.sql`  
3. Set `DATABASE_URL` on Vercel (Neon takes priority over GitHub store)

## Key files

| Path | What |
|------|------|
| `site/` | Vite + React + `/api/waitlist` |
| `course/FULL-COURSE-CURRICULUM.json` | 100 lessons, 8q quizzes, attachments |
| `book/BOOK-PREFINAL-DRAFT.md` | Pre-final field guide |
| `UGC-100-PER-DAY-GUIDE.md` | Social distribution OS |
| `course/output/L001-final/` | Finished L01 video package |

## Vercel monorepo note

Project Root Directory must be **`site`** so `/api` serverless functions and Vite `dist/` resolve correctly.
