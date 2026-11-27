import "./Profile.css";

export function Profile() {
  return (
    <div className="profile member-grid">
      <section className="panel">
        <h2>Public profile</h2>
        <div className="profile-head">
          <div className="avatar" aria-hidden />
          <div>
            <strong>Alex Rivera</strong>
            <p className="muted">Local services · DigProg Pro</p>
          </div>
        </div>
        <p>
          Building a neighborhood handyman lead offer. Sharing weekly wins in #accountability.
        </p>
      </section>

      <section className="panel">
        <h2>Affiliate / referral</h2>
        <div className="stat-row">
          <div>
            <strong>18</strong>
            <span>Clicks</span>
          </div>
          <div>
            <strong>3</strong>
            <span>Signups</span>
          </div>
          <div>
            <strong>$96</strong>
            <span>Est. payout</span>
          </div>
        </div>
        <label className="ref-link">
          Your link
          <input readOnly value="https://digprog.mock/r/alex" />
        </label>
      </section>

      <section className="panel billing-panel">
        <h2>Account & billing</h2>
        <div className="billing-row">
          <div>
            <strong>Plan</strong>
            <p className="muted">Managed in Paddle after checkout</p>
          </div>
          <a className="btn btn-ghost-light" href="/checkout?plan=pro">
            Change plan
          </a>
        </div>
        <div className="billing-row">
          <div>
            <strong>Payment method</strong>
            <p className="muted">Update cards in the Paddle customer portal</p>
          </div>
          <a className="btn btn-ghost-light" href="/checkout?plan=pro">
            Billing
          </a>
        </div>
      </section>
    </div>
  );
}
