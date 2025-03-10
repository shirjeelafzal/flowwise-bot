import Header from "../components/layout/Header";
import ChannelCard from "../components/channels/ChannelCard";
import { useQuery } from "@tanstack/react-query";
import type { Channel } from "@shared/schema";

export default function Channels() {
  const { data: channels, isLoading } = useQuery<Channel[]>({
    queryKey: ['/api/channels'],
  });

  return (
    <div className="p-6">
      <Header title="Communication Channels" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Card */}
        <ChannelCard 
          type="whatsapp"
          title="WhatsApp Connection"
          channelId={channels?.find(c => c.type === 'whatsapp')?.id}
          connected={channels?.some(c => c.type === 'whatsapp' && c.isActive) ?? false}
        />
        {/* Telegram Card */}
        <ChannelCard 
          type="telegram"
          title="Telegram Connection"
          channelId={channels?.find(c => c.type === 'telegram')?.id}
          connected={channels?.some(c => c.type === 'telegram' && c.isActive) ?? false}
        />
        {/* Facebook Messenger Card */}
        <ChannelCard 
          type="messenger"
          title="Facebook Messenger Connection"
          channelId={channels?.find(c => c.type === 'messenger')?.id}
          connected={channels?.some(c => c.type === 'messenger' && c.isActive) ?? false}
        />
        {/* TikTok DMs Card */}
        <ChannelCard 
          type="tiktok"
          title="TikTok DMs Connection"
          channelId={channels?.find(c => c.type === 'tiktok')?.id}
          connected={channels?.some(c => c.type === 'tiktok' && c.isActive) ?? false}
        />
        {/* SMS Card */}
        <ChannelCard 
          type="sms"
          title="SMS Connection"
          channelId={channels?.find(c => c.type === 'sms')?.id}
          connected={channels?.some(c => c.type === 'sms' && c.isActive) ?? false}
        />
      </div>
    </div>
  );
}