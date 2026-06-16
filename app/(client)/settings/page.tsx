"use client";

import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/components/providers/auth-provider";

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Settings" />
      
      <main className="flex-1 p-6 overflow-y-auto bg-surface">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="space-y-1 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Organization Settings</h2>
            <p className="text-muted-foreground">Manage your account preferences and API access.</p>
          </div>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information and contact email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input defaultValue={user?.name || "Demo User"} className="bg-surface border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input defaultValue={user?.email || "admin@locara-atlas.com"} className="bg-surface border-border" />
                </div>
              </div>
              <Button className="mt-2 bg-primary text-primary-foreground">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive platform updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Data Ingestion Alerts</div>
                  <div className="text-sm text-muted-foreground">Receive an email when new datasets matching your organization's criteria are added.</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">QA Failure Reports</div>
                  <div className="text-sm text-muted-foreground">Get notified if requested datasets fail compliance and PII checks.</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Weekly Digest</div>
                  <div className="text-sm text-muted-foreground">A summary of the week's data growth and platform updates.</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">API Access</CardTitle>
              <CardDescription>Manage your organization's API keys for automated data retrieval.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-surface rounded-md border border-border">
                <div className="font-mono text-sm text-muted-foreground">sk_live_***********************************</div>
                <Button variant="outline" size="sm">Regenerate Key</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Do not share this key with anyone. If you suspect it has been compromised, regenerate it immediately.
              </p>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
