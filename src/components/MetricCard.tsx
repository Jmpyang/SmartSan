import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  subtitle?: string;
}

export const MetricCard = ({ title, value, change, trend, icon, subtitle }: MetricCardProps) => {
  return (
    <Card className="bg-gradient-card hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2 text-foreground">{value}</h3>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {change !== undefined && (
              <div className="flex items-center mt-2 text-sm">
                {trend === "up" && (
                  <span className="flex items-center text-success">
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                    +{change}%
                  </span>
                )}
                {trend === "down" && (
                  <span className="flex items-center text-destructive">
                    <ArrowDownIcon className="w-4 h-4 mr-1" />
                    {change}%
                  </span>
                )}
                {trend === "neutral" && (
                  <span className="flex items-center text-muted-foreground">
                    <TrendingUpIcon className="w-4 h-4 mr-1" />
                    {change}%
                  </span>
                )}
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
