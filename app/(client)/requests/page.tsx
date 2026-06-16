import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Clock } from "lucide-react";

export default function RequestsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Data Requests" />
      
      <main className="flex-1 p-6 overflow-y-auto bg-surface">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Custom Data Requests</h2>
              <p className="text-muted-foreground mt-1">Request new dataset collections tailored to your specific AI models.</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>

          <div className="grid gap-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Retail Store Environment - Top Down Angle</CardTitle>
                      <CardDescription>Requested on Dec 12, 2025</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-medium text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/20">
                    <Clock className="w-4 h-4 mr-2" />
                    In Review
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We require a new dataset focused on top-down camera angles of customers interacting with retail shelves, specifically grabbing items and returning them. Minimal lighting variations.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div><span className="font-medium">Target Volume:</span> 50 Hours</div>
                    <div><span className="font-medium">Environment:</span> Supermarket/Retail</div>
                    <div><span className="font-medium">Priority:</span> High</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-lg bg-surface/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Other Active Requests</h3>
              <p className="text-muted-foreground max-w-sm mb-6 text-sm">
                You can request custom data collection campaigns if our existing library doesn't meet your requirements.
              </p>
              <Button variant="outline" className="border-border">Submit a Request</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
