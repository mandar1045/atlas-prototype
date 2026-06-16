"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { MOCK_VIDEOS } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ArrowLeft, CheckCircle2, AlertCircle, FileJson } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isClient, setIsClient] = useState(false);
  const video = MOCK_VIDEOS.find(v => v.id === resolvedParams.id) || MOCK_VIDEOS[0];
  const relatedVideos = MOCK_VIDEOS.filter(v => v.collection_id === video.collection_id && v.id !== video.id).slice(0, 4);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar title={video.video_id} />
      
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Column - Video Player & Timeline */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface/30 border-r border-border overflow-y-auto">
          <div className="p-6 pb-0">
            <Link href="/explorer" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Explorer
            </Link>
          </div>

          <div className="px-6 flex-1 max-w-5xl mx-auto w-full">
            {/* Video Player Container */}
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl shadow-primary/5 border border-border">
              <video 
                className="w-full h-full object-contain"
                controls
                poster={video.thumbnail_url}
                preload="metadata"
              >
                <source src={video.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Timeline */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Activity Timeline
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">System Generated</Badge>
              </h3>
              <Card className="bg-surface border-border shadow-md">
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {video.task_type.map((task, i) => {
                      const totalMins = video.duration_minutes;
                      const taskMins = Math.floor(totalMins / video.task_type.length);
                      const startMin = i * taskMins;
                      const endMin = i === video.task_type.length - 1 ? totalMins : (i + 1) * taskMins;
                      
                      return (
                        <div key={i} className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                          <div className="w-24 font-mono text-sm text-muted-foreground">
                            {String(startMin).padStart(2, '0')}:00 – {String(endMin).padStart(2, '0')}:00
                          </div>
                          <div className="flex-1 flex items-center gap-3 pl-4 border-l border-border/50">
                            <div className="w-2 h-2 rounded-full bg-secondary" />
                            <span className="font-medium">{task}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Related Videos */}
            <div className="mt-8 mb-12">
              <h3 className="text-lg font-semibold mb-4">More from this Collection</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedVideos.map(rv => (
                  <Link href={`/videos/${rv.id}`} key={rv.id} className="group block">
                    <div className="aspect-video bg-surface rounded-lg overflow-hidden border border-border group-hover:border-primary/50 transition-colors relative mb-2">
                      <img src={rv.thumbnail_url} className="w-full h-full object-cover" alt="" />
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] font-mono px-1 rounded">
                        {rv.video_length}
                      </div>
                    </div>
                    <div className="text-sm font-medium truncate">{rv.video_id}</div>
                    <div className="text-xs text-muted-foreground truncate">{rv.task_type.join(", ")}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Metadata Panel */}
        <div className="w-full lg:w-[400px] bg-surface flex flex-col shrink-0">
          <ScrollArea className="flex-1 p-6">
            <h2 className="text-xl font-bold mb-6">Video Details</h2>
            
            <div className="space-y-6">
              {/* Section A - Core Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider border-b border-border/50 pb-2">Core Information</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Video ID</dt>
                    <dd className="text-sm font-mono">{video.video_id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Worker ID</dt>
                    <dd className="text-sm font-mono">{video.worker_id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Date</dt>
                    <dd className="text-sm">{video.recording_date}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Environment</dt>
                    <dd className="text-sm">{video.environment}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Duration</dt>
                    <dd className="text-sm">{video.duration_minutes} min ({video.video_length})</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">File Size</dt>
                    <dd className="text-sm">{video.file_size}</dd>
                  </div>
                </dl>
              </div>

              {/* Section B - Technical Specs */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider border-b border-border/50 pb-2">Technical Specs</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Resolution</dt>
                    <dd className="text-sm">{video.resolution}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Frame Rate</dt>
                    <dd className="text-sm">{video.frame_rate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Audio</dt>
                    <dd className="text-sm">{video.audio_quality}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Lighting</dt>
                    <dd className="text-sm">{video.lighting_quality}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Hands Visible</dt>
                    <dd className="text-sm">{video.hands_visible ? "Yes" : "No"}</dd>
                  </div>
                </dl>
              </div>

              {/* Section C - Compliance */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider border-b border-border/50 pb-2">Compliance & QA Pipeline</h3>
                <dl className="space-y-3 pt-1">
                  <div className="flex flex-col gap-2 bg-surface p-3 rounded-lg border border-border/50 shadow-sm">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-foreground">PII Sanitization</dt>
                      <dd>
                        {video.pii_check_status === "No PII" ? (
                          <div className="flex items-center text-success text-sm font-semibold"><CheckCircle2 className="w-4 h-4 mr-1" /> Verified Clean</div>
                        ) : (
                          <div className="flex items-center text-warning text-sm font-semibold"><AlertCircle className="w-4 h-4 mr-1" /> {video.pii_check_status}</div>
                        )}
                      </dd>
                    </div>
                    <p className="text-xs text-muted-foreground">Automated face and license plate detection completed. No manual blurring required.</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 bg-surface p-3 rounded-lg border border-border/50 shadow-sm">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-foreground">Manual QA Review</dt>
                      <dd>
                        {video.qa_status === "Verified" ? (
                          <div className="flex items-center text-success text-sm font-semibold"><CheckCircle2 className="w-4 h-4 mr-1" /> Approved</div>
                        ) : (
                          <div className="flex items-center text-warning text-sm font-semibold"><AlertCircle className="w-4 h-4 mr-1" /> Pending Review</div>
                        )}
                      </dd>
                    </div>
                    <p className="text-xs text-muted-foreground">Reviewed by Senior Data Analyst (ID: QA_771) on {video.recording_date}.</p>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="mt-8 space-y-3 pb-8">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                <FileJson className="w-4 h-4 mr-2" /> Download Metadata
              </Button>
              <Button variant="outline" className="w-full border-border/50 hover:bg-background">
                Request Similar Data
              </Button>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
