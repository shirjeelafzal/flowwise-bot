import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url"),
});

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

export const aiConfigs = sqliteTable("ai_configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  modelType: text("model_type").notNull(),
  temperature: integer("temperature").notNull(),
  apiKey: text("api_key").notNull(),
  maxTokens: integer("max_tokens").default(2000),
  customInstructions: text("custom_instructions"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const trainingDocuments = sqliteTable("training_documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  trainingMode: text("training_mode").notNull(),
  status: text("status").notNull().default('pending'),
  content: text("content").notNull(),
  metadata: text("metadata"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  channelId: integer("channel_id").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull(),
  status: text("status").notNull(),
  metadata: text("metadata"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const mcpConfigs = sqliteTable("mcp_configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
  endpoint: text("endpoint"),
  apiKey: text("api_key"),
  protocol: text("protocol").notNull().default('standard'),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const makeConfigs = sqliteTable("make_configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
  apiKey: text("api_key"),
  organizationId: text("organization_id"),
  defaultScenarioId: text("default_scenario_id"),
  webhookUrls: text("webhook_urls"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

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
  instagram: z.object({
    accessToken: z.string().min(1, "Access Token is required"),
    userId: z.string().min(1, "User ID is required"),
  }),
  twitter: z.object({
    apiKey: z.string().min(1, "API Key is required"),
    apiSecret: z.string().min(1, "API Secret is required"),
    accessToken: z.string().min(1, "Access Token is required"),
    accessSecret: z.string().min(1, "Access Secret is required"),
  }),
  youtube: z.object({
    apiKey: z.string().min(1, "API Key is required"),
    channelId: z.string().min(1, "Channel ID is required"),
  }),
  tiktok: z.object({
    accessToken: z.string().min(1, "Access Token is required"),
    clientKey: z.string().min(1, "Client Key is required"),
    clientSecret: z.string().min(1, "Client Secret is required"),
  }),
  linkedin: z.object({
    accessToken: z.string().min(1, "Access Token is required"),
    organizationId: z.string().min(1, "Organization ID is required"),
  }),
  reddit: z.object({
    clientId: z.string().min(1, "Client ID is required"),
    clientSecret: z.string().min(1, "Client Secret is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  }),
  discord: z.object({
    botToken: z.string().min(1, "Bot Token is required"),
    clientId: z.string().min(1, "Client ID is required"),
    clientSecret: z.string().min(1, "Client Secret is required"),
  }),
  letgo: z.object({
    apiKey: z.string().min(1, "API Key is required"),
    secret: z.string().min(1, "Secret is required"),
    marketplaceId: z.string().min(1, "Marketplace ID is required"),
  }),
  sms: z.object({
    accountSid: z.string().min(1, "Account SID is required"),
    authToken: z.string().min(1, "Auth Token is required"),
    phoneNumber: z.string().min(1, "Phone Number is required"),
  }),
};

export const insertChannelSchema = createInsertSchema(channels)
  .extend({
    credentials: z.discriminatedUnion("type", [
      z.object({ type: z.literal("whatsapp"), ...credentialSchemas.whatsapp.shape }),
      z.object({ type: z.literal("telegram"), ...credentialSchemas.telegram.shape }),
      z.object({ type: z.literal("instagram"), ...credentialSchemas.instagram.shape }),
      z.object({ type: z.literal("twitter"), ...credentialSchemas.twitter.shape }),
      z.object({ type: z.literal("youtube"), ...credentialSchemas.youtube.shape }),
      z.object({ type: z.literal("tiktok"), ...credentialSchemas.tiktok.shape }),
      z.object({ type: z.literal("linkedin"), ...credentialSchemas.linkedin.shape }),
      z.object({ type: z.literal("reddit"), ...credentialSchemas.reddit.shape }),
      z.object({ type: z.literal("discord"), ...credentialSchemas.discord.shape }),
      z.object({ type: z.literal("letgo"), ...credentialSchemas.letgo.shape }),
      z.object({ type: z.literal("sms"), ...credentialSchemas.sms.shape }),
    ]),
    config: z.record(z.unknown()).optional(),
  })
  .omit({ id: true, isActive: true, createdAt: true, updatedAt: true });

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAiConfigSchema = createInsertSchema(aiConfigs)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertTrainingDocumentSchema = createInsertSchema(trainingDocuments)
  .omit({ id: true, status: true, createdAt: true, updatedAt: true });

export const insertMessageSchema = createInsertSchema(messages)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertMcpConfigSchema = createInsertSchema(mcpConfigs)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertMakeConfigSchema = createInsertSchema(makeConfigs)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Channel = typeof channels.$inferSelect;
export type InsertAiConfig = z.infer<typeof insertAiConfigSchema>;
export type AiConfig = typeof aiConfigs.$inferSelect;
export type InsertTrainingDocument = z.infer<typeof insertTrainingDocumentSchema>;
export type TrainingDocument = typeof trainingDocuments.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMcpConfig = z.infer<typeof insertMcpConfigSchema>;
export type McpConfig = typeof mcpConfigs.$inferSelect;
export type InsertMakeConfig = z.infer<typeof insertMakeConfigSchema>;
export type MakeConfig = typeof makeConfigs.$inferSelect;

export { credentialSchemas };