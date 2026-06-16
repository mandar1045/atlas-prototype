"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie,
} from "recharts";
import { MOCK_VIDEOS, MOCK_COLLECTIONS } from "@/lib/data";
import {
  Users, Video, Building2, ShieldAlert, ShieldCheck,
  Clock, TrendingUp, TrendingDown, AlertCircle,
  CheckCircle2, XCircle, Activity, Database, RefreshCw,
  Eye, MoreHorizontal, FileText,
} from "lucide-react";

/* ─── Mock admin-specific data ───────────────────────────────────────────── */
const MOCK_ORGS = [
  { id: "org-1", name: "Acme Robotics", plan: "Enterprise", videos: 8,  status: "Active",  joined: "2025-10-12" },
  { id: "org-2", name: "DeepMind Labs",  plan: "Pro",        videos: 12, status: "Active",  joined: "2025-11-01" },
  { id: "org-3", name: "Tesla AI",       plan: "Enterprise", videos: 22, status: "Active",  joined: "2025-09-15" },
  { id: "org-4", name: "Optimus Corp",   plan: "Starter",    videos: 3,  status: "Pending", joined: "2025-12-10" },
];

const MOCK_REQUESTS = [
  { id: "REQ-001", org: "Acme Robotics",  collection: "Kitchen Activities — Dec 2025", size: "18.5 GB", status: "Pending",  date: "2025-12-14" },
  { id: "REQ-002", org: "DeepMind Labs",  collection: "Kitchen Activities — Dec 2025", size: "12.2 GB", status: "Approved", date: "2025-12-12" },
  { id: "REQ-003", org: "Tesla AI",       collection: "Kitchen Activities — Dec 2025", size: "25.4 GB", status: "Approved", date: "2025-12-10" },
  { id: "REQ-004", org: "Optimus Corp",   collection: "Kitchen Activities — Dec 2025", size: "5.8 GB",  status: "Pending",  date: "2025-12-15" },
];

const ingestionTrend = [
  { month: "Jul", videos: 6,  hours: 40 },
  { month: "Aug", videos: 9,  hours: 55 },
  { month: "Sep", videos: 13, hours: 80 },
  { month: "Oct", videos: 18, hours: 120 },
  { month: "Nov", videos: 28, hours: 210 },
  { month: "Dec", videos: 45, hours: 325 },
];

const piiBreakdown = [
  { name: "No PII",           value: 10, color: "#22C55E" },
  { name: "Blur Required",    value: 2,  color: "#F59E0B" },
];

const qaBreakdown = [
  { name: "Verified",  value: 10, color: "#22C55E" },
  { name: "Pending",   value: 2,  color: "#F59E0B" },
];

const taskDist = [
  { task: "Dishwashing",     count: 6 },
  { task: "Kitchen Clean",   count: 4 },
  { task: "Hanging Clothes", count: 4 },
  { task: "Cooking",         count: 3 },
  { task: "Laundry",         count: 3 },
  { task: "Cutting Veg",     count: 2 },
];

/* ─── Glassmorphism helpers ───────────────────────────────────────────────── */


const tooltipStyle = {
  background: "rgba(15,15,20,0.95)",
  border: "1px solid rgba(46,134,171,0.30)",
  borderRadius: "8px",
  color: "#F0F0F0",
  fontSize: "12px",
};

/* ─── Stat card ────────────────────────────────────────────────────────────── */
function StatCard({
  label, value, sub, subUp, Icon, iconColor, glow,
}: {
  label: string; value: string | number; sub: string; subUp: boolean;
  Icon: React.ElementType; iconColor: string; glow?: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden bg-card border border-border shadow-sm rounded-xl"
    >

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9090A0" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${iconColor}1A`, border: `1px solid ${iconColor}30` }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
      </div>
      <div className="text-3xl font-bold" style={{ color: "#F0F0F0" }}>{value}</div>
      <div className="flex items-center gap-1 text-xs">
        {subUp ? (
          <TrendingUp className="w-3 h-3" style={{ color: "#22C55E" }} />
        ) : (
          <TrendingDown className="w-3 h-3" style={{ color: "#F59E0B" }} />
        )}
        <span style={{ color: subUp ? "#22C55E" : "#F59E0B" }} className="font-medium">{sub}</span>
      </div>
    </div>
  );
}

/* ─── Section header ───────────────────────────────────────────────────────── */
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold" style={{ color: "#F0F0F0" }}>{title}</h2>
      {sub && <p className="text-xs mt-0.5" style={{ color: "#9090A0" }}>{sub}</p>}
    </div>
  );
}

/* ─── Status badge ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
    Active:   { color: "#22C55E", bg: "rgba(34,197,94,0.10)",  border: "rgba(34,197,94,0.25)",  Icon: CheckCircle2 },
    Approved: { color: "#22C55E", bg: "rgba(34,197,94,0.10)",  border: "rgba(34,197,94,0.25)",  Icon: CheckCircle2 },
    Pending:  { color: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.25)", Icon: Clock },
    Rejected: { color: "#EF4444", bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.25)",  Icon: XCircle },
  };
  const s = map[status] ?? map["Pending"];
  const S = s.Icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      <S className="w-3 h-3" />
      {status}
    </span>
  );
}

/* ─── Main admin page ─────────────────────────────────────────────────────── */
export default function AdminPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const totalVideos    = MOCK_VIDEOS.length;
  const totalMinutes   = MOCK_VIDEOS.reduce((a, v) => a + v.duration_minutes, 0);
  const totalHours     = (totalMinutes / 60).toFixed(1);
  const pendingPII     = MOCK_VIDEOS.filter(v => v.pii_check_status !== "No PII").length;
  const pendingQA      = MOCK_VIDEOS.filter(v => v.qa_status !== "Verified").length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const item = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="flex-1 flex flex-col" >
      <Navbar title="Admin Dashboard" isAdmin={true} />

      <main className="flex-1 p-6 overflow-y-auto" >
        <motion.div
          className="max-w-7xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* ── Alert banner ── */}
          {(pendingPII > 0 || pendingQA > 0) && (
            <motion.div
              variants={item}
              className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.30)",
                color: "#F59E0B",
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>{pendingPII}</strong> video{pendingPII !== 1 ? "s" : ""} need PII review ·{" "}
                <strong>{pendingQA}</strong> pending QA verification — action required before delivery.
              </span>
            </motion.div>
          )}

          {/* ── KPI row ── */}
          <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Videos"     value={totalVideos}     sub="+3 this week"      subUp={true}  Icon={Video}       iconColor="#2E86AB" glow="rgba(46,134,171,0.6)" />
            <StatCard label="Dataset Hours"    value={`${totalHours}h`} sub="+18 hrs ingested"  subUp={true}  Icon={Clock}       iconColor="#22C55E" glow="rgba(34,197,94,0.5)"  />
            <StatCard label="PII Flags"        value={pendingPII}      sub="needs blur action" subUp={false} Icon={ShieldAlert}  iconColor="#F59E0B" glow="rgba(245,158,11,0.5)" />
            <StatCard label="Organizations"    value={MOCK_ORGS.length} sub="+1 onboarded"      subUp={true}  Icon={Building2}   iconColor="#A78BFA" glow="rgba(167,139,250,0.5)" />
          </motion.div>

          {/* ── Charts row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Ingestion trend */}
            <motion.div variants={item} className="lg:col-span-2 rounded-2xl p-5 bg-card border border-border shadow-sm rounded-xl">
              <SectionHeader title="Video Ingestion Trend" sub="Monthly growth across the pipeline" />
              <div className="h-[220px]">
                {isClient ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ingestionTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#2E86AB" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#2E86AB" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9090A0", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9090A0", fontSize: 11 }} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(46,134,171,0.3)", strokeWidth: 1 }} />
                      <Area type="monotone" dataKey="videos" stroke="#2E86AB" strokeWidth={2.5} fill="url(#areaGrad)" name="Videos" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm" style={{ color: "#9090A0" }}>
                    Loading…
                  </div>
                )}
              </div>
            </motion.div>

            {/* Task distribution */}
            <motion.div variants={item} className="rounded-2xl p-5 bg-card border border-border shadow-sm rounded-xl">
              <SectionHeader title="Task Distribution" sub="Video count by task type" />
              <div className="h-[220px]">
                {isClient ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskDist} layout="vertical" margin={{ left: 10, right: 16 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="task" type="category"
                        axisLine={false} tickLine={false}
                        tick={{ fill: "#9090A0", fontSize: 11 }} width={90}
                      />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(46,134,171,0.06)" }} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Videos">
                        {taskDist.map((_, i) => (
                          <Cell key={i} fill={["#2E86AB", "#2A7695", "#25667E", "#205668", "#1B4651", "#17363B"][i % 6]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm" style={{ color: "#9090A0" }}>Loading…</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── PII + QA breakdown pills ── */}
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { title: "PII Check Status", data: piiBreakdown },
              { title: "QA Verification Status", data: qaBreakdown },
            ].map(({ title, data }) => (
              <div key={title} className="rounded-2xl p-5 bg-card border border-border shadow-sm rounded-xl">
                <SectionHeader title={title} />
                <div className="space-y-3">
                  {data.map((d) => (
                    <div key={d.name} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: "#F0F0F0" }}>{d.name}</span>
                          <span className="font-bold" style={{ color: d.color }}>{d.value}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${(d.value / totalVideos) * 100}%`, background: d.color, boxShadow: `0 0 8px ${d.color}60` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs pt-1" style={{ color: "#9090A0" }}>
                    Total: {totalVideos} videos
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── Organizations table ── */}
          <motion.div variants={item} className="rounded-2xl overflow-hidden bg-card border border-border shadow-sm rounded-xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <SectionHeader title="Client Organizations" sub={`${MOCK_ORGS.length} registered orgs`} />
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: "rgba(46,134,171,0.15)", color: "#2E86AB", border: "1px solid rgba(46,134,171,0.30)" }}
              >
                <Building2 className="w-3 h-3" /> Manage
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
                  {["Organization", "Plan", "Videos", "Joined", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${h === "" ? "text-right" : ""}`}
                      style={{ color: "#9090A0" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_ORGS.map((org, i) => (
                  <tr
                    key={org.id}
                    className="transition-colors"
                    style={{
                      borderBottom: i < MOCK_ORGS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(46,134,171,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: "rgba(46,134,171,0.15)", color: "#2E86AB", border: "1px solid rgba(46,134,171,0.25)" }}
                        >
                          {org.name[0]}
                        </div>
                        <span className="font-medium" style={{ color: "#F0F0F0" }}>{org.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={
                          org.plan === "Enterprise"
                            ? { color: "#A78BFA", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)" }
                            : org.plan === "Pro"
                            ? { color: "#2E86AB", background: "rgba(46,134,171,0.12)", border: "1px solid rgba(46,134,171,0.25)" }
                            : { color: "#9090A0", background: "rgba(144,144,160,0.10)", border: "1px solid rgba(144,144,160,0.20)" }
                        }
                      >
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-sm" style={{ color: "#F0F0F0" }}>{org.videos}</td>
                    <td className="px-6 py-3.5 text-sm" style={{ color: "#9090A0" }}>{org.joined}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={org.status} /></td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#9090A0" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#2E86AB"; e.currentTarget.style.background = "rgba(46,134,171,0.10)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#9090A0"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* ── Dataset Requests ── */}
          <motion.div variants={item} className="rounded-2xl overflow-hidden bg-card border border-border shadow-sm rounded-xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <SectionHeader title="Dataset Delivery Requests" sub="Pending approvals and active deliveries" />
              <div className="flex items-center gap-2">
                {MOCK_REQUESTS.filter(r => r.status === "Pending").length > 0 && (
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.30)" }}
                  >
                    <AlertCircle className="w-3 h-3" />
                    {MOCK_REQUESTS.filter(r => r.status === "Pending").length} pending
                  </span>
                )}
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
                  {["Request ID", "Organization", "Collection", "Size", "Date", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${h === "" ? "text-right" : ""}`}
                      style={{ color: "#9090A0" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_REQUESTS.map((req, i) => (
                  <tr
                    key={req.id}
                    className="transition-colors"
                    style={{ borderBottom: i < MOCK_REQUESTS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(46,134,171,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-3.5 font-mono font-semibold text-xs" style={{ color: "#2E86AB" }}>{req.id}</td>
                    <td className="px-6 py-3.5 font-medium" style={{ color: "#F0F0F0" }}>{req.org}</td>
                    <td className="px-6 py-3.5 max-w-[200px] truncate text-xs" style={{ color: "#9090A0" }}>{req.collection}</td>
                    <td className="px-6 py-3.5 font-mono text-xs" style={{ color: "#F0F0F0" }}>{req.size}</td>
                    <td className="px-6 py-3.5 text-xs" style={{ color: "#9090A0" }}>{req.date}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={req.status} /></td>
                    <td className="px-6 py-3.5 text-right">
                      {req.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.25)" }}
                          >
                            Approve
                          </button>
                          <button
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: "rgba(239,68,68,0.10)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.20)" }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "#9090A0" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* ── Recent ingestion queue ── */}
          <motion.div variants={item} className="rounded-2xl overflow-hidden bg-card border border-border shadow-sm rounded-xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <SectionHeader title="Recent Ingestion Queue" sub="Latest videos through the pipeline" />
              <button
                className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                style={{ color: "#9090A0" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#2E86AB")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9090A0")}
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
                  {["Video ID", "Worker", "Tasks", "Duration", "File Size", "PII", "QA"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#9090A0" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_VIDEOS.slice().reverse().slice(0, 8).map((v, i) => (
                  <tr
                    key={v.id}
                    className="transition-colors"
                    style={{ borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(46,134,171,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-3 font-mono font-semibold text-xs" style={{ color: "#2E86AB" }}>{v.video_id}</td>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "#9090A0" }}>{v.worker_id}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.task_type.slice(0, 2).map((t, j) => (
                          <span
                            key={j}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{ background: "rgba(46,134,171,0.12)", color: "#2E86AB", border: "1px solid rgba(46,134,171,0.20)" }}
                          >
                            {t}
                          </span>
                        ))}
                        {v.task_type.length > 2 && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{ background: "rgba(144,144,160,0.10)", color: "#9090A0" }}
                          >
                            +{v.task_type.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "#F0F0F0" }}>{v.video_length}</td>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: "#9090A0" }}>{v.file_size}</td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={
                          v.pii_check_status === "No PII"
                            ? { color: "#22C55E", background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.20)" }
                            : { color: "#F59E0B", background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.20)" }
                        }
                      >
                        {v.pii_check_status === "No PII" ? "Clean" : "⚠ Blur"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={
                          v.qa_status === "Verified"
                            ? { color: "#22C55E", background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.20)" }
                            : { color: "#F59E0B", background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.20)" }
                        }
                      >
                        {v.qa_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* ── System health footer ── */}
          <motion.div
            variants={item}
            className="rounded-2xl px-6 py-4 flex flex-wrap items-center gap-6 bg-muted/50 border border-border rounded-xl"
          >
            <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "#9090A0" }}>
              <Activity className="w-3.5 h-3.5" style={{ color: "#2E86AB" }} />
              System Health
            </div>
            {[
              { label: "Data Pipeline",   ok: true  },
              { label: "PII Scanner",     ok: true  },
              { label: "QA Automaton",    ok: true  },
              { label: "Delivery CDN",    ok: true  },
              { label: "Auth Service",    ok: true  },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: "#9090A0" }}>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: ok ? "#22C55E" : "#EF4444", boxShadow: `0 0 6px ${ok ? "#22C55E" : "#EF4444"}` }}
                />
                {label}
              </div>
            ))}
            <span className="ml-auto text-xs" style={{ color: "#9090A0" }}>
              Last sync: {new Date().toLocaleTimeString()}
            </span>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}
