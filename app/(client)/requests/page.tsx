"use client";

import { Navbar } from "@/components/layout/navbar";
import { PlusCircle, FileText, Clock, CheckCircle2, MapPin, Cpu } from "lucide-react";


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
    <div className="flex-1 flex flex-col" >
      <Navbar title="Data Requests" />

      <main className="flex-1 p-6 overflow-y-auto" >
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Custom Data Requests
              </h2>
              <p className="text-sm mt-1 text-muted-foreground">
                Request new dataset collections tailored to your specific AI models.
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-foreground"
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(46,134,171,0.50)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(46,134,171,0.35)"; }}
            >
              <PlusCircle className="w-4 h-4" />
              New Request
            </button>
          </div>

          {/* Active requests */}
          {MOCK_REQUESTS.map((req) => (
            <div key={req.id} className="rounded-2xl p-6 bg-card border border-border shadow-sm rounded-xl">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className="p-2.5 rounded-xl flex-shrink-0 mt-0.5"
                    
                  >
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{req.title}</h3>
                    <p className="text-xs mt-0.5 text-muted-foreground">Requested on {req.date} · {req.id}</p>
                  </div>
                </div>
                <span
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
                  
                >
                  <Clock className="w-3.5 h-3.5" /> {req.status}
                </span>
              </div>

              <p className="text-sm mb-5 leading-relaxed text-muted-foreground">
                {req.description}
              </p>

              <div
                className="flex flex-wrap gap-6 text-sm pt-4"
                
              >
                {[
                  { icon: Clock,        label: "Target Volume", val: req.volume },
                  { icon: MapPin,       label: "Environment",   val: req.env },
                  { icon: Cpu,          label: "Priority",      val: req.priority },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{label}:</span>
                    <span className="font-semibold text-foreground">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Empty state */}
          <div
            className="flex flex-col items-center justify-center p-14 text-center rounded-2xl"
            
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              
            >
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-base font-bold mb-2 text-foreground">No Other Active Requests</h3>
            <p className="text-sm mb-6 max-w-sm text-muted-foreground">
              Request custom data collection campaigns if our existing library doesn't meet your requirements.
            </p>
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all text-primary"
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
