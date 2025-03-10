import { Message, Channel } from "@shared/schema";
import { BaseHandler } from "./BaseHandler";

export class TwilioHandler extends BaseHandler {
  private readonly requiredFields = ['accountSid', 'authToken', 'phoneNumber'];

  async validateCredentials(credentials: any): Promise<boolean> {
    return this.validateBaseCredentials(this.requiredFields);
  }

  async formatOutgoingMessage(message: Message): Promise<any> {
    return {
      To: message.customerPhone,
      From: JSON.parse(this.channel.credentials).phoneNumber,
      Body: message.content
    };
  }

  async parseIncomingMessage(rawMessage: any): Promise<Message> {
    if (!rawMessage.From || !rawMessage.Body) {
      throw new Error("Invalid Twilio message format");
    }

    return {
      channelId: this.channel.id,
      content: rawMessage.Body,
      messageType: "incoming",
      status: "new",
      customerPhone: rawMessage.From,
      metadata: JSON.stringify({
        twilioMessageSid: rawMessage.MessageSid,
        twilioAccountSid: rawMessage.AccountSid
      })
    };
  }

  async sendMessage(message: Message): Promise<void> {
    const credentials = JSON.parse(this.channel.credentials);
    const formattedMessage = await this.formatOutgoingMessage(message);
    
    const auth = Buffer.from(`${credentials.accountSid}:${credentials.authToken}`).toString('base64');
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${credentials.accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formattedMessage)
      }
    );

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.statusText}`);
    }
  }
}
