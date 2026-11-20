import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { plans } from "../data";
import "./Checkout.css";

export function Checkout() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const plan = useMemo(() => {
    const id = params.get("plan") ?? "medium";
    return plans.find((p) => p.id === id) ?? plans[1];
  }, [params]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => navigate("/onboarding"), 700);
  }

  return (
    <div className="checkout-page atmosphere">
      <div className="checkout-shell">
        <Link to="/#pricing" className="checkout-back">
          ← Back to pricing
        </Link>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={onSubmit}>
            <p className="eyebrow">Checkout · mock</p>
            <h1 className="display">Complete your DigProg order</h1>
            <p className="checkout-note">
              Instant account after “payment” — no real Stripe. Fields are decorative.
            </p>

            <label>
              Email
              <input required type="email" placeholder="you@example.com" defaultValue="alex@example.com" />
            </label>
            <label>
              Card number
              <input required inputMode="numeric" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
            </label>
            <div className="row-2">
              <label>
                Expiry
                <input required placeholder="12 / 28" defaultValue="12 / 28" />
              </label>
              <label>
                CVC
                <input required placeholder="123" defaultValue="123" />
              </label>
            </div>
            <button className="btn btn-mint" type="submit" disabled={submitted}>
              {submitted ? "Creating account…" : `Pay ${plan.price} · fake`}
            </button>
          </form>

          <aside className="order-summary">
            <h2>Order summary</h2>
            <div className="summary-line">
              <span>DigProg {plan.name}</span>
              <strong>{plan.price}</strong>
            </div>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="summary-total">
              <span>Total due today</span>
              <strong>{plan.price}</strong>
            </div>
            <p className="muted-note">Distraction-free checkout mock. Taxes not calculated.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
