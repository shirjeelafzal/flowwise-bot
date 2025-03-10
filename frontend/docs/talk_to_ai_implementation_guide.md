# Implementation Guide: Adding "Talk to AI" Feature

## Overview
This guide details how to add a chat interface with multi-channel support (WhatsApp, Telegram, SMS) to communicate with an AI agent.

## Prerequisites
- React frontend with TypeScript
- SQLite3 database
- Express backend
- shadcn/ui components
- TanStack Query for data fetching

## Step 1: Database Schema Setup
In `shared/schema.ts`, add the following schemas:

```typescript
// Channel schema
export const channels = sqliteTable("channels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  credentials: text("credentials").notNull(),
  config: text("config").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Validation schemas for different channel types
const credentialSchemas = {
  whatsapp: z.object({
    apiKey: z.string().min(1, "API Key is required"),
    phoneNumberId: z.string().min(1, "Phone Number ID is required"),
    businessAccountId: z.string().min(1, "Business Account ID is required"),
  }),
  telegram: z.object({
    botToken: z.string().min(1, "Bot Token is required"),
    webhookUrl: z.string().url("Must be a valid webhook URL"),
  }),
  sms: z.object({
    accountSid: z.string().min(1, "Account SID is required"),
    authToken: z.string().min(1, "Auth Token is required"),
    phoneNumber: z.string().min(1, "Phone Number is required"),
  }),
};
```

## Step 2: Add Navigation Link
In `components/layout/Sidebar.tsx`, add the chat route:

```typescript
const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Bot, label: "Talk to [AI Name]", href: "/chat" },
  // ... other menu items
];
```

## Step 3: Register Route
In `App.tsx`, add the new route:

```typescript
import Chat from "./pages/Chat";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/chat" component={Chat} />
        {/* ... other routes */}
      </Switch>
    </DashboardLayout>
  );
}
```

## Step 4: Create Chat Page
Create `pages/Chat.tsx` with these key components:

1. Channel Selection Card:
```typescript
<Card className="relative overflow-hidden bg-[#111318] border-brand-silver/20 p-6">
  <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-purple/5 opacity-30" />
  <div className="space-y-4">
    {/* Channel toggles */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-brand-accent" />
        <Label>WhatsApp</Label>
      </div>
      <Switch
        checked={channelStates.whatsapp}
        onCheckedChange={() => handleChannelToggle('whatsapp')}
      />
    </div>
    {/* Repeat for Telegram and SMS */}
  </div>
</Card>
```

2. Chat Interface:
```typescript
<Card className="flex-1 relative overflow-hidden">
  <ScrollArea className="flex-1 p-6">
    {messages.map((message, index) => (
      <div key={index} className={`flex items-start gap-3 ${
        message.role === "assistant" ? "justify-start" : "justify-end"
      }`}>
        {/* Message content */}
      </div>
    ))}
  </ScrollArea>
  <div className="p-4 border-t">
    <div className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <Button onClick={handleSendMessage}>
        <Send className="w-4 h-4" />
      </Button>
    </div>
  </div>
</Card>
```

## Step 5: Backend Implementation
In `server/routes.ts`, add these endpoints:

1. Channel Status Check:
```typescript
app.get("/api/channels/active", async (_req, res) => {
  try {
    const channels = await storage.listChannels();
    const activeChannels = channels.filter(channel => channel.isActive);
    res.json(activeChannels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active channels" });
  }
});
```

2. Channel Testing:
```typescript
app.post("/api/channels/:type/test", async (req, res) => {
  try {
    const { type } = req.params;
    const credentials = req.body;
    
    let handler = getChannelHandler(type, credentials);
    const isValid = await handler.validateCredentials(credentials);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

## Step 6: Channel Handlers
Create handlers for each channel type:

```typescript
class WhatsAppHandler {
  async validateCredentials(credentials) {
    const { apiKey, phoneNumberId, businessAccountId } = credentials;
    // Implement validation logic
  }
}

class TelegramHandler {
  async validateCredentials(credentials) {
    const { botToken, webhookUrl } = credentials;
    // Implement validation logic
  }
}

class TwilioHandler {
  async validateCredentials(credentials) {
    const { accountSid, authToken, phoneNumber } = credentials;
    // Implement validation logic
  }
}
```

## Step 7: Testing and Verification
1. Test page loading
2. Verify channel toggles work
3. Test message sending/receiving
4. Verify error handling
5. Test channel integration

## Customization
To adapt this for another AI agent:
1. Update the sidebar label and icon
2. Modify the chat interface styling
3. Update the channel handlers for specific needs
4. Adjust the AI response handling logic
5. Customize error messages and notifications

## Common Issues and Solutions
1. Channel toggle not working:
   - Verify channel credentials in database
   - Check handler implementation
2. Messages not sending:
   - Verify active channel state
   - Check API endpoints
3. UI not updating:
   - Verify React Query cache invalidation
   - Check state management

## Best Practices
1. Always validate channel credentials before activation
2. Implement proper error handling
3. Use toast notifications for user feedback
4. Maintain consistent styling with the design system
5. Follow the established type system
