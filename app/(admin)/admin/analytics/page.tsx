"use client";

import { Navbar } from "@/components/layout/navbar";
import { Wrench } from "lucide-react";

export default function AdvancedAnalyticsPage() {
  return (
    <div className="flex-1 flex flex-col" style={{ background: "#0F0F14" }}>
      <Navbar title="Advanced Analytics" isAdmin={true} />
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div 
          className="rounded-2xl p-10 text-center max-w-md w-full flex flex-col items-center relative overflow-hidden"
          style={{ 
            background: "rgba(26,26,46,0.60)", 
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(46,134,171,0.18)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.35)"
          }}
        >
          <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center" style={{ background: "rgba(46,134,171,0.15)", border: "1px solid rgba(46,134,171,0.3)" }}>
            <Wrench className="w-6 h-6" style={{ color: "#2E86AB" }} />
          </div>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#F0F0F0" }}>Under Construction</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#9090A0" }}>
            The <strong>Advanced Analytics</strong> module is currently in development and will be available in the next release of the Locara Atlas platform.
          </p>
        </div>
      </main>
    </div>
  );
}
