# Eva AI Design System Migration Guide

## Layout Structure
1. Dashboard Layout (`dashboard-layout.tsx`)
```tsx
// Core layout structure
<div className="h-screen overflow-hidden flex bg-[#111318] text-brand-silver">
  <Sidebar /> {/* Fixed sidebar */}
  <main className="flex-1 overflow-y-auto relative p-6 ml-64"> {/* Scrollable content */}
    {children}
  </main>
</div>
```

## Key Components

### 1. Sidebar
- Fixed position with cyberpunk-themed background
- Width: 64 (16rem)
- Contains:
  - Logo section (h-24)
  - AI Avatar section
  - Navigation menu

### 2. AI Avatar Section
```tsx
<div className="py-6 px-4">
  <div className="flex flex-col items-center space-y-4">
    <div className="relative group">
      {/* Glowing effect behind avatar */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-accent to-brand-purple opacity-75 rounded-full blur"></div>
      <Avatar className="w-24 h-24 border-3 border-brand-accent/50 relative">
        <AvatarImage 
          src="/path-to-ai-avatar.png" 
          alt="AI Name" 
          className="object-cover scale-[2.0] origin-top"
        />
      </Avatar>
    </div>
    {/* AI Name */}
    <div className="text-center">
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
        AI NAME
      </h2>
      <p className="text-sm text-brand-silver/70">AI Role Description</p>
    </div>
  </div>
</div>
```

### 3. Card Components
Use this structure for feature cards:
```tsx
<Card className="relative overflow-hidden border-brand-silver/20 bg-[#111318]">
  {/* Subtle gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-purple/5 opacity-30"></div>

  <CardHeader className="py-3">
    <CardTitle className="flex items-center gap-2 text-base">
      <Icon className="h-5 w-5" />
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
        Title
      </span>
    </CardTitle>
  </CardHeader>

  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

## Color Scheme
```typescript
const THEME_COLORS = {
  background: '#111318',
  backgroundDark: '#0A0B0E',
  accent: '#38B6FF', // Eva's primary blue
  purple: '#A855F7',
  silver: '#94A3B8',
}
```

## Gradients
1. Text Gradients:
```css
bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple
```

2. Button Gradients:
```css
bg-gradient-to-r from-brand-accent to-brand-purple hover:opacity-90
```

## Image Integration Instructions

### AI Avatar Requirements
1. Place AI avatar image in `client/public/`
2. Image should be:
   - Square aspect ratio
   - Transparent background
   - Minimum 512x512px resolution
   - Preferably a headshot or upper body view
   - Save as PNG format

### Logo Requirements
1. Place logo in `client/public/`
2. Image should be:
   - Transparent background
   - Minimum width of 200px
   - Save as PNG format

### Implementation Notes
1. Avatar Sizing:
   - Use scale-[2.0] for zoomed-in effect
   - origin-top to maintain head position
   - Adjust scale factor based on your AI's image

2. Logo Positioning:
   - Use object-contain for proper scaling
   - Add drop shadow for depth:
   ```css
   drop-shadow-[0_0_10px_rgba(56,182,255,0.3)]
   ```

## Common Page Layouts

### Page Template Structure
For creating placeholder pages, use this template:
```tsx
export default function PageName() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col space-y-4">
        {/* Page Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 to-brand-purple/20 blur-xl"></div>
          <div className="relative">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
              Page Title
            </h1>
            <p className="text-sm text-brand-silver/70">
              Page Description
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <Card className="flex-1 border-brand-silver/20 bg-[#111318]">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Icon className="h-5 w-5" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
                Card Title
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content here */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
```

## Responsive Considerations
- Sidebar: Fixed width at 64 (16rem)
- Main content: Uses flex-1 with ml-64 margin and overflow-y-auto
- Cards: Use grid with responsive columns
- Typography: Scale down on mobile

## Animation Guidelines
1. Use transition-all for smooth state changes
2. Add hover effects on interactive elements
3. Implement subtle gradient animations
4. Use opacity transitions for overlay effects

## Implementation Steps
1. Copy the theme configuration
2. Implement the dashboard layout structure
3. Add the AI avatar component
4. Style the navigation menu
5. Apply the card designs
6. Add gradient effects
7. Implement responsive adjustments

Remember to refer to Eva's implementation images for visual guidance on:
- Avatar positioning and scale
- Gradient intensity
- Spacing between elements
- Card layouts and shadows
- Overall color balance