import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import Header from "../components/layout/Header";
import { Bot, Send, User, MessageSquare, MessageCircle, Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Channel } from "@shared/schema";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ChannelType = "whatsapp" | "telegram" | "sms";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch active channels
  const { data: activeChannels = [], isLoading: isLoadingChannels } = useQuery<Channel[]>({ 
    queryKey: ['/api/channels/active'],
  });

  // Determine which channels are active
  const channelStates = {
    whatsapp: activeChannels.some(c => c.type === 'whatsapp' && c.isActive),
    telegram: activeChannels.some(c => c.type === 'telegram' && c.isActive),
    sms: activeChannels.some(c => c.type === 'sms' && c.isActive),
  };

  const handleChannelToggle = async (channelType: ChannelType) => {
    const channel = activeChannels.find(c => c.type === channelType);

    if (!channel) {
      toast({
        title: "Channel not configured",
        description: `Please configure ${channelType.toUpperCase()} settings in the Connection Settings page first`,
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/settings'}
          >
            Configure Now
          </Button>
        ),
      });
      return;
    }

    try {
      const credentials = JSON.parse(channel.credentials);
      const response = await fetch(`/api/channels/${channelType}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        // Update channel status
        await fetch(`/api/channels/${channel.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !channelStates[channelType] }),
        });

        toast({
          title: "Connection Successful",
          description: `${channelType.toUpperCase()} connection verified and ${channelStates[channelType] ? 'disabled' : 'enabled'}`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error testing ${channelType} connection:`, error);
      toast({
        title: "Connection Error",
        description: `Failed to test ${channelType.toUpperCase()} connection. Please check your settings.`,
        variant: "destructive",
      });
    }
  };
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/chat`, {
        question: userMessage,
        user: "123456789" // Replace with dynamic user ID if available
      });
  
      const assistantResponse = data.response?.[0]?.output || "I'm not sure how to respond to that.";
  
      setMessages(prev => [...prev, { role: "assistant", content: assistantResponse }]);
    } catch (error: any) {
      console.error("Error sending message:", error);
  
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to get AI response.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full p-6 flex flex-col space-y-6">
      <Header title="Talk to ALI AI" />

      {/* Channel Selection Card */}
      <Card className="relative overflow-hidden bg-[#111318] border-brand-silver/20 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-purple/5 opacity-30" />
        <div className="relative">
          <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
            Communication Channels
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-brand-accent" />
                <Label>WhatsApp</Label>
              </div>
              <Switch
                checked={channelStates.whatsapp}
                onCheckedChange={() => handleChannelToggle('whatsapp')}
                disabled={isLoadingChannels}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-accent" />
                <Label>Telegram</Label>
              </div>
              <Switch
                checked={channelStates.telegram}
                onCheckedChange={() => handleChannelToggle('telegram')}
                disabled={isLoadingChannels}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-brand-accent" />
                <Label>SMS (Twilio)</Label>
              </div>
              <Switch
                checked={channelStates.sms}
                onCheckedChange={() => handleChannelToggle('sms')}
                disabled={isLoadingChannels}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Chat Card */}
      <Card className="flex-1 relative overflow-hidden bg-[#111318] border-brand-silver/20">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-purple/5 opacity-30" />
        <div className="relative h-full flex flex-col">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-glow opacity-20 rounded-lg blur-sm"></div>
                      <div className="relative p-2 rounded-lg bg-background">
                        <Bot className="w-5 h-5 text-brand-accent" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`relative px-4 py-2 rounded-lg max-w-[80%] ${
                      message.role === "assistant"
                        ? "bg-brand-accent/10 text-brand-silver"
                        : "bg-brand-purple/10 text-brand-silver ml-auto"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-glow opacity-20 rounded-lg blur-sm"></div>
                      <div className="relative p-2 rounded-lg bg-background">
                        <User className="w-5 h-5 text-brand-purple" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-brand-silver/70">
                  <Bot className="w-5 h-5 animate-pulse" />
                  <span>Ali is typing...</span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-brand-silver/20">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="bg-background border-brand-silver/20"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-brand-accent hover:bg-brand-accent/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}