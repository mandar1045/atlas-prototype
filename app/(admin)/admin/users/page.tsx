"use client";

import { Navbar } from "@/components/layout/navbar";
import { Wrench } from "lucide-react";

export default function UserManagementPage() {
  return (
    <div className="flex-1 flex flex-col" >
      <Navbar title="User Management" isAdmin={true} />
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div 
          className="rounded-2xl p-10 text-center max-w-md w-full flex flex-col items-center relative overflow-hidden"
          
        >
          <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center" >
            <Wrench className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-3 text-foreground">Under Construction</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The <strong>User Management</strong> module is currently in development and will be available in the next release of the Locara Atlas platform.
          </p>
        </div>
      </main>
    </div>
  );
}
