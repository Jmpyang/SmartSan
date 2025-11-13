import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Camera, Send, Award } from "lucide-react";

export default function CommunityReport() {
  const { toast } = useToast();
  const [points, setPoints] = useState(245);
  const [level, setLevel] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPoints = points + 10;
    setPoints(newPoints);
    
    toast({
      title: "Report Submitted! 🎉",
      description: `You earned 10 points! Total: ${newPoints} points`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
          <p className="text-muted-foreground">Help keep your community clean and earn rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Submit a Report</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Issue Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waste">Overflowing Waste Bin</SelectItem>
                      <SelectItem value="littering">Illegal Littering</SelectItem>
                      <SelectItem value="damage">Damaged Infrastructure</SelectItem>
                      <SelectItem value="blocked">Blocked Drainage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="location" 
                      placeholder="Enter or select location" 
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the issue in detail..." 
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait</SelectItem>
                      <SelectItem value="medium">Medium - Address soon</SelectItem>
                      <SelectItem value="high">High - Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Add Photos (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Gamification Panel */}
          <div className="space-y-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-warning" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-4">
                  <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {points}
                  </div>
                  <p className="text-muted-foreground">Total Points</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Level {level}</span>
                    <span className="text-sm text-muted-foreground">{points}/300</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary transition-all duration-500" 
                      style={{ width: `${(points / 300) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">55 points to Level {level + 1}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                    <span className="text-sm">Reports Submitted</span>
                    <span className="font-bold text-success">24</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10">
                    <span className="text-sm">Issues Resolved</span>
                    <span className="font-bold text-secondary">18</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                    <span className="text-sm">Current Streak</span>
                    <span className="font-bold text-warning">7 days 🔥</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl">🏆</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Community Hero</p>
                    <p className="text-xs text-muted-foreground">10 reports in a week</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl">⭐</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Early Reporter</p>
                    <p className="text-xs text-muted-foreground">First to report an issue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
