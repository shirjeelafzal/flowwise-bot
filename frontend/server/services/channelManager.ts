import { Channel, Message } from "@shared/schema";
import { storage } from "../storage";
import { messageQueue } from "./messageQueue";
import { WhatsAppHandler } from "./handlers/WhatsAppHandler";
import { TikTokHandler } from "./handlers/TikTokHandler";
import { TwilioHandler } from "./handlers/TwilioHandler";
import { LinkedInHandler } from "./handlers/LinkedInHandler";
import { BaseHandler } from "./handlers/BaseHandler";

export class ChannelManager {
  private static instance: ChannelManager;
  private activeChannels: Map<number, Channel> = new Map();
  private handlers: Map<number, BaseHandler> = new Map();

  private constructor() {
    this.initializeChannels();
  }

  public static getInstance(): ChannelManager {
    if (!ChannelManager.instance) {
      ChannelManager.instance = new ChannelManager();
    }
    return ChannelManager.instance;
  }

  private async initializeChannels(): Promise<void> {
    try {
      const channels = await storage.listChannels();
      channels.forEach(channel => {
        if (channel.isActive) {
          this.activeChannels.set(channel.id, channel);
          this.initializeHandler(channel);
        }
      });
    } catch (error) {
      console.error('Error initializing channels:', error);
    }
  }

  private initializeHandler(channel: Channel): BaseHandler {
    let handler: BaseHandler;

    switch (channel.type) {
      case 'whatsapp':
        handler = new WhatsAppHandler(channel);
        break;
      case 'tiktok':
        handler = new TikTokHandler(channel);
        break;
      case 'sms':
        handler = new TwilioHandler(channel);
        break;
      case 'linkedin':
        handler = new LinkedInHandler(channel);
        break;
      // TODO: Add other social media handlers
      default:
        throw new Error(`Unsupported channel type: ${channel.type}`);
    }

    this.handlers.set(channel.id, handler);
    return handler;
  }

  public async activateChannel(channelId: number): Promise<void> {
    try {
      const channel = await storage.getChannel(channelId);
      if (!channel) throw new Error('Channel not found');

      const handler = this.initializeHandler(channel);
      const credentials = JSON.parse(channel.credentials);

      if (!(await handler.validateCredentials(credentials))) {
        throw new Error('Invalid channel credentials');
      }

      await storage.updateChannelStatus(channelId, true);
      this.activeChannels.set(channelId, channel);
    } catch (error) {
      console.error('Error activating channel:', error);
      throw error;
    }
  }

  public async deactivateChannel(channelId: number): Promise<void> {
    try {
      await storage.updateChannelStatus(channelId, false);
      this.activeChannels.delete(channelId);
      this.handlers.delete(channelId);
    } catch (error) {
      console.error('Error deactivating channel:', error);
      throw error;
    }
  }

  public async routeMessage(message: Message): Promise<void> {
    const handler = this.handlers.get(message.channelId);
    if (!handler) {
      throw new Error(`Channel ${message.channelId} not found or inactive`);
    }

    try {
      await handler.sendMessage(message);
      await messageQueue.enqueueMessage(message);
    } catch (error) {
      console.error(`Error routing message for channel ${message.channelId}:`, error);
      throw error;
    }
  }

  public isChannelActive(channelId: number): boolean {
    return this.activeChannels.has(channelId);
  }

  public getActiveChannels(): Channel[] {
    return Array.from(this.activeChannels.values());
  }
}

export const channelManager = ChannelManager.getInstance();