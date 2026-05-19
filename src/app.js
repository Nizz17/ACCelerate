import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css";

// Protected route wrapper
const Protected = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 36, height: 36, border: "2px solid rgba(220,30,60,0.3)", borderTopColor: "#dc1e3c", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>;
  if (!user) return <Navigate to="/" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  const { user, role } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        user
          ? <Navigate to={role === "admin" ? "/dashboard/admin" : "/dashboard/user"} replace />
          : <Landing />
      } />
      <Route path="/login/user" element={
        user ? <Navigate to="/dashboard/user" replace /> : <UserLogin />
      } />
      <Route path="/login/admin" element={
        user ? <Navigate to="/dashboard/admin" replace /> : <AdminLogin />
      } />
      <Route path="/dashboard/user" element={
        <Protected requiredRole="user">
          <UserDashboard />
        </Protected>
      } />
      <Route path="/dashboard/admin" element={
        <Protected requiredRole="admin">
          <AdminDashboard />
        </Protected>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
