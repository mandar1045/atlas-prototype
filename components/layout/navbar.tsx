"use client";

import { Bell, Search, User as UserIcon, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export function Navbar({ title, isAdmin = false, searchPlaceholder = "Search datasets..." }: NavbarProps) {
  const { user, logout } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const displayName = user?.name || "Demo User";
  const initials = getInitials(displayName);

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {!isAdmin && (
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={searchPlaceholder}
              className="pl-9 bg-surface/50 border-border/50 h-9 text-sm"
            />
          </div>
        )}
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-9 w-9 rounded-full ml-2 focus:outline-none focus:ring-2 focus:ring-primary/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              {initials}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-border" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-foreground">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="focus:bg-surface focus:text-foreground cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-surface focus:text-foreground cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="focus:bg-destructive/10 focus:text-destructive cursor-pointer text-destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
