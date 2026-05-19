# ACCelerate — Event Management Frontend

Black + Crimson themed React frontend for the ACCelerate three-day event.

---

## 🚀 Quick Start

```bash
npm install
npm start          # dev server on http://localhost:3000
npm run build      # production build in /build
```

---

## 📁 Project Structure

```
src/
├── api/
│   └── index.js          ← ALL API INTEGRATION POINTS (edit BASE_URL here)
├── context/
│   └── AuthContext.js    ← Auth state (login/logout/role)
├── pages/
│   ├── Landing.js/.css        ← Home page + role selection
│   ├── UserLogin.js           ← Attendee registration/login
│   ├── AdminLogin.js          ← Admin credentials login
│   ├── UserDashboard.js/.css  ← QR code + attendance tracker
│   └── AdminDashboard.js/.css ← Analytics + attendee table
├── index.css              ← Global styles + design tokens
└── App.js                 ← Router + protected routes
```

---

## 🔌 Connecting Your Backend

**Step 1:** Open `src/api/index.js`

**Step 2:** Change line 6:
```js
const BASE_URL = "http://localhost:8000/api"; // ← Your backend URL
```

**Step 3:** Each function maps to one endpoint. The file has full JSDoc for every call:

| Function | Method | Endpoint |
|---|---|---|
| `adminLogin(username, password)` | POST | `/auth/admin/login` |
| `userRegisterLogin(userData)` | POST | `/auth/user/register-login` |
| `getUserQR()` | GET | `/user/qr` |
| `getUserAttendance()` | GET | `/user/attendance` |
| `getAdminSummary()` | GET | `/admin/dashboard/summary` |
| `getAttendees(day)` | GET | `/admin/attendees?day=all|1|2|3` |
| `getAttendanceChart()` | GET | `/admin/attendance/chart` |

### Auth Token
- After login, token is stored in `localStorage` as `acc_token`
- All requests auto-include `Authorization: Bearer <token>` header
- No extra setup needed

---

## 🗂️ Expected API Response Shapes

### POST /auth/user/register-login
```json
{
  "token": "jwt_string",
  "user": { "id": 1, "name": "...", "email": "...", "mobile": "...", "affiliation": "...", "designation": "..." },
  "qr_code_data": "ACCEL-USER-1"
}
```

### GET /user/attendance
```json
{
  "total_time_minutes": 310,
  "day_breakdown": [
    { "day": 1, "present": true, "duration_minutes": 120 },
    { "day": 2, "present": true, "duration_minutes": 190 },
    { "day": 3, "present": false, "duration_minutes": 0 }
  ],
  "sessions": [
    { "date": "Day 1", "entry_time": "09:05", "exit_time": "11:05", "duration_minutes": 120 }
  ]
}
```

### GET /admin/dashboard/summary
```json
{
  "total_registered": 312,
  "day1": { "present": 280, "avg_time_minutes": 340 },
  "day2": { "present": 265, "avg_time_minutes": 295 },
  "day3": { "present": 240, "avg_time_minutes": 310 },
  "overall_avg_time_minutes": 315
}
```

---

## 🌐 Deploying to GitHub + Vercel (Free)

### GitHub
```bash
cd accelerate
git init
git add .
git commit -m "Initial commit"
gh repo create accelerate-event --public --push
```

### Vercel (recommended, free)
1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Framework: Create React App (auto-detected)
4. Add env variable: `REACT_APP_API_URL=https://your-backend.com/api`
5. Update `src/api/index.js`:
   ```js
   const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
   ```
6. Deploy → get a live URL instantly

### Netlify (alternative)
```bash
npm run build
# Drag the /build folder to netlify.com/drop
```

---

## 🎨 Design Tokens (index.css)

| Variable | Value | Use |
|---|---|---|
| `--red` | `#dc1e3c` | Primary accent |
| `--gold` | `#f5c842` | Admin accent |
| `--black` | `#050507` | Background |
| `--card` | `#0f0f1a` | Card bg |
| `--font-display` | Bebas Neue | Headings |
| `--font-body` | Syne | Body text |
| `--font-mono` | DM Mono | Labels/tags |

---

## 📱 Pages Overview

| Route | Page | Who |
|---|---|---|
| `/` | Landing + event info | Everyone |
| `/login/user` | Attendee registration form | Attendees |
| `/login/admin` | Admin credentials form | Admins |
| `/dashboard/user` | QR pass + attendance tabs | Logged-in attendees |
| `/dashboard/admin` | Analytics + attendee table | Logged-in admins |
