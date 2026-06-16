"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart, 
  Grid, 
  Search, 
  FileText, 
  Settings, 
  Building2, 
  Users, 
  Video, 
  Activity, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const clientLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart },
    { href: "/collections", label: "Collections", icon: Grid },
    { href: "/explorer", label: "Dataset Explorer", icon: Search },
    { href: "/requests", label: "Dataset Requests", icon: FileText },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const adminLinks = [
    { href: "/admin", label: "Admin Dashboard", icon: BarChart },
    { href: "/admin/organizations", label: "Organizations", icon: Building2 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/collections", label: "Collections", icon: Grid },
    { href: "/admin/videos", label: "Videos", icon: Video },
    { href: "/admin/requests", label: "Requests", icon: FileText },
    { href: "/admin/analytics", label: "Analytics", icon: Activity },
  ];

  const links = isAdmin ? adminLinks : clientLinks;

  return (
    <div className="w-64 border-r border-border bg-sidebar h-screen sticky top-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45 transform" />
          </div>
          <span className="font-bold text-lg tracking-tight">Locara Atlas</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        <div className="px-3 mb-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {isAdmin ? "Admin Portal" : "Client Portal"}
        </div>
        
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group",
                isActive 
                  ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                  : "text-muted-foreground hover:bg-surface/80 hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {link.label}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border/50 bg-surface/30">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10 group"
        >
          <LogOut className="w-4 h-4 group-hover:text-destructive transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
