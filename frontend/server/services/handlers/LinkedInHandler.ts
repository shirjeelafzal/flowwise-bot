import { Message, Channel } from "@shared/schema";
import { BaseHandler } from "./BaseHandler";

export class LinkedInHandler extends BaseHandler {
  private readonly requiredFields = ['accessToken', 'organizationId'];

  async validateCredentials(credentials: any): Promise<boolean> {
    try {
      return this.validateBaseCredentials(this.requiredFields);
    } catch (error) {
      console.error('LinkedIn validation error:', error);
      return false;
    }
  }

  async formatOutgoingMessage(message: Message): Promise<any> {
    return {
      text: message.content,
      recipient: message.customerPhone, // LinkedIn user ID
    };
  }

  async parseIncomingMessage(rawMessage: any): Promise<Message> {
    if (!rawMessage.sender || !rawMessage.text) {
      throw new Error("Invalid LinkedIn message format");
    }

    return {
      id: 0, // This will be set by the database
      channelId: this.channel.id,
      content: rawMessage.text,
      messageType: "incoming",
      status: "new",
      customerPhone: rawMessage.sender.id,
      customerName: rawMessage.sender.name || null,
      customerEmail: rawMessage.sender.email || null,
      metadata: JSON.stringify({
        linkedinMessageId: rawMessage.id,
        timestamp: new Date().toISOString()
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async sendMessage(message: Message): Promise<void> {
    const credentials = JSON.parse(this.channel.credentials);
    const formattedMessage = await this.formatOutgoingMessage(message);
    
    const response = await fetch(
      `https://api.linkedin.com/v2/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(formattedMessage)
      }
    );

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }
  }
}
