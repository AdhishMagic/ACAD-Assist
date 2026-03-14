import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/hooks";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      auth.fetchProfile();
    }
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}

export default AuthContext;
