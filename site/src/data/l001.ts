export const l001Lesson = {
  id: "L001",
  slug: "what-a-business-is",
  module: "01 · Foundations",
  title: "What a business is",
  durationLabel: "1:48",
  durationSeconds: 107.93,
  objective: "Identify the customer, offer, and delivery in a simple business example.",
  videoSrc: "/lessons/L001/video.mp4",
  posterSrc: "/lessons/L001/poster.jpg",
  captionsSrc: "/lessons/L001/captions.vtt",
  summary:
    "A business exchanges customer value for payment. Start with three parts—customer, offer, and delivery—and use Maya’s invoicing guide as a worked example. Interest from friends is useful, but it is not the same as paying demand.",
} as const;

export type TranscriptSection = {
  id: string;
  title: string;
  start: number;
  end: number;
  text: string;
};

export const l001Transcript: TranscriptSection[] = [
  {
    id: "hook",
    title: "Interest vs payment",
    start: 0.0,
    end: 9.24,
    text: "You built an app. Your friends love it. Does that mean customers will pay? Not yet—you have evidence of interest, but not of paying demand.",
  },
  {
    id: "framework",
    title: "Three parts",
    start: 10.84,
    end: 21.76,
    text: "A business provides something customers value in exchange for payment. To understand how it works, start with three parts: customer, offer, and delivery.",
  },
  {
    id: "customer",
    title: "Customer",
    start: 23.56,
    end: 29.51,
    text: "The customer is the person or organization buying. Ask: who are they, and what do they need?",
  },
  {
    id: "offer",
    title: "Offer",
    start: 30.91,
    end: 36.58,
    text: "The offer is what they can buy: a clear product or service, its price, and what is included.",
  },
  {
    id: "delivery",
    title: "Delivery",
    start: 37.98,
    end: 45.87,
    text: "Delivery is how they receive what you promised. Payment can happen before or after delivery, depending on the arrangement.",
  },
  {
    id: "example_intro",
    title: "Maya example",
    start: 47.87,
    end: 53.32,
    text: "For example, Maya sells a seventy-nine-dollar invoicing guide to freelance designers.",
  },
  {
    id: "example_parts",
    title: "Worked parts",
    start: 54.32,
    end: 65.07,
    text: "Her customers are freelance designers who need help organizing invoices. Her offer is the guide for seventy-nine dollars. She delivers it through a download link.",
  },
  {
    id: "contrast",
    title: "Compare evidence",
    start: 67.47,
    end: 82.78,
    text: "Now compare that with an app that friends praise but nobody buys. The feedback may be useful. It does not yet show that customers will pay. A purchase gives stronger evidence of paying demand, although one sale does not prove long-term success.",
  },
  {
    id: "recap",
    title: "Recap questions",
    start: 84.78,
    end: 91.55,
    text: "When you examine an idea, ask: who is the customer, what is the offer, and how will it be delivered?",
  },
  {
    id: "quiz",
    title: "Quiz handoff",
    start: 93.15,
    end: 98.43,
    text: "In the quiz, you'll identify these three parts and spot what is missing in a new example.",
  },
];

export type QuizChoice = { id: string; text: string };
export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: QuizChoice[];
  correct: string;
  feedback: string;
};

export const l001Quiz: {
  questions: QuizQuestion[];
  application: {
    prompt: string;
    rubric: string[];
    note: string;
  };
} = {
  questions: [
    {
      id: "q1",
      prompt:
        "Maya sells a $79 invoicing guide to freelance designers and sends buyers a download link. Which correctly identifies Customer → Offer → Delivery?",
      choices: [
        { id: "a", text: "Maya → freelance designers → $79" },
        { id: "b", text: "Freelance designers → the $79 invoicing guide → download link" },
        { id: "c", text: "Download link → invoicing → freelance designers" },
      ],
      correct: "b",
      feedback:
        "The customer buys, the offer specifies what they receive and its price, and delivery provides access to it.",
    },
    {
      id: "q2",
      prompt:
        "Leo builds an app. Friends praise it, but nobody has purchased access. What has he not yet demonstrated?",
      choices: [
        { id: "a", text: "That he can build an app" },
        { id: "b", text: "That some people respond positively" },
        { id: "c", text: "That customers will actually pay for access" },
      ],
      correct: "c",
      feedback:
        "Positive feedback demonstrates interest. It does not demonstrate completed purchases.",
    },
    {
      id: "q3",
      prompt:
        "A tutor identifies parents who want maths support and offers four lessons for $80, but has no way to schedule or conduct them. Which part needs work?",
      choices: [
        { id: "a", text: "Customer" },
        { id: "b", text: "Offer" },
        { id: "c", text: "Delivery" },
      ],
      correct: "c",
      feedback:
        "The customer and offer are specified. The tutor still needs a workable way to provide the promised lessons.",
    },
  ],
  application: {
    prompt:
      "Name your customer, describe one offer with a price, and explain how you would deliver it.",
    rubric: [
      "Specific customer",
      "Concrete offer and price",
      "Feasible delivery method",
    ],
    note: "Self-check against the rubric. Different valid answers are accepted; this is not auto-graded.",
  },
};

export const l001Outline = [
  { id: "L001", title: "What a business is", current: true, done: false },
] as const;
