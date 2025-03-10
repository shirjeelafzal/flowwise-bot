import { Message, Channel } from "@shared/schema";
import { BaseHandler } from "./BaseHandler";

export class TikTokHandler extends BaseHandler {
  private readonly requiredFields = ['accessToken', 'clientKey', 'clientSecret'];

  async validateCredentials(credentials: any): Promise<boolean> {
    return this.validateBaseCredentials(this.requiredFields);
  }

  async formatOutgoingMessage(message: Message): Promise<any> {
    return {
      message_type: "text",
      recipient_id: message.customerPhone, // TikTok user ID
      text: message.content
    };
  }

  async parseIncomingMessage(rawMessage: any): Promise<Message> {
    if (!rawMessage.sender || !rawMessage.text) {
      throw new Error("Invalid TikTok message format");
    }

    return {
      channelId: this.channel.id,
      content: rawMessage.text,
      messageType: "incoming",
      status: "new",
      customerName: rawMessage.sender.username,
      customerPhone: rawMessage.sender.id,
      metadata: JSON.stringify({
        tiktokMessageId: rawMessage.message_id,
        senderId: rawMessage.sender.id
      })
    };
  }

  async sendMessage(message: Message): Promise<void> {
    const credentials = JSON.parse(this.channel.credentials);
    const formattedMessage = await this.formatOutgoingMessage(message);
    
    const response = await fetch(
      'https://open.tiktokapis.com/v2/business/messages/send',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
          'X-Client-Key': credentials.clientKey
        },
        body: JSON.stringify(formattedMessage)
      }
    );

    if (!response.ok) {
      throw new Error(`TikTok API error: ${response.statusText}`);
    }
  }
}
