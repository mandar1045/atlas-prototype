"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid } from "recharts";
import { MOCK_VIDEOS, MOCK_COLLECTIONS } from "@/lib/data";
import { Video, Clock, Folder, CheckCircle, Search, Grid, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const taskDistribution = [
  { name: "Dishwashing", value: 6 },
  { name: "Kitchen Clean", value: 4 },
  { name: "Cooking", value: 3 },
  { name: "Laundry", value: 3 },
  { name: "Hanging Clothes", value: 4 },
  { name: "Cutting Veg", value: 2 },
];

const dataGrowth = [
  { month: 'Jul', hours: 40 },
  { month: 'Aug', hours: 55 },
  { month: 'Sep', hours: 80 },
  { month: 'Oct', hours: 120 },
  { month: 'Nov', hours: 210 },
  { month: 'Dec', hours: 325 },
];

const COLORS = ["#1A3C5E", "#2E86AB", "#22C55E", "#F59E0B"];

export default function DashboardPage() {
  const totalVideos = MOCK_VIDEOS.length;
  const totalMinutes = MOCK_VIDEOS.reduce((acc, v) => acc + v.duration_minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const complianceRate = Math.round((MOCK_VIDEOS.filter(v => v.pii_check_status === "No PII").length / totalVideos) * 100);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Dashboard Overview" />
      
      <main className="flex-1 p-6 overflow-y-auto bg-surface">
        <motion.div 
          className="max-w-7xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={itemVariants}>
              <Card className="bg-card border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Videos</CardTitle>
                  <Video className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalVideos}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 text-success mr-1" />
                    <span className="text-success font-medium">+12.5%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="bg-card border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Dataset Hours</CardTitle>
                  <Clock className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalHours} <span className="text-sm text-muted-foreground font-normal">hrs</span></div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 text-success mr-1" />
                    <span className="text-success font-medium">+8.2%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-card border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Collections</CardTitle>
                  <Folder className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{MOCK_COLLECTIONS.length}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 text-success mr-1" />
                    <span className="text-success font-medium">+1 new</span> this week
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-card border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
                  <CheckCircle className="w-4 h-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{complianceRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <TrendingDown className="w-3 h-3 text-warning mr-1" />
                    <span className="text-warning font-medium">-2.1%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="bg-card border-border shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Total Data Growth</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  {isClient ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dataGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1A3C5E" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#1A3C5E" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="hours" stroke="#1A3C5E" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Loading chart...</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-card border-border shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Task Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  {isClient ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={taskDistribution} layout="vertical" margin={{ left: 30, right: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                        <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {taskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Loading chart...</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Links & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
              <Card className="bg-card border-border shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/collections" className="block">
                    <Button variant="outline" className="w-full justify-start border-border bg-surface hover:bg-primary/5 hover:text-primary transition-all group">
                      <Grid className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-primary" />
                      Browse Collections
                    </Button>
                  </Link>
                  <Link href="/explorer" className="block">
                    <Button variant="outline" className="w-full justify-start border-border bg-surface hover:bg-secondary/5 hover:text-secondary transition-all group">
                      <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-secondary" />
                      Search Dataset
                    </Button>
                  </Link>
                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">System Status</div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      Data Pipeline Active
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-3">
              <Card className="bg-card border-border shadow-sm overflow-hidden h-full">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-semibold">Recent Ingestion Queue</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                  <Table>
                    <TableHeader className="bg-surface">
                      <TableRow className="border-border">
                        <TableHead className="font-semibold text-foreground">Video ID</TableHead>
                        <TableHead className="font-semibold text-foreground">Tasks</TableHead>
                        <TableHead className="font-semibold text-foreground">Duration</TableHead>
                        <TableHead className="font-semibold text-foreground">Ingestion Date</TableHead>
                        <TableHead className="text-right font-semibold text-foreground">QA Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_VIDEOS.slice(-5).reverse().map((video) => (
                        <TableRow key={video.id} className="border-border hover:bg-surface/50 transition-colors cursor-pointer">
                          <TableCell className="font-mono text-sm text-primary font-medium">{video.video_id}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {video.task_type.slice(0, 2).map((task, i) => (
                                <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium text-[10px]">
                                  {task}
                                </Badge>
                              ))}
                              {video.task_type.length > 2 && (
                                <Badge variant="secondary" className="bg-surface text-muted-foreground border-border text-[10px]">
                                  +{video.task_type.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{video.video_length}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{video.recording_date}</TableCell>
                          <TableCell className="text-right">
                            {video.qa_status === "Verified" ? (
                              <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/20 shadow-none">Verified</Badge>
                            ) : (
                              <Badge variant="outline" className="text-warning border-warning/30 bg-warning/5 shadow-none">Pending</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
