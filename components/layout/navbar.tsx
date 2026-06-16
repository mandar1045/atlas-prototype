"use client";

import { Bell, Search, User as UserIcon, LogOut, Settings, Shield } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  title?: string;
  isAdmin?: boolean;
  searchPlaceholder?: string;
}

export function Navbar({
  title,
  isAdmin = false,
  searchPlaceholder = "Search datasets...",
}: NavbarProps) {
  const { user, logout } = useAuth();

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

  const displayName = user?.name || "Demo User";
  const initials = getInitials(displayName);

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-10"
      style={{
        background: "rgba(15,15,20,0.90)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(46,134,171,0.12)",
      }}
    >
      {/* Left: title */}
      <div className="flex items-center gap-3 flex-1">
        {isAdmin && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{
              background: "rgba(46,134,171,0.12)",
              color: "#2E86AB",
              border: "1px solid rgba(46,134,171,0.25)",
            }}
          >
            <Shield className="w-3 h-3" /> ADMIN
          </div>
        )}
        <h1
          className="text-lg font-semibold tracking-tight"
          style={{ color: "#F0F0F0" }}
        >
          {title}
        </h1>
      </div>

      {/* Right: search + bells + avatar */}
      <div className="flex items-center gap-3">
        {!isAdmin && (
          <div className="relative w-60 hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: "#9090A0" }}
            />
            <input
              placeholder={searchPlaceholder}
              className="w-full h-9 pl-9 pr-4 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(42,42,62,0.6)",
                border: "1px solid rgba(46,134,171,0.15)",
                color: "#F0F0F0",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2E86AB")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(46,134,171,0.15)")}
            />
          </div>
        )}

        {/* Bell */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ color: "#9090A0", border: "1px solid rgba(255,255,255,0.05)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#F0F0F0";
            e.currentTarget.style.background = "rgba(46,134,171,0.10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9090A0";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Bell className="w-4 h-4" />
          {/* notification dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#EF4444", boxShadow: "0 0 6px #EF4444" }}
          />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all focus:outline-none"
            style={{
              background: "rgba(26,26,46,0.70)",
              border: "1px solid rgba(46,134,171,0.20)",
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #2E86AB, #1a5f7a)",
                color: "#F0F0F0",
              }}
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-none" style={{ color: "#F0F0F0" }}>
                {displayName}
              </p>
              <p className="text-[10px] leading-none mt-0.5" style={{ color: "#9090A0" }}>
                {isAdmin ? "Administrator" : "Client"}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52"
            style={{
              background: "rgba(15,15,20,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(46,134,171,0.20)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <DropdownMenuLabel style={{ color: "#9090A0" }}>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold" style={{ color: "#F0F0F0" }}>{displayName}</p>
                <p className="text-xs" style={{ color: "#9090A0" }}>{user?.email || "user@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: "rgba(255,255,255,0.06)" }} />
            <DropdownMenuGroup>
              <DropdownMenuItem style={{ color: "#9090A0", cursor: "pointer" }}>
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem style={{ color: "#9090A0", cursor: "pointer" }}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator style={{ background: "rgba(255,255,255,0.06)" }} />
            <DropdownMenuItem
              style={{ color: "#EF4444", cursor: "pointer" }}
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
