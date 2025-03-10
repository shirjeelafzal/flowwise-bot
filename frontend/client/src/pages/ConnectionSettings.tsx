import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "../components/layout/Header";
import { 
  SiWhatsapp, 
  SiTelegram, 
  SiMessenger, 
  SiTiktok, 
  SiOpenai, 
  SiInstagram, 
  SiYoutube,
  SiX 
} from "react-icons/si";
import { Smartphone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Channel } from "@shared/schema";

interface ConnectionCardProps {
  title: string;
  icon: React.ElementType;
  isConnected: boolean;
  onConnect: (credentials: Record<string, string>) => void;
  credentialFields?: {
    name: string;
    type: "text" | "password";
    placeholder: string;
  }[];
}

const ConnectionCard = ({ title, icon: Icon, isConnected, onConnect, credentialFields }: ConnectionCardProps) => {
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  return (
    <Card className="relative overflow-hidden bg-card border-border/20">
      <div className="absolute inset-0 bg-gradient-glow opacity-5" />
      <div className="relative p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-glow opacity-20 rounded-lg blur-sm"></div>
            <div className="relative p-3 rounded-lg bg-background">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-destructive'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
        </div>

        {credentialFields && (
          <div className="space-y-4 mb-4">
            {credentialFields.map((field) => (
              <Input
                key={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={credentials[field.name] || ''}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  [field.name]: e.target.value
                }))}
                className="bg-background border-border/20"
              />
            ))}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full border-border/20 hover:bg-primary/10 transition-all duration-200"
          onClick={() => onConnect(credentials)}
        >
          <span>Connect {title.split(' ')[0]}</span>
        </Button>
      </div>
    </Card>
  );
};

export default function ConnectionSettings() {
  const [openAiKey, setOpenAiKey] = useState("");
  const [isOpenAiConnected, setIsOpenAiConnected] = useState(false);
  const { toast } = useToast();

  // Fetch existing channels
  const { data: channels = [] } = useQuery<Channel[]>({
    queryKey: ['/api/channels'],
  });

  const socialConnections = [
    {
      title: "WhatsApp Connection",
      icon: SiWhatsapp,
      isConnected: channels.some(c => c.type === 'whatsapp'),
      credentialFields: [
        { name: "apiKey", type: "password" as const, placeholder: "API Key" },
        { name: "phoneNumberId", type: "text" as const, placeholder: "Phone Number ID" },
        { name: "businessAccountId", type: "text" as const, placeholder: "Business Account ID" }
      ]
    },
    {
      title: "Telegram Connection",
      icon: SiTelegram,
      isConnected: channels.some(c => c.type === 'telegram'),
      credentialFields: [
        { name: "botToken", type: "password" as const, placeholder: "Bot Token" },
        { name: "webhookUrl", type: "text" as const, placeholder: "Webhook URL" }
      ]
    },
    {
      title: "Instagram",
      icon: SiInstagram,
      isConnected: channels.some(c => c.type === 'instagram'),
      credentialFields: [
        { name: "accessToken", type: "password" as const, placeholder: "Access Token" },
        { name: "userId", type: "text" as const, placeholder: "User ID" }
      ]
    },
    {
      title: "X (Twitter)",
      icon: SiX,
      isConnected: channels.some(c => c.type === 'twitter'),
      credentialFields: [
        { name: "apiKey", type: "password" as const, placeholder: "API Key" },
        { name: "apiSecret", type: "password" as const, placeholder: "API Secret" },
        { name: "accessToken", type: "password" as const, placeholder: "Access Token" },
        { name: "accessSecret", type: "password" as const, placeholder: "Access Secret" }
      ]
    },
    {
      title: "YouTube",
      icon: SiYoutube,
      isConnected: channels.some(c => c.type === 'youtube'),
      credentialFields: [
        { name: "apiKey", type: "password" as const, placeholder: "API Key" },
        { name: "channelId", type: "text" as const, placeholder: "Channel ID" }
      ]
    },
    {
      title: "TikTok Connection",
      icon: SiTiktok,
      isConnected: channels.some(c => c.type === 'tiktok'),
      credentialFields: [
        { name: "accessToken", type: "password" as const, placeholder: "Access Token" },
        { name: "clientKey", type: "text" as const, placeholder: "Client Key" },
        { name: "clientSecret", type: "password" as const, placeholder: "Client Secret" }
      ]
    },
    {
      title: "SMS Connection",
      icon: Smartphone,
      isConnected: channels.some(c => c.type === 'sms'),
      credentialFields: [
        { name: "accountSid", type: "text" as const, placeholder: "Account SID" },
        { name: "authToken", type: "password" as const, placeholder: "Auth Token" },
        { name: "phoneNumber", type: "text" as const, placeholder: "Phone Number" }
      ]
    }
  ];

  const handleOpenAiConnect = async () => {
    if (!openAiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsOpenAiConnected(true);
      toast({
        title: "Success",
        description: "OpenAI API key connected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect OpenAI API",
        variant: "destructive",
      });
    }
  };

  const handleSocialConnect = async (type: string, credentials: Record<string, string>) => {
    try {
      const response = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${type} Connection`,
          type: type.toLowerCase(),
          credentials: JSON.stringify(credentials),
          config: {}
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect channel");
      }

      toast({
        title: "Success",
        description: `${type} connected successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to connect ${type}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-background">
      <Header title="Communication Channels" />

      <Card className="relative overflow-hidden bg-card border-border/20">
        <div className="absolute inset-0 bg-gradient-glow opacity-5" />
        <div className="relative p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-glow opacity-20 rounded-lg blur-sm"></div>
              <div className="relative p-3 rounded-lg bg-background">
                <SiOpenai className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">OpenAI Connection</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${isOpenAiConnected ? 'bg-green-500' : 'bg-destructive'}`} />
                <span className="text-sm text-muted-foreground">
                  {isOpenAiConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              className="bg-background border-border/20"
            />
            <Button
              variant="outline"
              className="w-full border-border/20 hover:bg-primary/10 transition-all duration-200"
              onClick={handleOpenAiConnect}
            >
              Connect OpenAI
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {socialConnections.map((connection, index) => (
          <ConnectionCard
            key={index}
            {...connection}
            onConnect={(credentials) => handleSocialConnect(connection.title.split(' ')[0], credentials)}
          />
        ))}
      </div>
      <Card className="relative overflow-hidden bg-card border-border/20 p-6">
        <div className="absolute inset-0 bg-gradient-glow opacity-5" />
        <div className="relative">
          <Button 
            className="w-full py-6 bg-gradient-glow hover:opacity-90 transition-opacity duration-200"
          >
            <span className="text-lg font-semibold">Create New Post</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}