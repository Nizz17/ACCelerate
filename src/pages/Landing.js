import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const DAYS = ["MAY 22", "MAY 23", "MAY 24"];

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="landing">
      {/* Background grid */}
      <div className="landing-grid" />
      {/* Red glow blob */}
      <div className="landing-blob" />

      <div className="landing-inner">
        {/* Header */}
        <div className="landing-header fade-up">
          <div className="landing-tag">THREE DAY SYMPOSIUM • 2025</div>
          <h1 className="landing-title">
            ACC<span className="red">ELERATE</span>
          </h1>
          <p className="landing-sub">
            Innovation. Collaboration. Impact.
          </p>
        </div>

        {/* Days strip */}
        <div className="days-strip fade-up-2">
          {DAYS.map((d, i) => (
            <div key={i} className="day-pill">
              <span className="day-num">DAY {i + 1}</span>
              <span className="day-date">{d}</span>
            </div>
          ))}
        </div>

        {/* Role selection */}
        <div className="role-cards fade-up-3">
          <button className="role-card role-card--user" onClick={() => nav("/login/user")}>
            <div className="role-icon">◉</div>
            <div className="role-label">ATTENDEE</div>
            <div className="role-desc">Register & access your event dashboard, QR pass, and attendance log</div>
            <div className="role-cta">Enter as Attendee →</div>
          </button>

          <div className="role-divider">
            <span>OR</span>
          </div>

          <button className="role-card role-card--admin" onClick={() => nav("/login/admin")}>
            <div className="role-icon">⬡</div>
            <div className="role-label">ADMIN</div>
            <div className="role-desc">Access the control panel, attendance analytics, and participant data</div>
            <div className="role-cta">Admin Login →</div>
          </button>
        </div>

        {/* Scroll hint */}
        <div className="landing-scroll fade-up-4">
          <div className="scroll-line" />
          <span>SCROLL FOR EVENT INFO</span>
          <div className="scroll-line" />
        </div>
      </div>

      {/* Event Info Section */}
      <section className="event-info">
        <div className="event-info-inner">
          <div className="info-badge">ABOUT THE EVENT</div>
          <h2 className="info-title">What is <span className="red">ACCelerate?</span></h2>
          <p className="info-body">
            ACCelerate is a three-day flagship event bringing together students, researchers,
            and industry professionals to explore the frontiers of technology, entrepreneurship,
            and innovation. Featuring keynotes, workshops, hackathons, and networking sessions
            — this is where ideas become reality.
          </p>

          <div className="info-stats">
            {[
              { n: "3", label: "Days" },
              { n: "500+", label: "Attendees" },
              { n: "20+", label: "Sessions" },
              { n: "10+", label: "Speakers" },
            ].map((s, i) => (
              <div key={i} className="info-stat">
                <span className="stat-n">{s.n}</span>
                <span className="stat-l">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="info-timeline">
            {[
              { day: "DAY 01", title: "Kickoff & Keynotes", desc: "Opening ceremony, keynote addresses, and inaugural workshops" },
              { day: "DAY 02", title: "Deep Dives", desc: "Technical sessions, panel discussions, and hands-on workshops" },
              { day: "DAY 03", title: "Showcase & Finale", desc: "Project presentations, awards, and closing ceremony" },
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-day">{item.day}</div>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-title">{item.title}</div>
                  <div className="timeline-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <span className="red">ACC</span>elerate 2025 • Powered by Innovation
      </footer>
    </div>
  );
}
