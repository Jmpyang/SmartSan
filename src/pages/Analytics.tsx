import { Navigation } from "@/components/Navigation";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Leaf,
  Calendar,
  Target
} from "lucide-react";

export default function Analytics() {
  const monthlyData = [
    { month: "Jan", waste: 85, efficiency: 88 },
    { month: "Feb", waste: 92, efficiency: 90 },
    { month: "Mar", waste: 78, efficiency: 92 },
    { month: "Apr", waste: 88, efficiency: 94 },
    { month: "May", waste: 75, efficiency: 96 },
    { month: "Jun", waste: 70, efficiency: 94 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground">Track performance and environmental impact</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Waste Reduction"
            value="18.5%"
            change={5.2}
            trend="up"
            icon={<Leaf className="w-6 h-6" />}
            subtitle="vs last quarter"
          />
          <MetricCard
            title="Response Time"
            value="16 min"
            change={12}
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
            subtitle="Average"
          />
          <MetricCard
            title="Community Reports"
            value="1,245"
            change={28}
            trend="up"
            icon={<Users className="w-6 h-6" />}
            subtitle="This month"
          />
          <MetricCard
            title="Goal Achievement"
            value="94%"
            change={8}
            trend="up"
            icon={<Target className="w-6 h-6" />}
            subtitle="Sustainability targets"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monthly Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">
                          Waste: <span className="font-medium text-foreground">{data.waste}T</span>
                        </span>
                        <span className="text-muted-foreground">
                          Efficiency: <span className="font-medium text-success">{data.efficiency}%</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-secondary transition-all" 
                          style={{ width: `${data.waste}%` }}
                        />
                      </div>
                      <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary transition-all" 
                          style={{ width: `${data.efficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Impact Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-success/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">CO₂ Reduced</span>
                  <span className="text-2xl font-bold text-success">142T</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success" style={{ width: '75%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">75% of annual target</p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Recycling Rate</span>
                  <span className="text-2xl font-bold text-secondary">68%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '68%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Up 12% from last year</p>
              </div>

              <div className="p-4 rounded-lg bg-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Water Saved</span>
                  <span className="text-2xl font-bold text-primary">24,500L</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: '82%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Through efficient operations</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Quarterly Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-gradient-card">
                <p className="text-sm text-muted-foreground mb-2">Q1 2024</p>
                <p className="text-3xl font-bold mb-1">267T</p>
                <p className="text-sm text-success">↑ 8% vs Q4 2023</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-gradient-card">
                <p className="text-sm text-muted-foreground mb-2">Q2 2024</p>
                <p className="text-3xl font-bold mb-1">233T</p>
                <p className="text-sm text-success">↑ 13% improvement</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-gradient-primary">
                <p className="text-sm text-primary-foreground/80 mb-2">Projected Q3</p>
                <p className="text-3xl font-bold text-primary-foreground mb-1">210T</p>
                <p className="text-sm text-primary-foreground/80">↑ 10% target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
