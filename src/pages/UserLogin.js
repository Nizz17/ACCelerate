import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userRegisterLogin } from "../api"; // 🔌 API
import "./Login.css";

const FIELDS = [
  { name: "name", label: "Full Name", type: "text", placeholder: "Aarav Kumar" },
  { name: "email", label: "Email ID", type: "email", placeholder: "aarav@example.com" },
  { name: "mobile", label: "Mobile No.", type: "tel", placeholder: "+91 9876543210" },
  { name: "affiliation", label: "Affiliation / Institute", type: "text", placeholder: "Amity University Gwalior" },
  { name: "designation", label: "Designation", type: "text", placeholder: "B.Tech CSE, 1st Year" },
];

export default function UserLogin() {
  const nav = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", affiliation: "", designation: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 🔌 API CALL: POST /auth/user/register-login
      const res = await userRegisterLogin(form);
      loginUser(res.user, res.token);
      nav("/dashboard/user");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-blob" />
      <div className="login-grid" />

      <button className="login-back" onClick={() => nav("/")}>← Back</button>

      <div className="login-box fade-up">
        <div className="login-brand">
          <div className="login-brand-tag">ATTENDEE ACCESS</div>
          <div className="login-brand-title">ACC<span className="red">ELERATE</span></div>
        </div>

        <div className="login-heading">
          <h2>Welcome, Attendee</h2>
          <p>Fill in your details to get your event pass & QR code</p>
        </div>

        {error && <div className="msg-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          {FIELDS.map((f, i) => (
            <div className="login-field" key={f.name} style={{ animationDelay: `${i * 0.07}s` }}>
              <label>{f.label}</label>
              <input
                className="acc-input"
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button className="acc-btn" type="submit" disabled={loading}>
            {loading ? <span className="spin-dot" /> : "GET MY EVENT PASS →"}
          </button>
        </form>

        <p className="login-switch">
          Are you an admin? <button onClick={() => nav("/login/admin")}>Admin Login</button>
        </p>
      </div>
    </div>
  );
}
