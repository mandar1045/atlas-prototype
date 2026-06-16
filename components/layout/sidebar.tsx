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
  LogOut,
  Shield,
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
    { href: "/dashboard",   label: "Dashboard",        icon: BarChart },
    { href: "/collections", label: "Collections",       icon: Grid },
    { href: "/explorer",    label: "Dataset Explorer",  icon: Search },
    { href: "/requests",    label: "Dataset Requests",  icon: FileText },
    { href: "/settings",    label: "Settings",          icon: Settings },
  ];

  const adminLinks = [
    { href: "/admin",                label: "Admin Dashboard", icon: BarChart },
    { href: "/admin/organizations",  label: "Organizations",   icon: Building2 },
    { href: "/admin/users",          label: "Users",           icon: Users },
    { href: "/admin/collections",    label: "Collections",     icon: Grid },
    { href: "/admin/videos",         label: "Videos",          icon: Video },
    { href: "/admin/requests",       label: "Requests",        icon: FileText },
    { href: "/admin/analytics",      label: "Analytics",       icon: Activity },
  ];

  const links = isAdmin ? adminLinks : clientLinks;

  return (
    <div
      className="w-64 h-screen sticky top-0 flex flex-col"
      style={{
        background: "rgba(15,15,20,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(46,134,171,0.15)",
      }}
    >
      {/* Logo */}
      <div
        className="h-16 flex items-center px-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2E86AB, #1a6a8a)" }}
          >
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45 transform" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight" style={{ color: "#F0F0F0" }}>
              Locara Atlas
            </span>
            {isAdmin && (
              <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "#2E86AB" }}>
                <Shield className="w-2.5 h-2.5" /> ADMIN
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 py-5 px-3 flex flex-col gap-1 overflow-y-auto">
        <div
          className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "#9090A0" }}
        >
          {isAdmin ? "Admin Portal" : "Client Portal"}
        </div>

        {links.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{
                color: isActive ? "#F0F0F0" : "#9090A0",
                background: isActive
                  ? "rgba(46,134,171,0.15)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(46,134,171,0.25)"
                  : "1px solid transparent",
                boxShadow: isActive
                  ? "0 2px 12px rgba(46,134,171,0.12)"
                  : "none",
              }}
            >
              <Icon
                className="w-4 h-4 transition-colors"
                style={{ color: isActive ? "#2E86AB" : "#9090A0" }}
              />
              {link.label}
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#2E86AB", boxShadow: "0 0 6px #2E86AB" }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div
        className="p-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group"
          style={{ color: "#9090A0" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#EF4444";
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.border = "1px solid rgba(239,68,68,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9090A0";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.border = "1px solid transparent";
          }}
        >
          <LogOut className="w-4 h-4 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
