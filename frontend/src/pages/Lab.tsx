import { useState } from "react";
import { useDemo } from "../demo/store";
import { clock } from "../lib/format";

const PRESETS = [
  "Physician unavailable: Lakeside backup offline",
  "Demand spike: Bayview 3 consults in 12 minutes",
  "Duplicate event replayed (idempotent)",
  "Late-arriving camera signal for Dr. Park",
];

export default function Lab() {
  const demo = useDemo();
  const [text, setText] = useState(PRESETS[0]);

  return (
    <div className="lab-stack">
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Inject an event</h2>
            <p>Judge-ready scenarios without restarting the app</p>
          </div>
        </div>
        <label className="lab-label">
          Event description
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="lab-textarea"
          />
        </label>
        <div className="lab-presets">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className="preset-chip"
              onClick={() => setText(p)}
            >
              {p.length > 32 ? `${p.slice(0, 32)}…` : p}
            </button>
          ))}
        </div>
        <div className="lab-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => demo.injectEvent(text)}
          >
            Inject event
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => demo.resetFlow()}
          >
            Reset demo snapshot
          </button>
        </div>
      </section>

      <div className="desk-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Event log</h2>
              <p>Audit trail for every inject and decision</p>
            </div>
          </div>
          <div className="event-log">
            {demo.events.map((e) => (
              <div className="event-entry" key={e.id}>
                <span className="event-time tabular">{clock(e.at)}</span>
                <p className="event-text">{e.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Safety constraints</h2>
              <p>Visible by design</p>
            </div>
          </div>
          <ul className="safety-list">
            <li>No patient information in notifications</li>
            <li>Clinical lead approval before every offer</li>
            <li>One open offer per physician · at most 3 per week</li>
            <li>Offers expire after 10 minutes</li>
            <li>Eligibility failures never hidden behind a score</li>
          </ul>
        </section>
      </div>
    </div>
  );
}