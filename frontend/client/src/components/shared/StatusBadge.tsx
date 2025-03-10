import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  active: boolean;
  className?: string;
}

export default function StatusBadge({ active, className }: StatusBadgeProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn(
        "w-2 h-2 rounded-full",
        active ? "bg-green-500" : "bg-gray-400"
      )} />
      <span className="text-sm text-muted-foreground">
        {active ? "Connected" : "Not Connected"}
      </span>
    </div>
  );
}
