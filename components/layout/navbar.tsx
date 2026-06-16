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
      
    >
      {/* Left: title */}
      <div className="flex items-center gap-3 flex-1">
        {isAdmin && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-primary"
          >
            <Shield className="w-3 h-3" /> ADMIN
          </div>
        )}
        <h1
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          {title}
        </h1>
      </div>

      {/* Right: search + bells + avatar */}
      <div className="flex items-center gap-3">
        {!isAdmin && (
          <div className="relative w-60 hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-muted-foreground"
            />
            <input
              placeholder={searchPlaceholder}
              className="w-full h-9 pl-9 pr-4 rounded-xl text-sm outline-none transition-all duration-200 text-foreground"
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2E86AB")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(46,134,171,0.15)")}
            />
          </div>
        )}

        {/* Bell */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all text-muted-foreground"
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
            
          />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all focus:outline-none"
            
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-foreground"
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-none text-foreground">
                {displayName}
              </p>
              <p className="text-[10px] leading-none mt-0.5 text-muted-foreground">
                {isAdmin ? "Administrator" : "Client"}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52"
            
          >
            <DropdownMenuLabel className="text-muted-foreground">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator  />
            <DropdownMenuGroup>
              <DropdownMenuItem  className="text-muted-foreground">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem  className="text-muted-foreground">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator  />
            <DropdownMenuItem
              
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
