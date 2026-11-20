import { channels, showcase } from "../data";
import "./Community.css";

export function Community() {
  return (
    <div className="community member-grid">
      <section className="panel">
        <h2>Channels</h2>
        <ul className="channel-list">
          {channels.map((ch) => (
            <li key={ch.name}>
              <div>
                <strong>{ch.name}</strong>
                <p className="muted">{ch.preview}</p>
              </div>
              <span>{ch.members}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Accountability directory</h2>
        <div className="people">
          {[
            ["Jordan Lee", "Local services · PT"],
            ["Sam Ortiz", "Freelance offers · ET"],
            ["Mina Park", "Newsletter · GMT"],
          ].map(([name, meta]) => (
            <div key={name}>
              <strong>{name}</strong>
              <span className="muted">{meta}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel showcase-panel">
        <h2>Student business showcase</h2>
        <p className="muted">Teaser UI · “15 live businesses from this course”</p>
        <div className="showcase-grid">
          {showcase.map((biz) => (
            <article key={biz.name}>
              <span>{biz.stage}</span>
              <strong>{biz.name}</strong>
              <p>{biz.niche}</p>
            </article>
          ))}
          <article className="more">+12 more · coming soon</article>
        </div>
      </section>
    </div>
  );
}
