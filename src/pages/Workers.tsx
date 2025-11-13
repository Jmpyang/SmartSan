import { Navigation } from "@/components/Navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Clock, 
  MapPin,
  Navigation as NavigationIcon,
  Phone
} from "lucide-react";

export default function Workers() {
  const tasks = [
    { 
      id: 1, 
      location: "Main Street & 5th Ave", 
      type: "Waste Collection",
      priority: "high",
      status: "pending",
      distance: "0.5 km",
      estimatedTime: "10 min"
    },
    { 
      id: 2, 
      location: "Park Avenue", 
      type: "Bin Maintenance",
      priority: "medium",
      status: "active",
      distance: "1.2 km",
      estimatedTime: "15 min"
    },
    { 
      id: 3, 
      location: "Central Market", 
      type: "Emergency Cleanup",
      priority: "high",
      status: "alert",
      distance: "2.1 km",
      estimatedTime: "20 min"
    },
  ];

  const completedToday = [
    { id: 1, location: "Beach Road", time: "2 hours ago", type: "Waste Collection" },
    { id: 2, location: "School District", time: "3 hours ago", type: "Street Cleaning" },
    { id: 3, location: "Market Square", time: "4 hours ago", type: "Bin Replacement" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Worker Dashboard</h1>
          <p className="text-muted-foreground">Manage and track your daily tasks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Tasks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Active Tasks
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  {tasks.length} pending
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border border-border hover:border-primary transition-all bg-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{task.type}</h3>
                        <StatusBadge status={task.status as any} />
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {task.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        <NavigationIcon className="w-3 h-3 inline mr-1" />
                        {task.distance}
                      </span>
                      <span className="text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        ~{task.estimatedTime}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <NavigationIcon className="w-3 h-3 mr-1" />
                        Navigate
                      </Button>
                      <Button variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Today's Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-success mb-2">
                    {completedToday.length}
                  </div>
                  <p className="text-muted-foreground">Tasks Completed</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Efficiency</span>
                    <span className="font-bold text-success">96%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: '96%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">8.2km</p>
                    <p className="text-xs text-muted-foreground">Distance</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">4.5h</p>
                    <p className="text-xs text-muted-foreground">Active Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedToday.map((task) => (
                  <div 
                    key={task.id}
                    className="p-3 rounded-lg bg-success/5 border border-success/20"
                  >
                    <p className="font-medium text-sm mb-1">{task.location}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{task.type}</p>
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <Button variant="destructive" className="w-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
