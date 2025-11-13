import { Navigation } from "@/components/Navigation";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trash2, 
  Users, 
  MapPin, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function Dashboard() {
  // Mock data
  const recentReports = [
    { id: 1, location: "Main Street & 5th Ave", status: "pending", time: "15 min ago", priority: "high" },
    { id: 2, location: "Park Avenue", status: "active", time: "1 hour ago", priority: "medium" },
    { id: 3, location: "Beach Road", status: "completed", time: "3 hours ago", priority: "low" },
    { id: 4, location: "Central Market", status: "alert", time: "30 min ago", priority: "high" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor sanitation operations in real-time</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Workers"
            value={142}
            change={12}
            trend="up"
            icon={<Users className="w-6 h-6" />}
            subtitle="On duty today"
          />
          <MetricCard
            title="Waste Collected"
            value="24.5T"
            change={8}
            trend="up"
            icon={<Trash2 className="w-6 h-6" />}
            subtitle="This week"
          />
          <MetricCard
            title="Service Efficiency"
            value="94%"
            change={3}
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            subtitle="Target: 90%"
          />
          <MetricCard
            title="Active Reports"
            value={23}
            change={-5}
            trend="down"
            icon={<MapPin className="w-6 h-6" />}
            subtitle="Pending action"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Recent Community Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{report.location}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={report.status as any} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">47</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alerts</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Avg Response Time</span>
                  <span className="font-medium">18 min</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: '85%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}