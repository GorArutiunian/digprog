# Course research — open books + LMS options

## Open / free knowledge sources (attribute; rewrite in DigProg voice)

| Source | License | Use for |
|--------|---------|---------|
| [OpenStax Entrepreneurship](https://openstax.org/books/entrepreneurship/) | CC BY-NC-SA | Foundations, small business, opportunity |
| [Entrepreneurship Essentials](https://www.entrepreneurshipessentials.com/) | CC BY 4.0 | Discover → Design → Test → Launch spine |
| [Entrepreneurship and Innovation Toolkit](https://pressbooks.bccampus.ca/entrepreneurship/) (Swanson) | CC BY-SA | Models, finance, lean loop |
| [Innovative Business Mindset](https://wtcs.pressbooks.pub/innovativebusinessmindset/) | CC BY | Entrepreneur vs not; mindset interactives |
| [The Real Startup Book](https://realstartupbook.com/) | CC | Lean experiments |
| Business Model Canvas (Strategyzer materials — check commercial terms) | often free for education | Offer design lessons |
| Public domain / your original DigProg case | own | Capstone story |

**Rule:** Never paste OER text verbatim into paid product without following the license (NC on OpenStax = careful for commercial DigProg; prefer CC BY sources for paid course, or heavily rewrite + cite).

## LMS / classroom (video → quiz → unlock)

| Option | Why | License | Fit |
|--------|-----|---------|-----|
| Extend `DigProg-site-mock` | Already branded | yours | **Fastest for v1** |
| [hello2himel/feyn](https://github.com/hello2himel/feyn) | Video then comprehension Qs | AGPL | Strong pedagogy, AGPL share-alike |
| [enyojoo/easelms](https://github.com/enyojoo/easelms) | Full LMS + Stripe | AGPL | Heavy |
| [bensblueprints/course-builder-lms-mvp](https://github.com/bensblueprints/course-builder-lms-mvp) | MIT-ish course+quiz+Stripe | MIT | Good if mock too thin |
| [predictivelabsai/FastLMS](https://github.com/predictivelabsai/FastLMS) | Quizzes + XP | MIT | Optional gamification |

**Recommendation:** Keep DigProg mock → add real lesson JSON + quiz gate + Stripe. Don’t adopt AGPL unless OK open-sourcing the product site.

## Free video for lessons (~3 min)

Same as space 03 but **horizontal or vertical classroom player**: Remotion + edge-tts, one idea per lesson, on-screen bullets. No stock subscription required.
