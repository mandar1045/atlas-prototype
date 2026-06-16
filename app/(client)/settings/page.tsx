"use client";

import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/components/providers/auth-provider";
import { User, Bell, Key, Shield, Save, RefreshCw } from "lucide-react";

const glass = {
  background: "rgba(26,26,46,0.55)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(46,134,171,0.18)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.40)",
};

const inputStyle: React.CSSProperties = {
  background: "rgba(42,42,62,0.7)",
  border: "1px solid rgba(46,134,171,0.18)",
  color: "#F0F0F0",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s",
};

function SectionCard({ icon: Icon, iconColor, title, description, children }: {
  icon: React.ElementType; iconColor: string; title: string; description: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={glass}>
      <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}>
            <Icon className="w-4 h-4" style={{ color: iconColor }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#F0F0F0" }}>{title}</h3>
            <p className="text-xs" style={{ color: "#9090A0" }}>{description}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Toggle({ label, sub, defaultOn = false }: { label: string; sub: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div>
        <div className="text-sm font-medium" style={{ color: "#F0F0F0" }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: "#9090A0" }}>{sub}</div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
        <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
        <div className="w-10 h-5 rounded-full peer-checked:bg-[#2E86AB] bg-[#2A2A3E] transition-all duration-200
          after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full
          after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
      </label>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <div className="flex-1 flex flex-col" style={{ background: "#0F0F14" }}>
      <Navbar title="Settings" />
      <main className="flex-1 p-6 overflow-y-auto" style={{ background: "transparent" }}>
        <div className="max-w-3xl mx-auto space-y-5">

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#F0F0F0" }}>
              Organization Settings
            </h2>
            <p className="text-sm mt-1" style={{ color: "#9090A0" }}>
              Manage your account preferences and API access.
            </p>
          </div>

          {/* Profile */}
          <SectionCard icon={User} iconColor="#2E86AB" title="Profile Details"
            description="Update your personal information and contact email.">
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { label: "Full Name",      val: user?.name  || "Demo User",              id: "name" },
                { label: "Email Address",  val: user?.email || "user@locara-atlas.com",  id: "email" },
                { label: "Organization",   val: "Acme Robotics",                          id: "org" },
                { label: "Job Title",      val: "AI Research Lead",                       id: "title" },
              ].map(({ label, val, id }) => (
                <div key={id} className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9090A0" }}>
                    {label}
                  </label>
                  <input
                    defaultValue={val}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2E86AB")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(46,134,171,0.18)")}
                  />
                </div>
              ))}
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "linear-gradient(135deg, #2E86AB, #1a6a8a)", color: "#F0F0F0", boxShadow: "0 4px 14px rgba(46,134,171,0.30)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(46,134,171,0.48)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(46,134,171,0.30)"; }}
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </SectionCard>

          {/* Notifications */}
          <SectionCard icon={Bell} iconColor="#A78BFA" title="Notifications"
            description="Configure how you receive platform updates.">
            <Toggle label="Data Ingestion Alerts"  sub="Email when new datasets matching your criteria are added." defaultOn={true} />
            <Toggle label="QA Failure Reports"      sub="Get notified if datasets fail compliance and PII checks."  defaultOn={true} />
            <Toggle label="Weekly Digest"           sub="A summary of the week's data growth and platform updates." defaultOn={false} />
            <Toggle label="Delivery Ready Alerts"   sub="Notify when approved dataset requests are ready for download." defaultOn={true} />
          </SectionCard>

          {/* API Key */}
          <SectionCard icon={Key} iconColor="#F59E0B" title="API Access"
            description="Manage your organization's API key for automated data retrieval.">
            <div
              className="flex items-center justify-between p-4 rounded-xl mb-3"
              style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <code className="text-sm font-mono" style={{ color: "#9090A0" }}>
                sk_live_●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
              </code>
              <button
                className="flex items-center gap-1.5 ml-4 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0"
                style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,158,11,0.22)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(245,158,11,0.12)"; }}
              >
                <RefreshCw className="w-3 h-3" /> Regenerate
              </button>
            </div>
            <p className="text-xs" style={{ color: "#9090A0" }}>
              Do not share this key. If you suspect it has been compromised, regenerate it immediately.
            </p>
          </SectionCard>

          {/* Security */}
          <SectionCard icon={Shield} iconColor="#EF4444" title="Security"
            description="Manage two-factor authentication and session control.">
            <Toggle label="Two-Factor Authentication" sub="Require a verification code on every login." defaultOn={false} />
            <Toggle label="Single Sign-On (SSO)"       sub="Enable SSO via your organization's identity provider." defaultOn={false} />
            <div className="pt-4">
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(239,68,68,0.10)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.22)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.10)"; }}
              >
                Sign Out All Sessions
              </button>
            </div>
          </SectionCard>

        </div>
      </main>
    </div>
  );
}
