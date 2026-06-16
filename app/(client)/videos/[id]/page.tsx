"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { MOCK_VIDEOS } from "@/lib/data";
import { ArrowLeft, CheckCircle2, AlertCircle, FileJson, Play } from "lucide-react";
import Link from "next/link";

const glass = {
  background: "rgba(26,26,46,0.55)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(46,134,171,0.18)",
  boxShadow: "0 4px 32px rgba(0,0,0,0.40)",
};

const dlStyle = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)"
  },
  dt: { color: "#9090A0", fontSize: "12px" },
  dd: { color: "#F0F0F0", fontSize: "12px", fontWeight: 500 }
};

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
    <div className="flex flex-col h-screen" style={{ background: "#0F0F14" }}>
      <Navbar title={video.video_id} />

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row" style={{ background: "transparent" }}>
        
        {/* Left Column - Video Player & Timeline */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto" style={{ borderRight: "1px solid rgba(46,134,171,0.15)" }}>
          <div className="p-6 pb-0">
            <Link href="/explorer" className="inline-flex items-center text-xs font-semibold transition-colors mb-4" style={{ color: "#9090A0" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#F0F0F0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#9090A0"; }}>
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Explorer
            </Link>
          </div>

          <div className="px-6 flex-1 max-w-5xl mx-auto w-full pb-10">
            
            {/* Video Player */}
            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(46,134,171,0.25)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
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
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-bold" style={{ color: "#F0F0F0" }}>Activity Timeline</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: "rgba(46,134,171,0.15)", color: "#2E86AB", border: "1px solid rgba(46,134,171,0.30)" }}>
                  System Generated
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden" style={glass}>
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {video.task_type.map((task, i) => {
                    const totalMins = video.duration_minutes;
                    const taskMins = Math.floor(totalMins / video.task_type.length);
                    const startMin = i * taskMins;
                    const endMin = i === video.task_type.length - 1 ? totalMins : (i + 1) * taskMins;

                    return (
                      <div key={i} className="flex items-center p-4 transition-colors hover:bg-white/5">
                        <div className="w-24 font-mono text-xs" style={{ color: "#9090A0" }}>
                          {String(startMin).padStart(2, '0')}:00 – {String(endMin).padStart(2, '0')}:00
                        </div>
                        <div className="flex-1 flex items-center gap-3 pl-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="w-2 h-2 rounded-full" style={{ background: "#2E86AB", boxShadow: "0 0 8px #2E86AB" }} />
                          <span className="text-sm font-semibold" style={{ color: "#F0F0F0" }}>{task}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Related Videos */}
            <div className="mt-10">
              <h3 className="text-sm font-bold mb-4" style={{ color: "#F0F0F0" }}>More from this Collection</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedVideos.map(rv => (
                  <Link href={`/videos/${rv.id}`} key={rv.id} className="group block">
                    <div className="aspect-video rounded-xl overflow-hidden relative mb-2"
                      style={{ border: "1px solid rgba(46,134,171,0.20)", transition: "border-color 0.2s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(46,134,171,0.50)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(46,134,171,0.20)"; }}>
                      <img src={rv.thumbnail_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-1.5 left-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded text-white"
                        style={{ background: "rgba(0,0,0,0.70)", backdropFilter: "blur(4px)" }}>
                        {rv.video_length}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(46,134,171,0.9)", boxShadow: "0 4px 12px rgba(46,134,171,0.4)" }}>
                          <Play className="w-3.5 h-3.5 ml-0.5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold truncate" style={{ color: "#F0F0F0" }}>{rv.video_id}</div>
                    <div className="text-[10px] truncate mt-0.5" style={{ color: "#9090A0" }}>{rv.task_type.join(", ")}</div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Metadata Panel */}
        <div className="w-full lg:w-[380px] shrink-0 overflow-y-auto" style={{ background: "rgba(15,15,20,0.85)", backdropFilter: "blur(16px)" }}>
          <div className="p-6 space-y-8">
            <h2 className="text-xl font-bold" style={{ color: "#F0F0F0" }}>Video Details</h2>
            
            {/* Section A - Core Info */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider pb-2 mb-2"
                style={{ color: "#9090A0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Core Information</h3>
              <div>
                <div style={dlStyle.container}><span style={dlStyle.dt}>Video ID</span><span style={{...dlStyle.dd, fontFamily: "monospace", color: "#2E86AB"}}>{video.video_id}</span></div>
                <div style={dlStyle.container}><span style={dlStyle.dt}>Worker ID</span><span style={{...dlStyle.dd, fontFamily: "monospace"}}>{video.worker_id}</span></div>
                <div style={dlStyle.container}><span style={dlStyle.dt}>Date</span><span style={dlStyle.dd}>{video.recording_date}</span></div>
                <div style={dlStyle.container}><span style={dlStyle.dt}>Environment</span><span style={dlStyle.dd}>{video.environment}</span></div>
                <div style={dlStyle.container}><span style={dlStyle.dt}>Duration</span><span style={dlStyle.dd}>{video.duration_minutes} min ({video.video_length})</span></div>
                <div style={{...dlStyle.container, borderBottom: "none"}}><span style={dlStyle.dt}>File Size</span><span style={dlStyle.dd}>{video.file_size}</span></div>
              </div>
            </div>

            {/* Section B - Technical Specs */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider pb-2 mb-2"
                style={{ color: "#9090A0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Technical Specs</h3>
              <div>
                <div style={dlStyle.container}><span style={dlStyle.dt}>Resolution</span><span style={dlStyle.dd}>{video.resolution}</span></div>
                <div style={dlStyle.container}><span style={dlStyle.dt}>Frame Rate</span><span style={dlStyle.dd}>{video.frame_rate}</span></div>
                <div style={dlStyle.container}><span style={dlStyle.dt}>Audio</span><span style={dlStyle.dd}>{video.audio_quality}</span></div>
                <div style={dlStyle.container}><span style={dlStyle.dt}>Lighting</span><span style={dlStyle.dd}>{video.lighting_quality}</span></div>
                <div style={{...dlStyle.container, borderBottom: "none"}}><span style={dlStyle.dt}>Hands Visible</span><span style={dlStyle.dd}>{video.hands_visible ? "Yes" : "No"}</span></div>
              </div>
            </div>

            {/* Section C - Compliance */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider pb-3 mb-3"
                style={{ color: "#9090A0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Compliance & QA Pipeline</h3>
              <div className="space-y-3">
                <div className="rounded-xl p-3" style={{ background: "rgba(26,26,46,0.50)", border: "1px solid rgba(46,134,171,0.15)" }}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: "#F0F0F0" }}>PII Sanitization</span>
                    {video.pii_check_status === "No PII" ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#22C55E" }}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Clean
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#F59E0B" }}>
                        <AlertCircle className="w-3.5 h-3.5" /> {video.pii_check_status}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "#9090A0" }}>
                    Automated face and license plate detection completed. No manual blurring required.
                  </p>
                </div>
                
                <div className="rounded-xl p-3" style={{ background: "rgba(26,26,46,0.50)", border: "1px solid rgba(46,134,171,0.15)" }}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: "#F0F0F0" }}>Manual QA Review</span>
                    {video.qa_status === "Verified" ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#22C55E" }}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#F59E0B" }}>
                        <AlertCircle className="w-3.5 h-3.5" /> Pending Review
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "#9090A0" }}>
                    Reviewed by Senior Data Analyst (ID: QA_771) on {video.recording_date}.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "linear-gradient(135deg, #2E86AB, #1a6a8a)", color: "#F0F0F0", boxShadow: "0 4px 16px rgba(46,134,171,0.30)" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(46,134,171,0.45)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(46,134,171,0.30)"; }}>
                <FileJson className="w-4 h-4" /> Download Metadata
              </button>
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(26,26,46,0.60)", color: "#F0F0F0", border: "1px solid rgba(255,255,255,0.10)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(46,134,171,0.15)"; e.currentTarget.style.borderColor = "rgba(46,134,171,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(26,26,46,0.60)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}>
                Request Similar Data
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
