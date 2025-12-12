
import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Camera, Send, Award, X, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CommunityReport() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Form state
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: "waste", label: "Overflowing Waste Bin" },
    { value: "littering", label: "Illegal Littering" },
    { value: "damage", label: "Damaged Infrastructure" },
    { value: "blocked", label: "Blocked Drainage" },
    { value: "hazard", label: "Health Hazard" },
    { value: "smell", label: "Bad Odor/Smell" },
    { value: "pest", label: "Pest Infestation" },
    { value: "spill", label: "Chemical/Oil Spill" },
    { value: "water", label: "Water Contamination" },
    { value: "other", label: "Other" },
  ];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Format as GeoJSON Point string or just lat,long
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsLoadingLocation(false);
        toast({
          title: "Location detected",
          description: "Your current location has been set",
        });
      },
      (error) => {
        setIsLoadingLocation(false);
        let errorMsg = "Unable to retrieve your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Please enable it in your browser settings.";
        }
        toast({
          title: "Location error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).filter(
        (file) => file.size <= 10 * 1024 * 1024 // 10MB limit
      );
      setImages((prev) => [...prev, ...newImages].slice(0, 3)); // Max 3 images
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !location || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in category, location, and description",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("type", category);

      // Parse location "lat, long" -> GeoJSON
      const [lat, lng] = location.split(',').map(s => parseFloat(s.trim()));
      const locationJson = JSON.stringify({
        type: "Point",
        coordinates: [lng, lat] // GeoJSON is [lng, lat]
      });
      formData.append("location", locationJson);

      formData.append("description", description);

      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Add user ID if authenticated, otherwise it's anonymous (handled by backend optionalAuth)
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: headers, // Do NOT set Content-Type for FormData, browser does it automatically with boundary
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit report');
      }

      toast({
        title: "Report Submitted! 🎉",
        description: isAuthenticated
          ? "Thank you for your contribution! You've earned points."
          : "Your anonymous report has been submitted successfully.",
      });

      // Reset form
      setCategory("");
      setLocation("");
      setDescription("");
      setImages([]);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
          <p className="text-muted-foreground">help keep your community clean</p>
          {!isAuthenticated && (
            <p className="text-sm text-yellow-600 mt-2 bg-yellow-50 p-2 rounded inline-block border border-yellow-200">
              You are reporting anonymously. <a href="/login" className="underline font-bold">Sign in</a> to track issues and earn rewards.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Form */}
          <Card className={isAuthenticated ? "lg:col-span-2" : "lg:col-span-3"}>
            <CardHeader>
              <CardTitle>Submit a Report</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Issue Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="lat, long (or click map pin)"
                        className="pl-10"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGetLocation}
                      disabled={isLoadingLocation}
                      title="Get Current Location"
                    >
                      {isLoadingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Click the pin button to automatically detect your location.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Add Photos (Optional - Max 3)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB each</p>
                  </div>

                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="default" // changed variant to standard
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Gamification Panel - Only show if logged in */}
          {isAuthenticated && (
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
                      245
                    </div>
                    <p className="text-muted-foreground">Total Points</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Level 3</span>
                      <span className="text-sm text-muted-foreground">245/300</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `82%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">55 points to Level 4</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
