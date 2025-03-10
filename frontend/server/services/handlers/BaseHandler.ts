import { Message, Channel } from "@shared/schema";

export interface MessageHandler {
  validateCredentials(credentials: any): Promise<boolean>;
  formatOutgoingMessage(message: Message): Promise<any>;
  parseIncomingMessage(rawMessage: any): Promise<Message>;
  sendMessage(message: Message): Promise<void>;
}

export abstract class BaseHandler implements MessageHandler {
  protected channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;
  }

  abstract validateCredentials(credentials: any): Promise<boolean>;
  abstract formatOutgoingMessage(message: Message): Promise<any>;
  abstract parseIncomingMessage(rawMessage: any): Promise<Message>;
  abstract sendMessage(message: Message): Promise<void>;

  protected async validateBaseCredentials(requiredFields: string[]): Promise<boolean> {
    const credentials = JSON.parse(this.channel.credentials);
    return requiredFields.every(field => credentials[field] !== undefined);
  }
}
