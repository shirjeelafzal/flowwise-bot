import { Message, Channel } from "@shared/schema";
import { BaseHandler } from "./BaseHandler";

export class WhatsAppHandler extends BaseHandler {
  private readonly requiredFields = ['apiKey', 'phoneNumberId', 'businessAccountId'];

  async validateCredentials(credentials: any): Promise<boolean> {
    try {
      return this.validateBaseCredentials(this.requiredFields);
    } catch (error) {
      console.error('WhatsApp validation error:', error);
      return false;
    }
  }

  async formatOutgoingMessage(message: Message): Promise<any> {
    return {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: message.customerPhone,
      type: "text",
      text: { 
        body: message.content
      }
    };
  }

  async parseIncomingMessage(rawMessage: any): Promise<Message> {
    const entry = rawMessage.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages?.[0];

    if (!messages) {
      throw new Error("Invalid WhatsApp message format");
    }

    return {
      id: 0, // This will be set by the database
      channelId: this.channel.id,
      content: messages.text?.body || "",
      messageType: "incoming",
      status: "new",
      customerPhone: messages.from,
      customerName: value?.contacts?.[0]?.profile?.name || null,
      customerEmail: null,
      metadata: JSON.stringify({
        whatsappMessageId: messages.id,
        timestamp: messages.timestamp
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async sendMessage(message: Message): Promise<void> {
    const credentials = JSON.parse(this.channel.credentials);
    const formattedMessage = await this.formatOutgoingMessage(message);

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${credentials.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedMessage),
      }
    );

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }
  }
}