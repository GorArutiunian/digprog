import { useMemo, useState } from "react";
import { tools } from "../data";
import "./Tools.css";

export function Tools() {
  const [revenue, setRevenue] = useState(2400);
  const [costs, setCosts] = useState(900);
  const profit = useMemo(() => revenue - costs, [revenue, costs]);
  const [score, setScore] = useState({ pain: 4, reach: 3, skill: 4 });

  const ideaScore = Math.round(((score.pain + score.reach + score.skill) / 15) * 100);

  return (
    <div className="tools member-grid">
      <section className="panel">
        <h2>PDF library</h2>
        <ul className="tool-list">
          {tools
            .filter((t) => t.type === "PDF")
            .map((t) => (
              <li key={t.name}>
                <span>{t.name}</span>
                <button type="button" className="btn btn-ghost-light">
                  Open mock
                </button>
              </li>
            ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Profit calculator</h2>
        <label>
          Monthly revenue
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
          />
          <strong>${revenue.toLocaleString()}</strong>
        </label>
        <label>
          Monthly costs
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={costs}
            onChange={(e) => setCosts(Number(e.target.value))}
          />
          <strong>${costs.toLocaleString()}</strong>
        </label>
        <p className="profit">
          Est. profit <b>${profit.toLocaleString()}</b>
        </p>
      </section>

      <section className="panel">
        <h2>Idea scorecard</h2>
        {(
          [
            ["pain", "Buyer pain"],
            ["reach", "Reachability"],
            ["skill", "Your skill fit"],
          ] as const
        ).map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              type="range"
              min={1}
              max={5}
              value={score[key]}
              onChange={(e) => setScore((s) => ({ ...s, [key]: Number(e.target.value) }))}
            />
            <strong>{score[key]}/5</strong>
          </label>
        ))}
        <p className="profit">
          Idea score <b>{ideaScore}</b>
        </p>
      </section>

      <section className="panel vault-panel">
        <h2>Bonus Vault</h2>
        <p className="muted">Locked teaser · AI idea helper & assisted launches</p>
        <div className="vault-lock">Coming soon · Pro teaser UI</div>
      </section>
    </div>
  );
}
