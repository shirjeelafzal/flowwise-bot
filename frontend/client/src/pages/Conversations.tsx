import { useState } from "react";
import Header from "../components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Smartphone } from "lucide-react";
import {
  SiWhatsapp,
  SiTelegram,
  SiMessenger,
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiLinkedin,
  SiLine,
  SiWechat,
  SiViber
} from "react-icons/si";

// Types for messages and conversations
interface Message {
  id: number;
  content: string;
  timestamp: string;
  type: 'incoming' | 'outgoing';
  channel: 'whatsapp' | 'telegram' | 'messenger' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'line' | 'wechat' | 'viber' | 'sms';
  status: 'new' | 'processing' | 'booking' | 'completed';
}

interface Conversation {
  id: number;
  customer: {
    name: string;
    phone: string;
  };
  channel: 'whatsapp' | 'telegram' | 'messenger' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'line' | 'wechat' | 'viber' | 'sms';
  lastMessage: string;
  timestamp: string;
  status: 'active' | 'booking' | 'completed';
}

const channelIcons = {
  whatsapp: SiWhatsapp,
  telegram: SiTelegram,
  messenger: SiMessenger,
  facebook: SiFacebook,
  instagram: SiInstagram,
  tiktok: SiTiktok,
  linkedin: SiLinkedin,
  line: SiLine,
  wechat: SiWechat,
  viber: SiViber,
  sms: Smartphone,
};

export default function Conversations() {
  // Mock queries - will be replaced with actual API endpoints
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
    queryFn: () => [
      {
        id: 1,
        customer: {
          name: "Amy",
          phone: "777-888-9999"
        },
        channel: "whatsapp",
        lastMessage: "Perfect, I'll book that appointment",
        timestamp: "2 min ago",
        status: 'booking'
      },
      {
        id: 2,
        customer: {
          name: "James",
          phone: "555-777-8888"
        },
        channel: "telegram",
        lastMessage: "What time slots are available?",
        timestamp: "Just now",
        status: 'active'
      },
      {
        id: 3,
        customer: {
          name: "Sarah",
          phone: "444-555-6666"
        },
        channel: "instagram",
        lastMessage: "I saw your post about appointments",
        timestamp: "5 min ago",
        status: 'active'
      }
    ]
  });

  return (
    <div className="h-screen p-6 flex flex-col">
      <Header title="Live Conversations" />

      {/* Message Stream */}
      <ScrollArea className="flex-1 mt-6">
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const ChannelIcon = channelIcons[conversation.channel];
            return (
              <Card
                key={conversation.id}
                className={`p-6 animate-in fade-in-50 ${
                  conversation.status === 'booking' ? 'bg-green-50/50' : ''
                }`}
              >
                <div className="flex items-center justify-between"> {/* Added justify-between for better layout */}
                  <div className="flex items-center gap-3">
                    <ChannelIcon className="w-6 h-6 text-primary flex-shrink-0" /> {/* Increased icon size */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {conversation.customer.name}
                        </span>
                        <Badge variant="outline" className="flex-shrink-0">
                          {conversation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {conversation.timestamp}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Status Bar */}
      <div className="mt-4 p-4 bg-muted rounded-lg text-sm text-muted-foreground"> {/* Increased padding */}
        <p>Alley is monitoring conversations across all channels</p>
      </div>
    </div>
  );
}