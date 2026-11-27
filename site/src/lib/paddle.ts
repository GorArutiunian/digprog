import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import catalog from "../data/paddleCatalog.json";

export type DigProgPlanId = "simple" | "medium" | "pro";
export type DigProgCycle = "oneTime" | "year";

let paddlePromise: Promise<Paddle | undefined> | null = null;

export function getPaddlePriceId(plan: DigProgPlanId, cycle: DigProgCycle): string {
  return catalog.products[plan].prices[cycle].id;
}

export async function getPaddle(): Promise<Paddle | undefined> {
  if (!paddlePromise) {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined;
    if (!token) {
      console.warn("Missing VITE_PADDLE_CLIENT_TOKEN — Paddle checkout disabled.");
      paddlePromise = Promise.resolve(undefined);
      return paddlePromise;
    }
    const environment =
      (import.meta.env.VITE_PADDLE_ENV as "sandbox" | "production" | undefined) || "sandbox";
    paddlePromise = initializePaddle({
      environment,
      token,
    });
  }
  return paddlePromise;
}

export async function openPaddleCheckout(opts: {
  plan: DigProgPlanId;
  cycle: DigProgCycle;
  email?: string;
}): Promise<boolean> {
  const paddle = await getPaddle();
  if (!paddle) return false;
  const priceId = getPaddlePriceId(opts.plan, opts.cycle);
  // successUrl must be https. Prefer production domain; fall back to current origin if already https.
  const successBase =
    window.location.protocol === "https:"
      ? window.location.origin
      : "https://digprog.vercel.app";

  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customer: opts.email ? { email: opts.email } : undefined,
    settings: {
      successUrl: `${successBase}/onboarding?paddle=success`,
      allowLogout: true,
    },
  });
  return true;
}
