import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "user" | "admin"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("acc_token");
    const savedRole = localStorage.getItem("acc_role");
    const savedUser = localStorage.getItem("acc_user");
    if (token && savedRole && savedUser) {
      setRole(savedRole);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem("acc_token", token);
    localStorage.setItem("acc_role", "user");
    localStorage.setItem("acc_user", JSON.stringify(userData));
    setUser(userData);
    setRole("user");
  };

  const loginAdmin = (adminData, token) => {
    localStorage.setItem("acc_token", token);
    localStorage.setItem("acc_role", "admin");
    localStorage.setItem("acc_user", JSON.stringify(adminData));
    setUser(adminData);
    setRole("admin");
  };

  const logout = () => {
    localStorage.removeItem("acc_token");
    localStorage.removeItem("acc_role");
    localStorage.removeItem("acc_user");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginUser, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
