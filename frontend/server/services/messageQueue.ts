import { Message, Channel } from "@shared/schema";
import { EventEmitter } from "events";

class MessageQueue extends EventEmitter {
  private static instance: MessageQueue;
  private messageBuffer: Message[] = [];
  private processingInterval: NodeJS.Timeout | null = null;
  private isProcessing = false;

  private constructor() {
    super();
    this.startProcessing();
  }

  public static getInstance(): MessageQueue {
    if (!MessageQueue.instance) {
      MessageQueue.instance = new MessageQueue();
    }
    return MessageQueue.instance;
  }

  public async enqueueMessage(message: Message): Promise<void> {
    this.messageBuffer.push(message);
    this.emit('messageEnqueued', message);
  }

  private async processMessage(message: Message): Promise<void> {
    try {
      // Emit event for channel-specific processing
      this.emit(`process:${message.messageType}`, message);
      
      // Update message status
      this.emit('messageProcessed', {
        messageId: message.id,
        status: 'processed',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error processing message:', error);
      this.emit('messageError', {
        messageId: message.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  private startProcessing(): void {
    if (this.processingInterval) return;

    this.processingInterval = setInterval(async () => {
      if (this.isProcessing || this.messageBuffer.length === 0) return;

      this.isProcessing = true;
      const message = this.messageBuffer.shift();
      
      if (message) {
        await this.processMessage(message);
      }
      
      this.isProcessing = false;
    }, 100); // Process messages every 100ms
  }

  public stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
}

export const messageQueue = MessageQueue.getInstance();
