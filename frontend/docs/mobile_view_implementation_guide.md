# Mobile View Implementation Guide

## Overview
This guide details how to implement a desktop/mobile view toggle in a React application while maintaining all functionality and data persistence.

## Prerequisites
- React application with TypeScript
- TailwindCSS for styling
- React Context API knowledge
- Local storage for persistence

## Key Implementation Guidelines

### 1. View Toggle Button Placement
- Place the view toggle button in a consistent, easily accessible location
- For desktop view: Position near the user/app name without disrupting central alignment
- For mobile view: Keep in the header area with clear visibility
- Maintain small icon style for clean UI
- Avoid disrupting existing layout and centered elements

### 2. Element Centering Best Practices
- Use flexbox for consistent centering:
  ```typescript
  // Example of proper centering for header elements
  <div className="flex flex-col items-center">
    <Avatar />
    <div className="text-center">
      <h2 className="text-2xl font-extrabold">App Name</h2>
      <p className="text-sm">Subtitle</p>
    </div>
  </div>
  ```

### 3. Layout Consistency
- Always test changes in both mobile and desktop views before finalizing
- Maintain consistent styling (gradients, fonts, spacing) across views
- Keep functionality identical between views
- Use responsive classes appropriately

### 4. Common Pitfalls to Avoid
- Don't disrupt centered elements when adding new components
- Avoid absolute positioning unless necessary
- Test all interactive elements in both views
- Maintain proper spacing and alignment

## Step-by-Step Implementation

### 1. Create View Context
```typescript
// src/hooks/use-view.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type ViewMode = "desktop" | "mobile";

interface ViewContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const savedMode = localStorage.getItem("viewMode");
    return (savedMode as ViewMode) || "desktop";
  });

  useEffect(() => {
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
```

### 2. Create View Toggle Component
```typescript
// src/components/shared/ViewToggle.tsx
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
      className="transition-colors hover:text-brand-accent p-2"
    >
      {viewMode === "desktop" ? (
        <Smartphone className="h-5 w-5" />
      ) : (
        <Monitor className="h-5 w-5" />
      )}
    </Button>
  );
}
```

### 3. Implement Responsive Layout
```typescript
// src/components/layout/DashboardLayout.tsx
import { useView } from "@/hooks/use-view";
// ... other imports

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { viewMode } = useView();

  if (viewMode === "mobile") {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center justify-center gap-3">
              <Avatar />
              <div className="text-center">
                <h2>App Name</h2>
                <p>Subtitle</p>
              </div>
            </div>
            <ViewToggle />
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen pb-16">
            {children}
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 border-t p-2">
          <MobileNav />
        </nav>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="w-64 fixed inset-y-0">
        <DesktopNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          <ViewToggle />
          {children}
        </div>
      </main>
    </div>
  );
}
```

## Testing Checklist
Before deployment, verify:
- [ ] View toggle appears and functions correctly in both views
- [ ] All text and elements remain properly centered
- [ ] Navigation works consistently in both views
- [ ] View preference persists after page refresh
- [ ] All features remain accessible in both views
- [ ] Smooth transitions between views
- [ ] UI elements maintain proper alignment

## Best Practices
1. Always implement changes for both views simultaneously
2. Test centering and alignment in both views
3. Maintain consistent styling across views
4. Keep the toggle button easily accessible
5. Use flex layout for reliable centering
6. Verify functionality after each major change

## Troubleshooting
1. Centering Issues:
   - Use flex layout with proper justify and align properties
   - Verify parent container width and positioning
   - Check for conflicting margin/padding

2. Layout Disruption:
   - Review flex container structure
   - Check for unintended side effects on sibling elements
   - Verify responsive class application

3. Toggle Button Placement:
   - Use appropriate flex properties for positioning
   - Maintain consistent location across views
   - Avoid absolute positioning unless necessary

## Migration Steps
1. Add view context and provider
2. Implement toggle component
3. Update layout components
4. Test and verify all features
5. Address any alignment issues
6. Verify persistence
7. Final cross-view testing

Remember to maintain consistent functionality and appearance across both views while keeping the toggle button easily accessible without disrupting the layout.