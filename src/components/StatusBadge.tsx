import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "pending" | "completed" | "alert" | "offline";
  className?: string;
}

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20 hover:bg-success/20",
  },
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
  },
  completed: {
    label: "Completed",
    className: "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20",
  },
  alert: {
    label: "Alert",
    className: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
  },
  offline: {
    label: "Offline",
    className: "bg-muted text-muted-foreground border-border hover:bg-muted",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      <span className="w-2 h-2 rounded-full mr-1.5 bg-current animate-pulse" />
      {config.label}
    </Badge>
  );
};
