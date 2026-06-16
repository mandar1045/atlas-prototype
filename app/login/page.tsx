"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Database, ShieldCheck, Zap, User, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"client" | "admin">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    if (activeTab === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* ── Left Side — original info panel, untouched ── */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-between p-12 text-primary-foreground relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-8 bg-white text-primary rounded-md flex items-center justify-center font-bold">
              <div className="w-4 h-4 border-2 border-primary rounded-sm rotate-45 transform" />
            </div>
            <span className="font-bold text-xl tracking-tight">Locara</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 tracking-tight">
              Locara Atlas
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-md leading-relaxed mb-12 font-medium">
              The standard for enterprise AI training data. Manage, explore, and access
              highly‑compliant, multi‑modal datasets at scale.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl mt-1 shadow-inner">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white tracking-tight">Curated Data Collections</h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed mt-1">
                    Access meticulously structured datasets optimized for advanced AI model training,
                    categorized by complex physical environments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl mt-1 shadow-inner">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white tracking-tight">Enterprise‑Grade Compliance</h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed mt-1">
                    Every asset passes through a rigorous QA and multi‑layered PII sanitization
                    pipeline before it reaches your secure dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl mt-1 shadow-inner">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white tracking-tight">High‑Performance Explorer</h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed mt-1">
                    Query vast repositories in milliseconds. Filter by metadata, hardware
                    configurations, and QA status instantly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} Locara Inc. All rights reserved.
        </div>
      </div>

      {/* ── Right Side — login card with glassmorphism + toggle ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
              <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45 transform" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-foreground">Locara Atlas</span>
          </div>

          {/* Glassmorphism card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "#121212",
              border: "1px solid #27272A",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {/* ── Pill toggle ── */}
            <div
              className="flex rounded-xl p-1 mb-8"
              style={{ background: "#0A0A0A", border: "1px solid #27272A" }}
            >
              {(["client", "admin"] as const).map((tab) => {
                const isActive = activeTab === tab;
                const Icon = tab === "client" ? User : Shield;
                return (
                  <button
                    key={tab}
                    id={`tab-${tab}`}
                    onClick={() => { setActiveTab(tab); setError(""); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
                    style={{
                      color: isActive ? "#F0F0F0" : "#9090A0",
                      background: isActive
                        ? "#0070F3"
                        : "transparent",
                      boxShadow: isActive ? "0 4px 14px rgba(0,112,243,0.35)" : "none",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab === "client" ? "Client Login" : "Admin Login"}
                  </button>
                );
              })}
            </div>

            {/* Dynamic heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {activeTab === "client" ? "Welcome back" : "Admin Portal"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {activeTab === "client"
                    ? "Please sign in to your account to continue."
                    : "Sign in with your administrator credentials."}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  {activeTab === "client" ? "Work Email" : "Admin Email"}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 rounded-lg px-4 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "rgba(42,42,62,0.8)",
                    border: "1px solid #2A2A3E",
                    color: "#F0F0F0",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2E86AB")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#2A2A3E")}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <a href="#" className="text-sm text-primary hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 rounded-lg px-4 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "#0A0A0A",
                    border: "1px solid #27272A",
                    color: "#FAFAFA",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#0070F3")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#27272A")}
                />
              </div>

              {error && (
                <div
                  className="text-sm font-medium p-3 rounded-lg"
                  style={{
                    color: "#EF4444",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg text-base font-semibold transition-all duration-200 mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "#0070F3",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(0,112,243,0.35)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating…
                  </>
                ) : activeTab === "client" ? (
                  "Sign In"
                ) : (
                  "Sign In as Admin"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-primary font-semibold hover:underline">
                Request Platform Access
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
