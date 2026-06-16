"use client";

import { Navbar } from "@/components/layout/navbar";
import { PlusCircle, FileText, Clock, CheckCircle2, MapPin, Cpu } from "lucide-react";

const glass = {
  background: "rgba(26,26,46,0.55)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(46,134,171,0.18)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.40)",
};

const MOCK_REQUESTS = [
  {
    id: "REQ-001",
    title: "Retail Store — Top Down Angle",
    description: "Top-down camera angles of customers interacting with retail shelves, grabbing and returning items. Minimal lighting variations preferred.",
    date: "Dec 12, 2025",
    status: "In Review",
    volume: "50 Hours",
    env: "Supermarket / Retail",
    priority: "High",
  },
];

export default function RequestsPage() {
  return (
    <div className="flex-1 flex flex-col" style={{ background: "#0F0F14" }}>
      <Navbar title="Data Requests" />

      <main className="flex-1 p-6 overflow-y-auto" style={{ background: "transparent" }}>
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#F0F0F0" }}>
                Custom Data Requests
              </h2>
              <p className="text-sm mt-1" style={{ color: "#9090A0" }}>
                Request new dataset collections tailored to your specific AI models.
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #2E86AB, #1a6a8a)",
                color: "#F0F0F0",
                boxShadow: "0 4px 16px rgba(46,134,171,0.35)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(46,134,171,0.50)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(46,134,171,0.35)"; }}
            >
              <PlusCircle className="w-4 h-4" />
              New Request
            </button>
          </div>

          {/* Active requests */}
          {MOCK_REQUESTS.map((req) => (
            <div key={req.id} className="rounded-2xl p-6" style={glass}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className="p-2.5 rounded-xl flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(46,134,171,0.15)", border: "1px solid rgba(46,134,171,0.25)" }}
                  >
                    <FileText className="w-5 h-5" style={{ color: "#2E86AB" }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: "#F0F0F0" }}>{req.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "#9090A0" }}>Requested on {req.date} · {req.id}</p>
                  </div>
                </div>
                <span
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                  style={{
                    color: "#F59E0B",
                    background: "rgba(245,158,11,0.10)",
                    border: "1px solid rgba(245,158,11,0.28)",
                  }}
                >
                  <Clock className="w-3.5 h-3.5" /> {req.status}
                </span>
              </div>

              <p className="text-sm mb-5 leading-relaxed" style={{ color: "#9090A0" }}>
                {req.description}
              </p>

              <div
                className="flex flex-wrap gap-6 text-sm pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                {[
                  { icon: Clock,        label: "Target Volume", val: req.volume },
                  { icon: MapPin,       label: "Environment",   val: req.env },
                  { icon: Cpu,          label: "Priority",      val: req.priority },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" style={{ color: "#9090A0" }} />
                    <span style={{ color: "#9090A0" }}>{label}:</span>
                    <span className="font-semibold" style={{ color: "#F0F0F0" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Empty state */}
          <div
            className="flex flex-col items-center justify-center p-14 text-center rounded-2xl"
            style={{
              background: "rgba(26,26,46,0.35)",
              border: "1px dashed rgba(46,134,171,0.25)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(46,134,171,0.12)", border: "1px solid rgba(46,134,171,0.25)" }}
            >
              <FileText className="w-6 h-6" style={{ color: "#2E86AB" }} />
            </div>
            <h3 className="text-base font-bold mb-2" style={{ color: "#F0F0F0" }}>No Other Active Requests</h3>
            <p className="text-sm mb-6 max-w-sm" style={{ color: "#9090A0" }}>
              Request custom data collection campaigns if our existing library doesn't meet your requirements.
            </p>
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(46,134,171,0.12)",
                border: "1px solid rgba(46,134,171,0.30)",
                color: "#2E86AB",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(46,134,171,0.22)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(46,134,171,0.12)"; }}
            >
              Submit a Request
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
