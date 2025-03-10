import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChannelSchema, insertAiConfigSchema, insertTrainingDocumentSchema, insertMessageSchema, credentialSchemas } from "@shared/schema";
import { channelManager } from "./services/channelManager";
import { messageQueue } from "./services/messageQueue";

// Handler classes
class LinkedInHandler {
  constructor(channel: any) {}
  async validateCredentials(credentials: any): Promise<boolean> {
    try {
      const { accessToken, organizationId } = credentials;
      if (!accessToken || !organizationId) {
        throw new Error('Missing required LinkedIn credentials');
      }
      // In production, make an API call to verify credentials
      return true;
    } catch (error) {
      console.error('LinkedIn validation error:', error);
      return false;
    }
  }
}

class RedditHandler {
  constructor(channel: any) {}
  async validateCredentials(credentials: any): Promise<boolean> {
    try {
      const { clientId, clientSecret, username, password } = credentials;
      if (!clientId || !clientSecret || !username || !password) {
        throw new Error('Missing required Reddit credentials');
      }
      return true;
    } catch (error) {
      console.error('Reddit validation error:', error);
      return false;
    }
  }
}

class DiscordHandler {
  constructor(channel: any) {}
  async validateCredentials(credentials: any): Promise<boolean> {
    try {
      const { botToken, clientId, clientSecret } = credentials;
      if (!botToken || !clientId || !clientSecret) {
        throw new Error('Missing required Discord credentials');
      }
      return true;
    } catch (error) {
      console.error('Discord validation error:', error);
      return false;
    }
  }
}

class LetGoHandler {
  constructor(channel: any) {}
  async validateCredentials(credentials: any): Promise<boolean> {
    try {
      const { apiKey, secret, marketplaceId } = credentials;
      if (!apiKey || !secret || !marketplaceId) {
        throw new Error('Missing required LetGo credentials');
      }
      return true;
    } catch (error) {
      console.error('LetGo validation error:', error);
      return false;
    }
  }
}

class WhatsAppHandler {
  constructor(channel: any) {}
  async validateCredentials(credentials: any): Promise<boolean> { 
    try {
      const { apiKey, phoneNumberId, businessAccountId } = credentials;
      // Basic validation
      if (!apiKey || !phoneNumberId || !businessAccountId) {
        throw new Error('Missing required WhatsApp credentials');
      }
      // In production, make an actual API call to verify credentials
      return true;
    } catch (error) {
      console.error('WhatsApp validation error:', error);
      return false;
    }
  }
}

class TikTokHandler {
  constructor(channel: any) {} // Replace 'any' with the actual channel type
  async validateCredentials(credentials: any): Promise<boolean> { 
    //Implementation to validate TikTok credentials
    return true; // Replace with actual validation logic
  }
}

class TwilioHandler {
  constructor(channel: any) {}
  async validateCredentials(credentials: any): Promise<boolean> { 
    try {
      const { accountSid, authToken, phoneNumber } = credentials;
      // Basic validation
      if (!accountSid || !authToken || !phoneNumber) {
        throw new Error('Missing required Twilio credentials');
      }
      // In production, make an actual API call to verify credentials
      return true;
    } catch (error) {
      console.error('Twilio validation error:', error);
      return false;
    }
  }
}

class TelegramHandler {
  constructor(channel: any) {} // Replace 'any' with the actual channel type
  async validateCredentials(credentials: any): Promise<boolean> {
    try {
      const { botToken, webhookUrl } = credentials;
      // Basic validation
      if (!botToken || !webhookUrl) {
        throw new Error('Missing required Telegram credentials');
      }
      // In production, make an actual API call to verify credentials
      return true;
    } catch (error) {
      console.error('Telegram validation error:', error);
      return false;
    }
  }
}


export async function registerRoutes(app: Express): Promise<Server> {
  // Current user endpoint with initialization
  app.get("/api/users/current", async (_req, res) => {
    try {
      let user = await storage.getUserByUsername("alley");
      if (!user) {
        user = await storage.createUser({
          username: "alley",
          password: "default_password" // In production, use proper password handling
        });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Failed to fetch current user" });
    }
  });

  // AI Configuration Routes
  app.post("/api/ai-config", async (req, res) => {
    try {
      const config = insertAiConfigSchema.parse(req.body);
      const newConfig = await storage.createAiConfig(config);
      res.json(newConfig);
    } catch (error) {
      console.error("Error creating AI config:", error);
      res.status(400).json({ message: "Invalid AI configuration data" });
    }
  });

  app.get("/api/ai-config", async (_req, res) => {
    try {
      const configs = await storage.listAiConfigs();
      res.json(configs);
    } catch (error) {
      console.error("Error fetching AI configs:", error);
      res.status(500).json({ message: "Failed to fetch AI configurations" });
    }
  });

  // Training Document Routes
  app.post("/api/training-documents", async (req, res) => {
    try {
      const doc = insertTrainingDocumentSchema.parse(req.body);
      const newDoc = await storage.createTrainingDocument(doc);
      res.json(newDoc);
    } catch (error) {
      console.error("Error creating training document:", error);
      res.status(400).json({ message: "Invalid training document data" });
    }
  });

  app.get("/api/training-documents", async (_req, res) => {
    try {
      const docs = await storage.listTrainingDocuments();
      res.json(docs);
    } catch (error) {
      console.error("Error fetching training documents:", error);
      res.status(500).json({ message: "Failed to fetch training documents" });
    }
  });

  app.patch("/api/training-documents/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedDoc = await storage.updateTrainingDocumentStatus(parseInt(id), status);
      res.json(updatedDoc);
    } catch (error) {
      console.error("Error updating training document status:", error);
      res.status(500).json({ message: "Failed to update document status" });
    }
  });

  // Channel Routes
  app.post("/api/channels", async (req, res) => {
    try {
      const channel = insertChannelSchema.parse(req.body);
      const newChannel = await storage.createChannel(channel);

      if (channel.isActive) {
        await channelManager.activateChannel(newChannel.id);
      }

      res.json(newChannel);
    } catch (error) {
      console.error("Error creating channel:", error);
      res.status(400).json({ message: "Invalid channel data" });
    }
  });

  app.get("/api/channels", async (_req, res) => {
    try {
      const channels = await storage.listChannels();
      res.json(channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ message: "Failed to fetch channels" });
    }
  });

  app.patch("/api/channels/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const channelId = parseInt(id);

      if (isActive) {
        await channelManager.activateChannel(channelId);
      } else {
        await channelManager.deactivateChannel(channelId);
      }

      const updatedChannel = await storage.updateChannelStatus(channelId, isActive);
      res.json(updatedChannel);
    } catch (error) {
      console.error("Error updating channel status:", error);
      res.status(500).json({ message: "Failed to update channel status" });
    }
  });

  // Add new endpoint to fetch active channels
  app.get("/api/channels/active", async (_req, res) => {
    try {
      const channels = await storage.listChannels();
      const activeChannels = channels.filter(channel => channel.isActive);
      res.json(activeChannels);
    } catch (error) {
      console.error("Error fetching active channels:", error);
      res.status(500).json({ message: "Failed to fetch active channels" });
    }
  });

  // Add the test connection endpoint
  app.post("/api/channels/:type/test", async (req, res) => {
    try {
      const { type } = req.params;
      const credentials = req.body;

      // Validate credentials against schema
      const schema = credentialSchemas[type.toLowerCase()];
      if (!schema) {
        throw new Error(`Unsupported channel type: ${type}`);
      }

      try {
        schema.parse(credentials);
      } catch (error) {
        throw new Error('Invalid credentials format');
      }

      let handler;
      switch (type.toLowerCase()) {
        case 'linkedin':
          handler = new LinkedInHandler({ type, credentials });
          break;
        case 'reddit':
          handler = new RedditHandler({ type, credentials });
          break;
        case 'discord':
          handler = new DiscordHandler({ type, credentials });
          break;
        case 'letgo':
          handler = new LetGoHandler({ type, credentials });
          break;
        // Existing handlers
        case 'whatsapp':
          handler = new WhatsAppHandler({ type, credentials });
          break;
        case 'telegram':
          handler = new TelegramHandler({ type, credentials });
          break;
        case 'sms':
          handler = new TwilioHandler({ type, credentials });
          break;
        default:
          throw new Error(`Unsupported channel type: ${type}`);
      }

      const isValid = await handler.validateCredentials(credentials);

      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      res.json({ success: true, message: 'Connection test successful' });
    } catch (error) {
      console.error('Error testing connection:', error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection test failed' 
      });
    }
  });

  // Message Routes
  app.post("/api/messages", async (req, res) => {
    try {
      const message = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(message);

      // Route message through channel manager
      await channelManager.routeMessage(newMessage);

      res.json(newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.get("/api/messages/active", async (_req, res) => {
    try {
      const messages = await storage.listActiveMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching active messages:", error);
      res.status(500).json({ message: "Failed to fetch active messages" });
    }
  });

  app.get("/api/messages/channel/:channelId", async (req, res) => {
    try {
      const { channelId } = req.params;
      const messages = await storage.listMessagesByChannel(parseInt(channelId));
      res.json(messages);
    } catch (error) {
      console.error("Error fetching channel messages:", error);
      res.status(500).json({ message: "Failed to fetch channel messages" });
    }
  });

  // Message Queue Status Route
  app.get("/api/messages/queue/status", async (_req, res) => {
    try {
      const activeMessages = await storage.listActiveMessages();
      res.json({
        queueSize: activeMessages.length,
        status: "processing",
        lastProcessed: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching queue status:", error);
      res.status(500).json({ message: "Failed to fetch queue status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}