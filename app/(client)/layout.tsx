import { Sidebar } from "@/components/layout/sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin={false} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
