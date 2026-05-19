import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminLogin } from "../api"; // 🔌 API
import "./Login.css";

export default function AdminLogin() {
  const nav = useNavigate();
  const { loginAdmin } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 🔌 API CALL: POST /auth/admin/login
      const res = await adminLogin(form.username, form.password);
      loginAdmin(res.admin, res.token);
      nav("/dashboard/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page login-page--admin">
      <div className="login-bg-blob login-bg-blob--admin" />
      <div className="login-grid" />

      <button className="login-back" onClick={() => nav("/")}>← Back</button>

      <div className="login-box login-box--admin fade-up">
        <div className="login-brand">
          <div className="login-brand-tag" style={{ color: "#f5c842" }}>ADMIN CONTROL</div>
          <div className="login-brand-title">ACC<span className="red">ELERATE</span></div>
        </div>

        <div className="login-shield">⬡</div>

        <div className="login-heading">
          <h2>Admin Portal</h2>
          <p>Restricted access — authorized personnel only</p>
        </div>

        {error && <div className="msg-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Username</label>
            <input
              className="acc-input"
              type="text"
              name="username"
              placeholder="admin_username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input
              className="acc-input"
              type="password"
              name="password"
              placeholder="••••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="acc-btn acc-btn--gold" type="submit" disabled={loading}>
            {loading ? <span className="spin-dot" /> : "ACCESS DASHBOARD →"}
          </button>
        </form>

        <p className="login-switch">
          Not admin? <button onClick={() => nav("/login/user")}>Attendee Login</button>
        </p>
      </div>
    </div>
  );
}
