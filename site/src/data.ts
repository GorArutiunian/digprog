import paddleCatalog from "./data/paddleCatalog.json";

export const plans = [
  {
    id: "simple" as const,
    name: "Simple",
    price: "$49",
    priceAnnual: "$490",
    priceSuffix: "",
    waitlistPrice: "$34",
    blurb: "Start watching. Limited access for beginners testing the waters.",
    features: ["Course videos only", "Starter study notes", "Community read-only"],
    cta: "Start Simple",
    featured: false,
    paddleProductId: paddleCatalog.products.simple.productId,
    paddlePriceOneTime: paddleCatalog.products.simple.prices.oneTime.id,
    paddlePriceYear: paddleCatalog.products.simple.prices.year.id,
  },
  {
    id: "medium" as const,
    name: "Medium",
    price: "$149",
    priceAnnual: "$1,490",
    priceSuffix: "",
    waitlistPrice: "$104",
    blurb: "The full self-serve path — videos, roadmap, quizzes, and the PDF guide.",
    features: [
      "All ~100 short videos",
      "Video launch roadmap",
      "Short quizzes after modules",
      "Full PDF study guide",
    ],
    cta: "Get Medium",
    featured: true,
    paddleProductId: paddleCatalog.products.medium.productId,
    paddlePriceOneTime: paddleCatalog.products.medium.prices.oneTime.id,
    paddlePriceYear: paddleCatalog.products.medium.prices.year.id,
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "$299",
    priceAnnual: "$2,990",
    priceSuffix: "",
    waitlistPrice: "$209",
    blurb: "Medium plus onboarding that turns your idea into daily assigned tasks.",
    features: [
      "Everything in Medium",
      "Business interest onboarding",
      "Daily assigned launch tasks",
      "Interactive help toward real launch",
    ],
    cta: "Go Pro",
    featured: false,
    paddleProductId: paddleCatalog.products.pro.productId,
    paddlePriceOneTime: paddleCatalog.products.pro.prices.oneTime.id,
    paddlePriceYear: paddleCatalog.products.pro.prices.year.id,
  },
] as const;

export const curriculum = [
  {
    module: "01 · Wake up",
    title: "Why most “start a business” advice is water",
    lessons: 8,
    minutes: 24,
  },
  {
    module: "02 · Pick a lane",
    title: "Find a problem worth charging for",
    lessons: 12,
    minutes: 36,
  },
  {
    module: "03 · Offer",
    title: "Package something people buy this week",
    lessons: 14,
    minutes: 42,
  },
  {
    module: "04 · Proof",
    title: "First customers without a brand",
    lessons: 16,
    minutes: 48,
  },
  {
    module: "05 · Systems",
    title: "Ship, collect, repeat",
    lessons: 18,
    minutes: 54,
  },
  {
    module: "06 · Launch map",
    title: "10-step roadmap to a live business",
    lessons: 20,
    minutes: 60,
  },
] as const;

export const roadmap = [
  "Clarify the problem",
  "Name a buyer",
  "Draft a one-line offer",
  "Price it simply",
  "Build a tiny landing page",
  "Talk to 10 humans",
  "Close first sale",
  "Deliver once",
  "Capture a testimonial",
  "Systematize the week",
] as const;

export const classroomLessons = [
  { id: "L001", title: "What a business is", done: false, current: true },
] as const;

export const faqs = [
  {
    q: "Is DigProg another 40-hour course?",
    a: "No. ~100 videos at ~3 minutes each — about 6 hours total — plus a study guide and quizzes.",
  },
  {
    q: "Who is Zorik?",
    a: "Zorik is the silent on-screen hero. The author narrates while Zorik acts out the moves.",
  },
  {
    q: "What’s the difference between Medium and Pro?",
    a: "Medium is full self-serve content. Pro adds onboarding that turns your business interest into daily assigned tasks after you progress.",
  },
  {
    q: "Do you guarantee results?",
    a: "We guarantee clarity of path and refundable first 14 days on Medium/Pro if the method isn’t a fit — mock policy for this prototype.",
  },
  {
    q: "Is payment real in this prototype?",
    a: "No. Checkout and membership are visual mocks with fake data only.",
  },
] as const;

export const announcements = [
  "Live Q&A Thursday 6pm PT — bring one stuck question.",
  "Bonus vault teaser: AI idea helper landing next month.",
  "Student showcase: 15 live businesses from this course (coming).",
] as const;

export const tools = [
  { name: "Offer one-pager PDF", type: "PDF", status: "ready" },
  { name: "Customer interview script", type: "PDF", status: "ready" },
  { name: "Profit calculator", type: "Tool", status: "ready" },
  { name: "Idea scorecard", type: "Tool", status: "ready" },
  { name: "Bonus Vault", type: "Vault", status: "locked" },
] as const;

export const channels = [
  { name: "#wins", members: 214, preview: "Closed my first $80 this morning" },
  { name: "#stuck", members: 189, preview: "How do I price consulting lightly?" },
  { name: "#accountability", members: 156, preview: "Week 3 check-in thread" },
  { name: "#showcase", members: 98, preview: "Live businesses teaser board" },
] as const;

export const showcase = [
  { name: "ParcelPath", niche: "Local delivery ops", stage: "Live" },
  { name: "BriefKitchen", niche: "Meal-plan newsletter", stage: "Live" },
  { name: "FixitDesk", niche: "Home repair leads", stage: "Soft launch" },
] as const;

export const events = [
  { title: "Office hours with the creator", when: "Thu · 6:00 PM PT", status: "Upcoming" },
  { title: "Offer teardown clinic", when: "Replay · Mar 02", status: "Replay" },
  { title: "First-sale sprint kickoff", when: "Replay · Feb 18", status: "Replay" },
] as const;
