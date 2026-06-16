import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar title="Admin Dashboard" isAdmin={true} />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle>Admin Portal Area</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This is the admin area. In the full version, this will contain data tables for Organizations, Users, Collections, Videos, and Dataset Requests as specified in the PRD.
              </p>
              <Button>Seed Database</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
