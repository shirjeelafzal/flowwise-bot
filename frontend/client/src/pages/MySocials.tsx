import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "../components/layout/Header";
import { 
  SiFacebook, 
  SiInstagram, 
  SiYoutube, 
  SiX,
  SiLinkedin,
  SiTiktok,
  SiReddit,
  SiDiscord
} from "react-icons/si";
import { Store } from 'lucide-react';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SocialPlatform {
  name: string;
  icon: React.ElementType;
  type: string;
}

const SocialCard = ({ platform }: { platform: SocialPlatform }) => {
  const [accessToken, setAccessToken] = useState("");
  const { toast } = useToast();
  const Icon = platform.icon;

  return (
    <Card className="relative overflow-hidden bg-[#111318] border-brand-silver/20 p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-purple/5 opacity-30" />
      <div className="relative space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="w-6 h-6 text-brand-accent" />
          <h2 className="text-lg font-semibold text-brand-silver">{platform.name}</h2>
        </div>

        <Input
          type="password"
          placeholder="Enter Access Token"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          className="bg-background border-brand-silver/20 h-9"
        />

        <Button 
          onClick={() => {
            toast({
              title: "Configuration Saved",
              description: `${platform.name} configuration has been saved successfully.`,
            });
          }}
          className="w-full bg-gradient-to-r from-brand-accent to-brand-purple hover:opacity-90 h-9"
        >
          Save Configuration
        </Button>
      </div>
    </Card>
  );
};

export default function MySocials() {
  const platforms: SocialPlatform[] = [
    {
      name: "Facebook",
      icon: SiFacebook,
      type: "facebook",
    },
    {
      name: "Instagram",
      icon: SiInstagram,
      type: "instagram",
    },
    {
      name: "YouTube",
      icon: SiYoutube,
      type: "youtube",
    },
    {
      name: "X (Twitter)",
      icon: SiX,
      type: "twitter",
    },
    {
      name: "LinkedIn",
      icon: SiLinkedin,
      type: "linkedin",
    },
    {
      name: "TikTok",
      icon: SiTiktok,
      type: "tiktok",
    },
    {
      name: "Reddit",
      icon: SiReddit,
      type: "reddit",
    },
    {
      name: "Discord",
      icon: SiDiscord,
      type: "discord",
    },
    {
      name: "LetGo",
      icon: Store,
      type: "letgo",
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex-shrink-0">
        <Header title="Social Media Platforms" />
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="grid gap-4">
          {platforms.map((platform) => (
            <SocialCard key={platform.name} platform={platform} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}