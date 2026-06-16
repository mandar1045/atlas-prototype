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
    <div className="flex flex-col h-screen">
      <Navbar title="Dataset Explorer" />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filter Panel */}
        <div className="w-64 border-r border-border bg-surface/50 flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-sm">Filters</h2>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              
              {/* Task Type Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Task Type</h3>
                <div className="space-y-2">
                  {allTasks.map(task => (
                    <label 
                      key={task} 
                      className="flex items-center gap-2 cursor-pointer group"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleTask(task);
                      }}
                    >
                      <div className={`w-4 h-4 rounded-sm border ${selectedTasks.has(task) ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'} flex items-center justify-center transition-colors`}>
                        {selectedTasks.has(task) && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className="text-sm text-foreground">{task}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frame Rate Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Frame Rate</h3>
                <div className="flex flex-wrap gap-2">
                  {["All", "30fps", "60fps"].map(fps => (
                    <Badge 
                      key={fps} 
                      variant={selectedFps === fps ? "default" : "outline"}
                      className={`cursor-pointer ${selectedFps === fps ? 'bg-primary' : 'border-border/50 text-muted-foreground hover:border-primary/50'}`}
                      onClick={() => setSelectedFps(fps)}
                    >
                      {fps}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Resolution Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Resolution</h3>
                <div className="flex flex-wrap gap-2">
                  {["All", "1080p", "720p"].map(res => (
                    <Badge 
                      key={res} 
                      variant={selectedResolution === res ? "default" : "outline"}
                      className={`cursor-pointer ${selectedResolution === res ? 'bg-primary' : 'border-border/50 text-muted-foreground hover:border-primary/50'}`}
                      onClick={() => setSelectedResolution(res)}
                    >
                      {res}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* PII Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">PII Status</h3>
                <div className="flex flex-wrap gap-2">
                  {["All", "No PII", "Blurred Required"].map(pii => (
                    <Badge 
                      key={pii} 
                      variant={selectedPii === pii ? "default" : "outline"}
                      className={`cursor-pointer ${selectedPii === pii ? 'bg-primary' : 'border-border/50 text-muted-foreground hover:border-primary/50'}`}
                      onClick={() => setSelectedPii(pii)}
                    >
                      {pii}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Hands Visible */}
              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Hands Visible Only</h3>
                  <Switch checked={handsVisibleOnly} onCheckedChange={setHandsVisibleOnly} />
                </div>
              </div>

            </div>
          </ScrollArea>
          
          {activeFilterCount > 0 && (
            <div className="p-4 border-t border-border">
              <Button variant="outline" className="w-full border-border/50 text-muted-foreground hover:text-foreground" onClick={clearFilters}>
                <FilterX className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-background/50 relative min-h-0">
          
          {/* Top Bar */}
          <div className="p-6 pb-0 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by task, environment, video ID..." 
                className="pl-11 h-12 bg-surface/80 border-border/50 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <p>Showing 1–{filteredVideos.length} of {MOCK_VIDEOS.length} videos</p>
              
              <div className="flex items-center gap-2 bg-surface p-1 rounded-md border border-border/50">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 rounded-sm ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 rounded-sm ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
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
                  <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No videos found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
                  </div>
                  <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
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
                      <Link href={`/videos/${video.id}`} className={`block group ${viewMode === 'list' ? 'flex gap-6 items-center bg-surface p-4 rounded-xl border border-border hover:border-primary/50 transition-colors' : ''}`}>
                        
                        {/* Thumbnail */}
                        <div className={`relative bg-surface rounded-xl overflow-hidden border border-border ${viewMode === 'grid' ? 'aspect-video mb-3 group-hover:border-primary/50 transition-colors' : 'w-64 aspect-video shrink-0'}`}>
                          <img src={video.thumbnail_url} alt={video.video_id} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                          
                          {/* Duration Badge */}
                          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded-md">
                            {video.video_length}
                          </div>
                          
                          {/* QA Badge */}
                          <div className="absolute top-2 right-2">
                            {video.qa_status === "Verified" ? (
                              <div className="bg-success text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                                <CheckCircle2 className="w-3 h-3" /> VERIFIED
                              </div>
                            ) : (
                              <div className="bg-warning text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                                <AlertCircle className="w-3 h-3" /> PENDING
                              </div>
                            )}
                          </div>

                          {/* Hover Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg shadow-primary/30 transform scale-90 group-hover:scale-100 transition-transform">
                              <Play className="w-5 h-5 ml-1" />
                            </div>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className={`flex-1 ${viewMode === 'grid' ? 'space-y-2' : 'flex flex-col gap-2'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-mono">{video.video_id}</span>
                            <div className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${video.pii_check_status === 'No PII' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                              {video.pii_check_status}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {video.task_type.map((task, i) => (
                              <Badge key={i} variant="secondary" className="bg-surface border-border text-[10px]">
                                {task}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {video.environment}
                            </div>
                            <div className="flex items-center gap-1">
                              <VideoIcon className="w-3 h-3" />
                              {video.resolution} • {video.frame_rate}
                            </div>
                          </div>
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
