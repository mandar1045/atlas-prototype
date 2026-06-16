import { Sidebar } from "@/components/layout/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen relative" style={{ background: "#0F0F14" }}>

      {/* ── Subtle ambient lighting ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-10%", left: "15%",
          width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46,134,171,0.04) 0%, transparent 70%)",
          filter: "blur(100px)",
        }} />
      </div>

      <Sidebar isAdmin={true} />
      <div className="flex-1 flex flex-col min-w-0 relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
