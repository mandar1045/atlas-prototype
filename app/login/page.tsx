"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Database, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      setIsLoading(false);
      return;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Fallback if empty
    const name = email.split('@')[0] || "Guest User";
    const userEmail = email || "guest@example.com";
    
    if (email.toLowerCase() === 'admin') {
      login("Admin", "admin@locara-atlas.com", "admin");
    } else {
      login(name, userEmail, "client");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Info Panel */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-between p-12 text-primary-foreground relative overflow-hidden">
        {/* Subtle background abstract shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
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
              The standard for enterprise AI training data. Manage, explore, and access highly-compliant, multi-modal datasets at scale.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl mt-1 shadow-inner">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white tracking-tight">Curated Data Collections</h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed mt-1">Access meticulously structured datasets optimized for advanced AI model training, categorized by complex physical environments.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl mt-1 shadow-inner">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white tracking-tight">Enterprise-Grade Compliance</h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed mt-1">Every asset passes through a rigorous QA and multi-layered PII sanitization pipeline before it reaches your secure dashboard.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl mt-1 shadow-inner">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white tracking-tight">High-Performance Explorer</h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed mt-1">Query vast repositories in milliseconds. Filter by metadata, hardware configurations, and QA status instantly.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/50">
          &copy; {new Date().getFullYear()} Locara Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-surface">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold">
              <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45 transform" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-foreground">Locara Atlas</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Please sign in to your account to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Work Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="bg-background h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <a href="#" className="text-sm text-primary hover:underline font-medium">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                className="bg-background h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold transition-all mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-primary font-semibold hover:underline">
              Request Platform Access
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
