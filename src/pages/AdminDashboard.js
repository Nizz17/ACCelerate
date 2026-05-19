import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { getAdminSummary, getAttendees, getAttendanceChart } from "../api"; // 🔌 API
import "./AdminDashboard.css";

const fmtTime = (mins) => {
  if (!mins) return "0h 0m";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="ct-val" style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [summary, setSummary] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [filterDay, setFilterDay] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const load = async () => {
      try {
        // 🔌 API CALL: GET /admin/dashboard/summary
        const s = await getAdminSummary();
        setSummary(s);

        // 🔌 API CALL: GET /admin/attendance/chart
        const c = await getAttendanceChart();
        setChartData(c);
      } catch {
        // Mock data for preview
        setSummary({
          total_registered: 312,
          day1: { present: 280, avg_time_minutes: 340 },
          day2: { present: 265, avg_time_minutes: 295 },
          day3: { present: 240, avg_time_minutes: 310 },
          overall_avg_time_minutes: 315,
        });
        setChartData([
          { day: "Day 1", present: 280, avg_time: 340 },
          { day: "Day 2", present: 265, avg_time: 295 },
          { day: "Day 3", present: 240, avg_time: 310 },
        ]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadAttendees = async () => {
      setLoading(true);
      try {
        // 🔌 API CALL: GET /admin/attendees?day={filterDay}
        const data = await getAttendees(filterDay);
        setAttendees(data);
      } catch {
        // Mock
        setAttendees([
          { id: 1, name: "Aarav Kumar", email: "aarav@ex.com", mobile: "9876543210", affiliation: "Amity Univ", designation: "B.Tech CSE", day1_present: true, day2_present: true, day3_present: false, total_time_minutes: 635 },
          { id: 2, name: "Priya Sharma", email: "priya@ex.com", mobile: "9123456789", affiliation: "IIT Gwalior", designation: "M.Tech AI", day1_present: true, day2_present: false, day3_present: true, total_time_minutes: 720 },
          { id: 3, name: "Rohit Verma", email: "rohit@ex.com", mobile: "9345678901", affiliation: "NIT Bhopal", designation: "Research Scholar", day1_present: true, day2_present: true, day3_present: true, total_time_minutes: 1100 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadAttendees();
  }, [filterDay]);

  const handleLogout = () => { logout(); nav("/"); };

  const filtered = attendees.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.affiliation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dash">
      <div className="admin-blob-1" />
      <div className="admin-blob-2" />

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">ACC<span className="red">EL</span></div>
        <nav className="admin-sidenav">
          {[
            { id: "overview", icon: "◈", label: "Overview" },
            { id: "attendance", icon: "◉", label: "Attendance" },
            { id: "attendees", icon: "≡", label: "Attendees" },
          ].map(item => (
            <button
              key={item.id}
              className={`admin-navitem ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>↩ Logout</button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-header fade-up">
          <div>
            <div className="admin-header-tag">ADMIN CONTROL PANEL</div>
            <h1 className="admin-header-title">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "attendance" && "Attendance Analytics"}
              {activeTab === "attendees" && "Attendee Directory"}
            </h1>
          </div>
          <div className="admin-user-pill">
            <span className="admin-user-dot" />
            {user?.name || "Admin"}
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && summary && (
          <div className="admin-content">
            {/* KPI Cards */}
            <div className="kpi-grid fade-up-2">
              <div className="kpi-card kpi-card--highlight">
                <div className="kpi-icon">👥</div>
                <div className="kpi-val">{summary.total_registered}</div>
                <div className="kpi-label">Total Registered</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">⏱</div>
                <div className="kpi-val">{fmtTime(summary.overall_avg_time_minutes)}</div>
                <div className="kpi-label">Avg Time Spent</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📅</div>
                <div className="kpi-val">{summary.day1?.present}</div>
                <div className="kpi-label">Day 1 Attendance</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📅</div>
                <div className="kpi-val">{summary.day2?.present}</div>
                <div className="kpi-label">Day 2 Attendance</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📅</div>
                <div className="kpi-val">{summary.day3?.present}</div>
                <div className="kpi-label">Day 3 Attendance</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📈</div>
                <div className="kpi-val">
                  {summary.total_registered
                    ? Math.round(((summary.day1?.present || 0) + (summary.day2?.present || 0) + (summary.day3?.present || 0)) / (3 * summary.total_registered) * 100)
                    : 0}%
                </div>
                <div className="kpi-label">Avg Daily Turnout</div>
              </div>
            </div>

            {/* Charts */}
            <div className="charts-row fade-up-3">
              <div className="chart-card">
                <div className="chart-title">Daily Attendance Count</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barSize={32}>
                    <XAxis dataKey="day" tick={{ fill: "rgba(240,238,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(240,238,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(220,30,60,0.08)" }} />
                    <Bar dataKey="present" name="Present" radius={[6, 6, 0, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#dc1e3c" : i === 1 ? "#ff4d6d" : "#ff8099"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <div className="chart-title">Avg Time Spent (mins)</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barSize={32}>
                    <XAxis dataKey="day" tick={{ fill: "rgba(240,238,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(240,238,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(245,200,66,0.06)" }} />
                    <Bar dataKey="avg_time" name="Avg (min)" radius={[6, 6, 0, 0]} fill="#f5c842" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Day comparison cards */}
            <div className="day-compare fade-up-4">
              {[1, 2, 3].map(d => {
                const data = summary[`day${d}`];
                const pct = summary.total_registered ? Math.round((data?.present / summary.total_registered) * 100) : 0;
                return (
                  <div key={d} className="day-cmp-card">
                    <div className="day-cmp-label">DAY {d}</div>
                    <div className="day-cmp-present">{data?.present} <span>attendees</span></div>
                    <div className="day-cmp-time">Avg: {fmtTime(data?.avg_time_minutes)}</div>
                    <div className="day-cmp-bar">
                      <div className="day-cmp-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="day-cmp-pct">{pct}% turnout</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div className="admin-content fade-up">
            <div className="att-filter-bar">
              {["all", "1", "2", "3"].map(d => (
                <button
                  key={d}
                  className={`att-filter-btn ${filterDay === d ? "active" : ""}`}
                  onClick={() => setFilterDay(d)}
                >
                  {d === "all" ? "All Days" : `Day ${d}`}
                </button>
              ))}
            </div>

            <div className="charts-row">
              <div className="chart-card" style={{ flex: 2 }}>
                <div className="chart-title">Attendance by Day</div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} barSize={28}>
                    <XAxis dataKey="day" tick={{ fill: "rgba(240,238,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(240,238,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(220,30,60,0.08)" }} />
                    <Bar dataKey="present" name="Present" radius={[6, 6, 0, 0]} fill="var(--red)" />
                    <Bar dataKey="avg_time" name="Avg Time (min)" radius={[6, 6, 0, 0]} fill="#f5c842" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ATTENDEES TAB */}
        {activeTab === "attendees" && (
          <div className="admin-content fade-up">
            <div className="att-toolbar">
              <input
                className="acc-input att-search"
                placeholder="Search by name, email, affiliation…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="att-filter-bar">
                {["all", "1", "2", "3"].map(d => (
                  <button
                    key={d}
                    className={`att-filter-btn ${filterDay === d ? "active" : ""}`}
                    onClick={() => setFilterDay(d)}
                  >
                    {d === "all" ? "All Days" : `Day ${d}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="att-count">
              Showing <strong>{filtered.length}</strong> attendees
            </div>

            <div className="att-table-wrap">
              <table className="att-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Affiliation</th>
                    <th>Designation</th>
                    <th>D1</th>
                    <th>D2</th>
                    <th>D3</th>
                    <th>Total Time</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="10" className="table-loading">Loading…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan="10" className="table-loading">No attendees found</td></tr>
                  ) : filtered.map((a, i) => (
                    <tr key={a.id}>
                      <td className="td-num">{i + 1}</td>
                      <td className="td-name">{a.name}</td>
                      <td className="td-email">{a.email}</td>
                      <td>{a.mobile}</td>
                      <td>{a.affiliation}</td>
                      <td>{a.designation}</td>
                      <td><span className={`day-dot ${a.day1_present ? "dp" : "da"}`}>{a.day1_present ? "✓" : "✗"}</span></td>
                      <td><span className={`day-dot ${a.day2_present ? "dp" : "da"}`}>{a.day2_present ? "✓" : "✗"}</span></td>
                      <td><span className={`day-dot ${a.day3_present ? "dp" : "da"}`}>{a.day3_present ? "✓" : "✗"}</span></td>
                      <td className="td-time">{fmtTime(a.total_time_minutes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
