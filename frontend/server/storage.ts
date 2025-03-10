import { users, channels, aiConfigs, trainingDocuments, messages, 
  type User, type InsertUser, type Channel, type InsertChannel,
  type AiConfig, type InsertAiConfig, type TrainingDocument, 
  type InsertTrainingDocument, type Message, type InsertMessage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { mcpConfigs, type McpConfig, type InsertMcpConfig } from "@shared/schema";
import { makeConfigs, type MakeConfig, type InsertMakeConfig } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserAvatar(userId: number, avatarUrl: string): Promise<User>;

  // Channel operations
  createChannel(channel: InsertChannel): Promise<Channel>;
  getChannel(id: number): Promise<Channel | undefined>;
  listChannels(): Promise<Channel[]>;
  updateChannelStatus(id: number, isActive: boolean): Promise<Channel>;

  // AI Config operations
  createAiConfig(config: InsertAiConfig): Promise<AiConfig>;
  getAiConfig(id: number): Promise<AiConfig | undefined>;
  listAiConfigs(): Promise<AiConfig[]>;
  updateAiConfig(id: number, config: Partial<InsertAiConfig>): Promise<AiConfig>;

  // Training Document operations
  createTrainingDocument(doc: InsertTrainingDocument): Promise<TrainingDocument>;
  getTrainingDocument(id: number): Promise<TrainingDocument | undefined>;
  listTrainingDocuments(): Promise<TrainingDocument[]>;
  updateTrainingDocumentStatus(id: number, status: string): Promise<TrainingDocument>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessage(id: number): Promise<Message | undefined>;
  listMessagesByChannel(channelId: number): Promise<Message[]>;
  listActiveMessages(): Promise<Message[]>;

  // MCP Config operations
  createMcpConfig(config: InsertMcpConfig): Promise<McpConfig>;
  getMcpConfig(id: number): Promise<McpConfig | undefined>;
  updateMcpConfig(id: number, config: Partial<InsertMcpConfig>): Promise<McpConfig>;

  // MAKE Config operations
  createMakeConfig(config: InsertMakeConfig): Promise<MakeConfig>;
  getMakeConfig(id: number): Promise<MakeConfig | undefined>;
  updateMakeConfig(id: number, config: Partial<InsertMakeConfig>): Promise<MakeConfig>;
}

export class DatabaseStorage implements IStorage {
  // Existing user methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserAvatar(userId: number, avatarUrl: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ avatarUrl })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Channel methods
  async createChannel(channel: InsertChannel): Promise<Channel> {
    const [newChannel] = await db
      .insert(channels)
      .values({
        name: channel.name,
        type: channel.type,
        credentials: channel.credentials,
        config: channel.config || {},
      })
      .returning();
    return newChannel;
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    const [channel] = await db
      .select()
      .from(channels)
      .where(eq(channels.id, id));
    return channel || undefined;
  }

  async listChannels(): Promise<Channel[]> {
    return await db.select().from(channels);
  }

  async updateChannelStatus(id: number, isActive: boolean): Promise<Channel> {
    const [channel] = await db
      .update(channels)
      .set({ isActive })
      .where(eq(channels.id, id))
      .returning();
    return channel;
  }

  // AI Config methods
  async createAiConfig(config: InsertAiConfig): Promise<AiConfig> {
    const [newConfig] = await db
      .insert(aiConfigs)
      .values(config)
      .returning();
    return newConfig;
  }

  async getAiConfig(id: number): Promise<AiConfig | undefined> {
    const [config] = await db
      .select()
      .from(aiConfigs)
      .where(eq(aiConfigs.id, id));
    return config || undefined;
  }

  async listAiConfigs(): Promise<AiConfig[]> {
    return await db.select().from(aiConfigs);
  }

  async updateAiConfig(id: number, config: Partial<InsertAiConfig>): Promise<AiConfig> {
    const [updatedConfig] = await db
      .update(aiConfigs)
      .set(config)
      .where(eq(aiConfigs.id, id))
      .returning();
    return updatedConfig;
  }

  // Training Document methods
  async createTrainingDocument(doc: InsertTrainingDocument): Promise<TrainingDocument> {
    const [newDoc] = await db
      .insert(trainingDocuments)
      .values(doc)
      .returning();
    return newDoc;
  }

  async getTrainingDocument(id: number): Promise<TrainingDocument | undefined> {
    const [doc] = await db
      .select()
      .from(trainingDocuments)
      .where(eq(trainingDocuments.id, id));
    return doc || undefined;
  }

  async listTrainingDocuments(): Promise<TrainingDocument[]> {
    return await db.select().from(trainingDocuments);
  }

  async updateTrainingDocumentStatus(id: number, status: string): Promise<TrainingDocument> {
    const [doc] = await db
      .update(trainingDocuments)
      .set({ status })
      .where(eq(trainingDocuments.id, id))
      .returning();
    return doc;
  }

  // Message methods
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message || undefined;
  }

  async listMessagesByChannel(channelId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.channelId, channelId));
  }

  async listActiveMessages(): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.status, 'new'))
      .orderBy(messages.createdAt);
  }

  // MCP Config methods
  async createMcpConfig(config: InsertMcpConfig): Promise<McpConfig> {
    const [newConfig] = await db
      .insert(mcpConfigs)
      .values(config)
      .returning();
    return newConfig;
  }

  async getMcpConfig(id: number): Promise<McpConfig | undefined> {
    const [config] = await db
      .select()
      .from(mcpConfigs)
      .where(eq(mcpConfigs.id, id));
    return config || undefined;
  }

  async updateMcpConfig(id: number, config: Partial<InsertMcpConfig>): Promise<McpConfig> {
    const [updatedConfig] = await db
      .update(mcpConfigs)
      .set(config)
      .where(eq(mcpConfigs.id, id))
      .returning();
    return updatedConfig;
  }

  // MAKE Config methods
  async createMakeConfig(config: InsertMakeConfig): Promise<MakeConfig> {
    const [newConfig] = await db
      .insert(makeConfigs)
      .values(config)
      .returning();
    return newConfig;
  }

  async getMakeConfig(id: number): Promise<MakeConfig | undefined> {
    const [config] = await db
      .select()
      .from(makeConfigs)
      .where(eq(makeConfigs.id, id));
    return config || undefined;
  }

  async updateMakeConfig(id: number, config: Partial<InsertMakeConfig>): Promise<MakeConfig> {
    const [updatedConfig] = await db
      .update(makeConfigs)
      .set(config)
      .where(eq(makeConfigs.id, id))
      .returning();
    return updatedConfig;
  }
}

export const storage = new DatabaseStorage();