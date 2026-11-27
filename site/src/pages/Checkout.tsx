import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { plans } from "../data";
import { openPaddleCheckout, type DigProgCycle, type DigProgPlanId } from "../lib/paddle";
import "./Checkout.css";

export function Checkout() {
  const [params] = useSearchParams();
  const [cycle, setCycle] = useState<DigProgCycle>(
    params.get("cycle") === "year" ? "year" : "oneTime",
  );
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = useMemo(() => {
    const id = (params.get("plan") ?? "medium") as DigProgPlanId;
    return plans.find((p) => p.id === id) ?? plans[1];
  }, [params]);

  const displayPrice = cycle === "year" ? plan.priceAnnual : plan.price;
  const dueToday = cycle === "year" ? plan.priceAnnual : plan.price;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const ok = await openPaddleCheckout({
        plan: plan.id,
        cycle,
        email: email.trim() || undefined,
      });
      if (!ok) {
        setError("Paddle isn’t configured. Add VITE_PADDLE_CLIENT_TOKEN and restart the dev server.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed to open.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="checkout-page atmosphere">
      <div className="checkout-shell">
        <Link to="/#pricing" className="checkout-back">
          ← Back to pricing
        </Link>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={onSubmit}>
            <p className="eyebrow">Checkout · Paddle sandbox</p>
            <h1 className="display">Complete your DigProg {plan.name} order</h1>
            <p className="checkout-note">
              Website pricing: Simple $49 · Medium $149 · Pro $299. Pay securely with Paddle.
            </p>

            <div className="row-2" role="group" aria-label="Billing option">
              <button
                type="button"
                className={`btn ${cycle === "oneTime" ? "btn-mint" : "btn-ghost-light"}`}
                onClick={() => setCycle("oneTime")}
              >
                One-time · {plan.price}
              </button>
              <button
                type="button"
                className={`btn ${cycle === "year" ? "btn-mint" : "btn-ghost-light"}`}
                onClick={() => setCycle("year")}
              >
                Annual · {plan.priceAnnual}
              </button>
            </div>

            <label>
              Email
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {error && (
              <p className="checkout-note" style={{ color: "#c0392b" }}>
                {error}
              </p>
            )}

            <button className="btn btn-mint" type="submit" disabled={busy}>
              {busy ? "Opening Paddle…" : `Pay ${displayPrice} with Paddle`}
            </button>
          </form>

          <aside className="order-summary">
            <h2>Order summary</h2>
            <div className="summary-line">
              <span>DigProg {plan.name}</span>
              <strong>{displayPrice}</strong>
            </div>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="summary-total">
              <span>Total due today</span>
              <strong>{dueToday}</strong>
            </div>
            <p className="muted-note">
              Powered by Paddle. Localized prices for GB / IE / AU apply automatically.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
