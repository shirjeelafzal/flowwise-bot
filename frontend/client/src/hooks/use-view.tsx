import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ViewMode = "desktop" | "mobile";

interface ViewContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Check localStorage on initial load
    const savedMode = localStorage.getItem("viewMode");
    return (savedMode as ViewMode) || "desktop";
  });

  useEffect(() => {
    // Persist view mode changes to localStorage
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const toggleViewMode = () => {
    setViewMode(current => current === "desktop" ? "mobile" : "desktop");
  };

  return (
    <ViewContext.Provider value={{ viewMode, toggleViewMode }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
}
