import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Leaf,
  Users,
  BarChart3,
  Smartphone,
  Globe,
  Award,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import heroImage from "@/assets/hero-sanitation.jpg";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Index() {
  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First Access",
      description: "Report issues and track progress from anywhere, on any device"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Powered",
      description: "Gamified reporting system that rewards active community participation"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-Time Analytics",
      description: "AI-powered insights and predictive maintenance for optimal efficiency"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multilingual Support",
      description: "Accessible across diverse communities with multiple language options"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Impact Tracking",
      description: "Monitor waste reduction and sustainability goals in real-time"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Sustainability Focused",
      description: "Built with environmental impact and long-term sustainability in mind"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Issues Resolved", value: "125K+" },
    { label: "Waste Reduced", value: "18.5%" },
    { label: "Communities", value: "200+" }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-8">
              <Leaf className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Sustainable Sanitation Management</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              Building Cleaner Communities Together
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto drop-shadow">
              Empowering communities, workers, and administrators with intelligent sanitation management.
              Real-time monitoring, AI-driven insights, and collaborative problem-solving.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button variant="hero" size="lg" className="text-lg">
                  View Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/report">
                <Button variant="secondary" size="lg" className="text-lg">
                  Report an Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-lg border-t border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comprehensive Sanitation Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete platform designed for scalability, accessibility, and real-world impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of communities already making a difference with EcoCycle
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <div className="flex items-center gap-2 text-primary-foreground">
              <CheckCircle2 className="w-5 h-5" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground">
              <CheckCircle2 className="w-5 h-5" />
              <span>Mobile & web ready</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground">
              <CheckCircle2 className="w-5 h-5" />
              <span>Multi-language support</span>
            </div>
          </div>

          <Link to="/dashboard">
            <Button variant="secondary" size="lg" className="text-lg shadow-lg">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EcoCycle</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 EcoCycle. Building sustainable communities worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}