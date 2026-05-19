// ============================================================
//  api/index.js  —  ALL BACKEND INTEGRATION POINTS
//  Replace BASE_URL with your actual backend URL
//  Every function maps to one API endpoint
// ============================================================

const BASE_URL = "http://localhost:8000/api"; // 🔌 CHANGE THIS to your backend URL

// Helper
const request = async (path, options = {}) => {
  const token = localStorage.getItem("acc_token");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
};

// ============================================================
// AUTH
// ============================================================

/**
 * 🔌 POST /auth/admin/login
 * Body: { username, password }
 * Returns: { token, admin: { id, name } }
 */
export const adminLogin = (username, password) =>
  request("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

/**
 * 🔌 POST /auth/user/register-login
 * Body: { name, email, mobile, affiliation, designation }
 * Returns: { token, user: { id, name, email, ... }, qr_code_data }
 */
export const userRegisterLogin = (userData) =>
  request("/auth/user/register-login", {
    method: "POST",
    body: JSON.stringify(userData),
  });

// ============================================================
// USER ENDPOINTS
// ============================================================

/**
 * 🔌 GET /user/me
 * Returns: { id, name, email, mobile, affiliation, designation }
 */
export const getUserProfile = () => request("/user/me");

/**
 * 🔌 GET /user/qr
 * Returns: { qr_data: "string used for QR generation", user_id }
 */
export const getUserQR = () => request("/user/qr");

/**
 * 🔌 GET /user/attendance
 * Returns: {
 *   total_time_minutes: number,
 *   sessions: [{ date, entry_time, exit_time, duration_minutes }],
 *   day_breakdown: [{ day: 1|2|3, present: bool, duration_minutes }]
 * }
 */
export const getUserAttendance = () => request("/user/attendance");

// ============================================================
// ADMIN ENDPOINTS
// ============================================================

/**
 * 🔌 GET /admin/dashboard/summary
 * Returns: {
 *   total_registered: number,
 *   day1: { present: number, avg_time_minutes: number },
 *   day2: { present: number, avg_time_minutes: number },
 *   day3: { present: number, avg_time_minutes: number },
 *   overall_avg_time_minutes: number
 * }
 */
export const getAdminSummary = () => request("/admin/dashboard/summary");

/**
 * 🔌 GET /admin/attendees?day=1|2|3|all
 * Returns: [{
 *   id, name, email, mobile, affiliation, designation,
 *   day1_present, day2_present, day3_present,
 *   total_time_minutes
 * }]
 */
export const getAttendees = (day = "all") =>
  request(`/admin/attendees?day=${day}`);

/**
 * 🔌 GET /admin/attendance/chart
 * Returns: [{
 *   day: "Day 1"|"Day 2"|"Day 3",
 *   present: number,
 *   avg_time: number
 * }]
 */
export const getAttendanceChart = () => request("/admin/attendance/chart");

export default {
  adminLogin,
  userRegisterLogin,
  getUserProfile,
  getUserQR,
  getUserAttendance,
  getAdminSummary,
  getAttendees,
  getAttendanceChart,
};
