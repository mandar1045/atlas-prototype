"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from "recharts";
import { MOCK_VIDEOS, MOCK_COLLECTIONS } from "@/lib/data";
import {
  Video, Clock, Folder, CheckCircle, Search, Grid,
  TrendingUp, TrendingDown, Zap,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const taskDistribution = [
  { name: "Dishwashing",     value: 6 },
  { name: "Kitchen Clean",   value: 4 },
  { name: "Cooking",         value: 3 },
  { name: "Laundry",         value: 3 },
  { name: "Hanging Clothes", value: 4 },
  { name: "Cutting Veg",     value: 2 },
];

const dataGrowth = [
  { month: "Jul", hours: 40 },
  { month: "Aug", hours: 55 },
  { month: "Sep", hours: 80 },
  { month: "Oct", hours: 120 },
  { month: "Nov", hours: 210 },
  { month: "Dec", hours: 325 },
];

const BAR_COLORS = ["#2E86AB", "#2A7695", "#25667E", "#205668", "#1B4651", "#17363B"];

/* ─── Style helpers ─────────────────────────────────────────────────────── */

const tooltipStyle = {
  borderRadius: "8px",
  fontSize: "12px",
  background: "#FFFFFF",
  border: "1px solid #E4E4E7",
  color: "#09090B",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

/* ─── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({
  label, value, sub, up, Icon, iconColor, glow,
}: {
  label: string; value: string | number; sub: string; up: boolean;
  Icon: React.ElementType; iconColor: string; glow: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden bg-card border border-border shadow-sm rounded-xl"
    >
      <div className="flex items-center justify-between relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${iconColor}1A`, border: `1px solid ${iconColor}30` }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
      </div>
      <div className="text-3xl font-extrabold relative z-10 text-foreground">
        {value}
      </div>
      <div className="flex items-center gap-1 text-xs relative z-10">
        {up
          ? <TrendingUp className="w-3 h-3 text-success" />
          : <TrendingDown className="w-3 h-3 text-warning" />
        }
        <span className="font-semibold" style={{ color: up ? "#22C55E" : "#F59E0B" }}>{sub}</span>
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const totalVideos    = MOCK_VIDEOS.length;
  const totalMinutes   = MOCK_VIDEOS.reduce((acc, v) => acc + v.duration_minutes, 0);
  const totalHours     = (totalMinutes / 60).toFixed(1);
  const complianceRate = Math.round(
    (MOCK_VIDEOS.filter(v => v.pii_check_status === "No PII").length / totalVideos) * 100
  );
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="flex-1 flex flex-col" >
      <Navbar title="Dashboard Overview" />

      <main className="flex-1 p-6 overflow-y-auto relative" >



        <motion.div
          className="max-w-7xl mx-auto space-y-6 relative"
          style={{ zIndex: 1 }}
          variants={container}
          initial="hidden"
          animate="visible"
        >

          {/* ── KPI Row ── */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Videos"      value={totalVideos}     sub="+12.5% from last month" up={true}  Icon={Video}         iconColor="#2E86AB" glow="rgba(46,134,171,0.7)"  />
            <StatCard label="Dataset Hours"     value={`${totalHours}`} sub="+8.2% from last month"  up={true}  Icon={Clock}         iconColor="#22C55E" glow="rgba(34,197,94,0.6)"  />
            <StatCard label="Active Collections" value={MOCK_COLLECTIONS.length} sub="+1 new this week" up={true} Icon={Folder}    iconColor="#A78BFA" glow="rgba(167,139,250,0.6)" />
            <StatCard label="Compliance Rate"   value={`${complianceRate}%`} sub="-2.1% from last month" up={false} Icon={CheckCircle} iconColor="#F59E0B" glow="rgba(245,158,11,0.6)" />
          </motion.div>

          {/* ── Charts Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <motion.div variants={item} className="rounded-2xl p-5 bg-card border border-border shadow-sm rounded-xl">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-foreground">Total Data Growth</h2>
                <p className="text-xs mt-0.5 text-muted-foreground">Cumulative dataset hours ingested</p>
              </div>
              <div className="h-[230px]">
                {isClient ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataGrowth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#2E86AB" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="#2E86AB" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#71717A", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717A", fontSize: 11 }} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(46,134,171,0.1)" }} />
                      <Area type="monotone" dataKey="hours" stroke="#0070F3" strokeWidth={2.5}
                        fill="url(#areaBlue)" name="Hours" dot={false} activeDot={{ r: 5, fill: "#0070F3", stroke: "#FFFFFF", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Loading…</div>
                )}
              </div>
            </motion.div>

            <motion.div variants={item} className="rounded-2xl p-5 bg-card border border-border shadow-sm rounded-xl">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-foreground">Task Distribution</h2>
                <p className="text-xs mt-0.5 text-muted-foreground">Video count by task category</p>
              </div>
              <div className="h-[230px]">
                {isClient ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskDistribution} layout="vertical" margin={{ left: 10, right: 16 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name" type="category" axisLine={false} tickLine={false}
                        tick={{ fill: "#71717A", fontSize: 11 }} width={100}
                      />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(46,134,171,0.05)" }} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Videos">
                        {taskDistribution.map((_, i) => (
                          <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Loading…</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── Quick Actions + Recent Queue ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

            {/* Quick actions */}
            <motion.div variants={item} className="lg:col-span-1 rounded-2xl p-5 bg-card border border-border shadow-sm rounded-xl">
              <h2 className="text-sm font-bold mb-4 text-foreground">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/collections" className="block">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left text-primary"
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(46,134,171,0.18)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(46,134,171,0.10)"; }}
                  >
                    <Grid className="w-4 h-4" /> Browse Collections
                  </button>
                </Link>
                <Link href="/explorer" className="block">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                    
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.08)"; }}
                  >
                    <Search className="w-4 h-4" /> Search Dataset
                  </button>
                </Link>

                <div
                  className="mt-4 pt-4 space-y-2"
                  
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    System Status
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-2 h-2 rounded-full bg-success" style={{
                      animation: "pulse 2s infinite" }} />
                    <span className="text-xs">Data Pipeline Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-warning" />
                    <span className="text-xs text-muted-foreground">API Latency: 42ms</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent ingestion queue */}
            <motion.div variants={item} className="lg:col-span-3 rounded-2xl overflow-hidden bg-card border border-border shadow-sm rounded-xl">
              <div className="px-5 pt-5 pb-3" >
                <h2 className="text-sm font-bold text-foreground">Recent Ingestion Queue</h2>
                <p className="text-xs mt-0.5 text-muted-foreground">Latest videos added to your collections</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr >
                    {["Video ID", "Tasks", "Duration", "Date", "QA Status"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground ${i === 4 ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_VIDEOS.slice(-6).reverse().map((video, i) => (
                    <tr
                      key={video.id}
                      className="transition-colors"
                      style={{ borderBottom: i < 5 ? "1px solid #E4E4E7" : "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(46,134,171,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-5 py-3 font-mono font-semibold text-xs text-primary">
                        {video.video_id}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {video.task_type.slice(0, 2).map((task, j) => (
                            <span
                              key={j}
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium text-primary bg-primary/10 border border-primary/20"
                            >
                              {task}
                            </span>
                          ))}
                          {video.task_type.length > 2 && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] text-muted-foreground bg-muted border border-border"
                            >
                              +{video.task_type.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-foreground">
                        {video.video_length}
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">
                        {video.recording_date}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${video.qa_status === "Verified" ? "text-success bg-success/10 border-success/20" : "text-warning bg-warning/10 border-warning/20"}`}
                        >
                          {video.qa_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
