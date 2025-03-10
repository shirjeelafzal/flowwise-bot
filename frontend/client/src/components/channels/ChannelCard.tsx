import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "../shared/StatusBadge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ChannelConfigDialog from "./ChannelConfigDialog";

interface ChannelCardProps {
  type: "whatsapp" | "telegram" | "messenger" | "tiktok" | "sms";
  title: string;
  channelId?: number;
  connected: boolean;
}

export default function ChannelCard({ type, title, channelId, connected: initialConnected }: ChannelCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(initialConnected);
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation for updating channel status
  const updateChannelStatus = useMutation({
    mutationFn: async (credentials: any) => {
      if (!channelId) {
        // If no channelId, create a new channel
        return apiRequest('POST', '/api/channels', {
          name: title,
          type,
          credentials,
          config: {}
        });
      }
      // Otherwise update existing channel
      return apiRequest('PATCH', `/api/channels/${channelId}/status`, { isActive: true });
    },
    onSuccess: () => {
      setIsConnected(true);
      toast({
        title: "Success",
        description: `${title} connected successfully`,
      });
      // Invalidate channels query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/channels'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to connect ${title}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsConnecting(false);
      setShowConfig(false);
    }
  });

  const handleConnect = () => {
    setShowConfig(true);
  };

  const handleConfigSubmit = (credentials: any) => {
    setIsConnecting(true);
    updateChannelStatus.mutate(credentials);
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-medium">{title}</h3>
          <StatusBadge active={isConnected} />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : `Connect ${type}`}
        </Button>
      </Card>

      <ChannelConfigDialog
        type={type}
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        onSubmit={handleConfigSubmit}
      />
    </>
  );
}