"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role: "admin" | "client";
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string, role: "admin" | "client") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Load session from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("locara_atlas_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }, []);

  const login = (name: string, email: string, role: "admin" | "client") => {
    const newUser = { name, email, role };
    setUser(newUser);
    localStorage.setItem("locara_atlas_user", JSON.stringify(newUser));
    router.push(role === "admin" ? "/admin" : "/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("locara_atlas_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
