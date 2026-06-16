"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { MOCK_VIDEOS, Video } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Search, Grid, List, Play, CheckCircle2, AlertCircle, MapPin, Video as VideoIcon, FilterX } from "lucide-react";
import Link from "next/link";

type ViewMode = "grid" | "list";

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  // Filter States
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [selectedFps, setSelectedFps] = useState<string>("All");
  const [selectedResolution, setSelectedResolution] = useState<string>("All");
  const [selectedPii, setSelectedPii] = useState<string>("All");
  const [handsVisibleOnly, setHandsVisibleOnly] = useState(false);

  // Extract unique task types
  const allTasks = useMemo(() => {
    const tasks = new Set<string>();
    MOCK_VIDEOS.forEach(v => v.task_type.forEach(t => tasks.add(t)));
    return Array.from(tasks);
  }, []);

  // Filter Logic
  const filteredVideos = useMemo(() => {
    return MOCK_VIDEOS.filter((video) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          video.video_id.toLowerCase().includes(query) ||
          video.environment.toLowerCase().includes(query) ||
          video.task_type.some(t => t.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Tasks
      if (selectedTasks.size > 0) {
        const hasTask = video.task_type.some(t => selectedTasks.has(t));
        if (!hasTask) return false;
      }

      // FPS
      if (selectedFps !== "All" && video.frame_rate !== selectedFps) return false;

      // Resolution
      if (selectedResolution !== "All" && video.resolution !== selectedResolution) return false;

      // PII
      if (selectedPii !== "All" && video.pii_check_status !== selectedPii) return false;

      // Hands Visible
      if (handsVisibleOnly && !video.hands_visible) return false;

      return true;
    });
  }, [searchQuery, selectedTasks, selectedFps, selectedResolution, selectedPii, handsVisibleOnly]);

  const toggleTask = (task: string) => {
    const newTasks = new Set(selectedTasks);
    if (newTasks.has(task)) {
      newTasks.delete(task);
    } else {
      newTasks.add(task);
    }
    setSelectedTasks(newTasks);
  };

  const clearFilters = () => {
    setSelectedTasks(new Set());
    setSelectedFps("All");
    setSelectedResolution("All");
    setSelectedPii("All");
    setHandsVisibleOnly(false);
    setSearchQuery("");
  };

  const activeFilterCount = selectedTasks.size + (selectedFps !== "All" ? 1 : 0) + (selectedResolution !== "All" ? 1 : 0) + (selectedPii !== "All" ? 1 : 0) + (handsVisibleOnly ? 1 : 0);

  return (
    <div className="flex flex-col h-screen" >
      <Navbar title="Dataset Explorer" />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filter Panel */}
        <div className="w-64 flex flex-col" >
          <div className="p-4 flex justify-between items-center" >
            <h2 className="font-semibold text-sm text-foreground">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-primary">
                {activeFilterCount} active
              </span>
            )}
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              
              {/* Task Type Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Task Type</h3>
                <div className="space-y-2">
                  {allTasks.map(task => (
                    <label
                      key={task}
                      className="flex items-center gap-2 cursor-pointer group"
                      onClick={(e) => { e.preventDefault(); toggleTask(task); }}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-all border ${selectedTasks.has(task) ? "bg-primary border-primary" : "bg-muted border-border"}`}
                      >
                        {selectedTasks.has(task) && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className="text-sm text-foreground">{task}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frame Rate Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frame Rate</h3>
                <div className="flex flex-wrap gap-2">
                  {["All", "30fps", "60fps"].map(fps => (
                      <button
                        key={fps}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${selectedFps === fps ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-transparent hover:border-border"}`}
                        onClick={() => setSelectedFps(fps)}
                      >
                      {fps}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resolution</h3>
                <div className="flex flex-wrap gap-2">
                  {["All", "1080p", "720p"].map(res => (
                      <button
                        key={res}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${selectedResolution === res ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-transparent hover:border-border"}`}
                        onClick={() => setSelectedResolution(res)}
                      >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* PII Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">PII Status</h3>
                <div className="flex flex-wrap gap-2">
                  {["All", "No PII", "Blurred Required"].map(pii => (
                      <button
                        key={pii}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${selectedPii === pii ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-transparent hover:border-border"}`}
                        onClick={() => setSelectedPii(pii)}
                      >
                      {pii}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hands Visible */}
              <div className="space-y-3 pt-2" >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Hands Visible Only</h3>
                  <Switch checked={handsVisibleOnly} onCheckedChange={setHandsVisibleOnly} />
                </div>
              </div>

            </div>
          </ScrollArea>

          {activeFilterCount > 0 && (
            <div className="p-4" >
              <button
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all text-destructive bg-destructive/10 hover:bg-destructive/20"
                onClick={clearFilters}
              >
                <FilterX className="w-4 h-4" /> Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative min-h-0" >

          {/* Top Bar */}
          <div className="p-6 pb-0 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search by task, environment, video ID…"
                className="w-full h-12 pl-10 pr-4 rounded-xl text-sm outline-none transition-all text-foreground bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <p className="text-muted-foreground">Showing 1–{filteredVideos.length} of {MOCK_VIDEOS.length} videos</p>

              <div className="flex items-center gap-1 p-1 rounded-xl" >
                {(["grid", "list"] as const).map((m) => (
                  <button
                    key={m}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${viewMode === m ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                    onClick={() => setViewMode(m)}
                  >
                    {m === "grid" ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <AnimatePresence mode="popLayout">
              {filteredVideos.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center justify-center h-64 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    >
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">No videos found</h3>
                    <p className="text-sm mt-1 text-muted-foreground">Try adjusting your filters or search query.</p>
                  </div>
                  <button
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all text-primary"
                    onClick={clearFilters}
                  >Clear all filters</button>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className={
                    viewMode === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredVideos.map((video) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      key={video.id}
                    >
                      <Link
                        href={`/videos/${video.id}`}
                        className="block group"
                        style={viewMode === "list" ? {
                          display: "flex", gap: "1.5rem", alignItems: "center",
                          borderRadius: "16px",
                          padding: "16px",
                          transition: "border-color 0.2s",
                        } : {}}
                        onMouseEnter={(e) => { if (viewMode === "list") (e.currentTarget as HTMLElement).style.borderColor = "rgba(46,134,171,0.40)"; }}
                        onMouseLeave={(e) => { if (viewMode === "list") (e.currentTarget as HTMLElement).style.borderColor = "rgba(46,134,171,0.15)"; }}
                      >
                        {/* Thumbnail */}
                        <div
                          className={`relative overflow-hidden ${viewMode === "grid" ? "aspect-video mb-3" : "aspect-video shrink-0"}`}
                          style={{
                            borderRadius: "12px",
                            width: viewMode === "list" ? "240px" : undefined }}
                        >
                          <img src={video.thumbnail_url} alt={video.video_id}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                          {/* Duration */}
                          <div className="absolute bottom-2 left-2 text-white text-xs font-mono px-2 py-0.5 rounded-md"
                            >
                            {video.video_length}
                          </div>

                          {/* QA badge */}
                          <div className="absolute top-2 right-2">
                            {video.qa_status === "Verified" ? (
                              <div className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-success/20 text-success border border-success/30">
                                <CheckCircle2 className="w-3 h-3" /> VERIFIED
                              </div>
                            ) : (
                              <div className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-warning/20 text-warning border border-warning/30">
                                <AlertCircle className="w-3 h-3" /> PENDING
                              </div>
                            )}
                          </div>

                          {/* Play hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-lg">
                              <Play className="w-5 h-5 ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className={`flex-1 ${viewMode === "grid" ? "space-y-2" : "flex flex-col gap-2"}`}>
                          {viewMode === "grid" && (
                            <div
                              className="rounded-xl p-3 space-y-2 bg-card border border-border shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-semibold text-primary">{video.video_id}</span>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${video.pii_check_status === "No PII" ? "text-success bg-success/10 border-success/20" : "text-warning bg-warning/10 border-warning/20"}`}
                                >
                                  {video.pii_check_status}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {video.task_type.map((task, i) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-medium text-primary bg-primary/10 border border-primary/20">
                                    {task}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{video.environment}</span>
                                <span className="flex items-center gap-1"><VideoIcon className="w-3 h-3" />{video.resolution} · {video.frame_rate}</span>
                              </div>
                            </div>
                          )}
                          {viewMode === "list" && (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-semibold text-primary">{video.video_id}</span>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${video.pii_check_status === "No PII" ? "text-success bg-success/10 border-success/20" : "text-warning bg-warning/10 border-warning/20"}`}
                                >
                                  {video.pii_check_status}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {video.task_type.map((task, i) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-medium text-primary bg-primary/10 border border-primary/20">
                                    {task}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{video.environment}</span>
                                <span className="flex items-center gap-1"><VideoIcon className="w-3 h-3" />{video.resolution} · {video.frame_rate}</span>
                              </div>
                            </>
                          )}
                        </div>

                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
