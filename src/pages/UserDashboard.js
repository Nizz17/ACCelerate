import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import { getUserQR, getUserAttendance } from "../api"; // 🔌 API
import "./UserDashboard.css";

const fmtTime = (mins) => {
  if (!mins) return "0h 0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [qrData, setQrData] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("qr");
  const [showQrFull, setShowQrFull] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔌 API CALL: GET /user/qr
        const qr = await getUserQR();
        setQrData(qr.qr_data);

        // 🔌 API CALL: GET /user/attendance
        const att = await getUserAttendance();
        setAttendance(att);
      } catch (err) {
        console.error("Dashboard load error:", err);
        // Fallback mock data for UI preview
        setQrData(`ACCEL-USER-${user?.id || "DEMO"}`);
        setAttendance({
          total_time_minutes: 310,
          day_breakdown: [
            { day: 1, present: true, duration_minutes: 120 },
            { day: 2, present: true, duration_minutes: 190 },
            { day: 3, present: false, duration_minutes: 0 },
          ],
          sessions: [
            { date: "Day 1", entry_time: "09:05", exit_time: "11:05", duration_minutes: 120 },
            { date: "Day 2", entry_time: "09:10", exit_time: "12:20", duration_minutes: 190 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => { logout(); nav("/"); };

  if (loading) return (
    <div className="dash-loading">
      <div className="dash-spinner" />
      <p>Loading your dashboard…</p>
    </div>
  );

  const totalPct = attendance
    ? Math.min(100, Math.round((attendance.total_time_minutes / (3 * 8 * 60)) * 100))
    : 0;

  return (
    <div className="user-dash">
      <div className="dash-bg-blob" />

      {/* Navbar */}
      <nav className="dash-nav">
        <div className="dash-nav-brand">ACC<span className="red">ELERATE</span></div>
        <div className="dash-nav-user">
          <div className="user-avatar">{user?.name?.charAt(0) || "U"}</div>
          <span>{user?.name?.split(" ")[0]}</span>
        </div>
        <button className="dash-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="dash-main">
        {/* Welcome bar */}
        <div className="dash-welcome fade-up">
          <div>
            <div className="dash-welcome-tag">ATTENDEE DASHBOARD</div>
            <h1 className="dash-welcome-name">Hey, {user?.name?.split(" ")[0]} 👋</h1>
          </div>
          <div className="event-badge">
            <span className="badge-dot" />
            LIVE EVENT
          </div>
        </div>

        {/* Stats row */}
        <div className="dash-stats fade-up-2">
          <div className="dash-stat-card">
            <div className="stat-icon">⏱</div>
            <div className="stat-val">{fmtTime(attendance?.total_time_minutes)}</div>
            <div className="stat-lbl">Total Time Attended</div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-val">{attendance?.day_breakdown?.filter(d => d.present).length || 0}/3</div>
            <div className="stat-lbl">Days Attended</div>
          </div>
          <div className="dash-stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-val">{totalPct}%</div>
            <div className="stat-lbl">Participation Score</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dash-tabs fade-up-3">
          <button className={`dash-tab ${activeTab === "qr" ? "active" : ""}`} onClick={() => setActiveTab("qr")}>
            QR Pass
          </button>
          <button className={`dash-tab ${activeTab === "attendance" ? "active" : ""}`} onClick={() => setActiveTab("attendance")}>
            Attendance
          </button>
          <button className={`dash-tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
            Profile
          </button>
        </div>

        {/* QR TAB */}
        {activeTab === "qr" && (
          <div className="tab-content fade-up">
            <div className="qr-section">
              <div className="qr-card" onClick={() => setShowQrFull(true)}>
                <div className="qr-scanline" />
                <div className="qr-inner">
                  {qrData
                    ? <QRCodeSVG value={qrData} size={200} bgColor="transparent" fgColor="#f0eeff" level="H" />
                    : <div className="qr-loading">Generating QR…</div>
                  }
                </div>
                <div className="qr-corners">
                  <span /><span /><span /><span />
                </div>
              </div>
              <div className="qr-info">
                <h3>Your Event Pass</h3>
                <p>Show this QR code at the entry and exit points. Your attendance time will be automatically tracked.</p>
                <div className="qr-instructions">
                  {["Tap QR to enlarge", "Scan at ENTRY gate", "Scan at EXIT gate", "Your time is logged automatically"].map((s, i) => (
                    <div key={i} className="qr-step">
                      <span className="qr-step-num">{i + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div className="tab-content fade-up">
            {/* Day breakdown */}
            <div className="att-days">
              {[1, 2, 3].map((d) => {
                const bd = attendance?.day_breakdown?.find(x => x.day === d);
                return (
                  <div key={d} className={`att-day-card ${bd?.present ? "present" : "absent"}`}>
                    <div className="att-day-header">
                      <span className="att-day-label">DAY {d}</span>
                      <span className={`att-day-status ${bd?.present ? "status-present" : "status-absent"}`}>
                        {bd?.present ? "✓ Present" : "✗ Absent"}
                      </span>
                    </div>
                    <div className="att-day-time">{fmtTime(bd?.duration_minutes)}</div>
                    <div className="att-day-bar">
                      <div className="att-day-bar-fill" style={{ width: `${Math.min(100, (bd?.duration_minutes || 0) / (8 * 60) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sessions */}
            <div className="att-sessions">
              <h3>Session History</h3>
              {attendance?.sessions?.length ? (
                <table className="sess-table">
                  <thead>
                    <tr>
                      <th>Date</th><th>Entry</th><th>Exit</th><th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.sessions.map((s, i) => (
                      <tr key={i}>
                        <td>{s.date}</td>
                        <td>{s.entry_time}</td>
                        <td>{s.exit_time}</td>
                        <td>{fmtTime(s.duration_minutes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No sessions recorded yet</p>
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="tab-content fade-up">
            <div className="profile-card">
              <div className="profile-avatar">{user?.name?.charAt(0)}</div>
              <div className="profile-fields">
                {[
                  ["Name", user?.name],
                  ["Email", user?.email],
                  ["Mobile", user?.mobile],
                  ["Affiliation", user?.affiliation],
                  ["Designation", user?.designation],
                ].map(([k, v]) => (
                  <div key={k} className="profile-field">
                    <span className="pf-label">{k}</span>
                    <span className="pf-val">{v || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR Fullscreen overlay */}
      {showQrFull && (
        <div className="qr-overlay" onClick={() => setShowQrFull(false)}>
          <div className="qr-overlay-inner" onClick={e => e.stopPropagation()}>
            <button className="qr-close" onClick={() => setShowQrFull(false)}>✕</button>
            <div className="qr-overlay-tag">SCAN AT GATE</div>
            <QRCodeSVG value={qrData || "DEMO"} size={280} bgColor="transparent" fgColor="#f0eeff" level="H" />
            <div className="qr-overlay-name">{user?.name}</div>
          </div>
        </div>
      )}
    </div>
  );
}
