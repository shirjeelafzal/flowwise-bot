import { Button } from "@/components/ui/button";
import { Monitor, Smartphone } from "lucide-react";
import { useView } from "@/hooks/use-view";

export default function ViewToggle() {
  const { viewMode, toggleViewMode } = useView();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleViewMode}
      className={`transition-colors hover:text-brand-accent p-2 ${viewMode === "mobile" ? "w-full justify-center py-2" : ""}`}
    >
      {viewMode === "desktop" ? (
        <Smartphone className="h-5 w-5" />
      ) : (
        <Monitor className="h-5 w-5" />
      )}
    </Button>
  );
}