import { Card } from "@/components/ui/card";
import Header from "../components/layout/Header";
import StatusBadge from "../components/shared/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import axios from "axios";
import {
  SiFacebook,
  SiInstagram,
  SiYoutube,
  SiX,
  SiLinkedin,
  SiTiktok
} from "react-icons/si";

interface PlatformStats {
  platform: string;
  icon: React.ElementType;
  totalMessages: number;
  answered: number;
  unanswered: number;
  successRate: number;
}

const StatCard = ({ platform, icon: Icon, totalMessages, answered, unanswered, successRate }: PlatformStats) => (
  <Card className="relative overflow-hidden bg-[#111318] border-brand-silver/20">
    <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-purple/5 opacity-30" />
    <div className="relative p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-6 h-6 text-brand-accent" />
        <h3 className="text-lg font-medium text-brand-silver">{platform}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-brand-silver">Total Messages</span>
          <span className="text-xl font-bold text-brand-silver">{totalMessages}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-brand-silver">Answered</span>
          <span className="text-lg text-brand-accent">{answered}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-brand-silver">Unanswered</span>
          <span className="text-lg text-brand-purple">{unanswered}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-brand-silver">Success Rate</span>
          <span className="text-lg text-green-500">{successRate}%</span>
        </div>
      </div>
    </div>
  </Card>
);

interface RecentActivity {
  id: number;
  platform: string;
  action: string;
  timestamp: string;
}

export default function Home() {
  // Fetch platform statistics
  const { data: platforms = [], isLoading: isLoadingStats } = useQuery<PlatformStats[]>({
    queryKey: ['/api/platform-stats'],
    queryFn: () => ([
      {
        platform: "Facebook",
        icon: SiFacebook,
        totalMessages: 145,
        answered: 120,
        unanswered: 25,
        successRate: 82
      },
      {
        platform: "Instagram",
        icon: SiInstagram,
        totalMessages: 89,
        answered: 75,
        unanswered: 14,
        successRate: 78
      },
      {
        platform: "X (Twitter)",
        icon: SiX,
        totalMessages: 56,
        answered: 45,
        unanswered: 11,
        successRate: 65
      },
      {
        platform: "LinkedIn",
        icon: SiLinkedin,
        totalMessages: 34,
        answered: 30,
        unanswered: 4,
        successRate: 88
      },
      {
        platform: "TikTok",
        icon: SiTiktok,
        totalMessages: 78,
        answered: 60,
        unanswered: 18,
        successRate: 70
      },
      {
        platform: "YouTube",
        icon: SiYoutube,
        totalMessages: 23,
        answered: 20,
        unanswered: 3,
        successRate: 85
      }
    ])
  });

  // Calculate top stats from platform data
  // const totalMessages = platforms.reduce((sum, p) => sum + p.totalMessages, 0);
  const totalAnswered = platforms.reduce((sum, p) => sum + p.answered, 0);
  // const activeChannels = platforms.length;
  const avgSuccessRate = Math.round(
    platforms.reduce((sum, p) => sum + p.successRate, 0) / platforms.length
  );


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

  const { data: totalMessages = 0 } = useQuery({
    queryKey: ['recentMessages'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/analytics`);
        return response.data.messages;
      } catch (error) {
        console.error("Error fetching recent messages:", error);
        return 0;
      }
    },
  });
  const { data: activeChannels = 0 } = useQuery({
    queryKey: ['activeChannels'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/connections`);
        return response.data.active_channels;
      } catch (error) {
        console.error("Error fetching channels:", error);
        return 0;
      }
    },
  });
  const { data: activeScenarios = 0 } = useQuery({
    queryKey: ['activeScenarios'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/scenarios`);
        return response.data.active_scenarios;
      } catch (error) {
        console.error("Error fetching active scenarios:", error);
        return 0;
      }
    },
  });
  const stats = [
    { label: "Total Messages", value: totalMessages.toString(), status: true, details: "All Channels" },
    { label: "Messages Answered", value: totalAnswered.toString(), status: true, details: "Success Rate: " + avgSuccessRate + "%" },
    { label: "Active Channels", value: activeChannels.toString(), status: true, details: "Connected" },
    { label: "Active Scenarios", value: activeScenarios.toString(), status: true, details: "Scenarios" },
  ];

  // Fetch recent activity
  const { data: recentActivity = [], isLoading: isLoadingActivity } = useQuery<RecentActivity[]>({
    queryKey: ['/api/recent-activity'],
    queryFn: () => ([
      { id: 1, platform: "Instagram", action: "Message answered - Appointment scheduled", timestamp: "2 min ago" },
      { id: 2, platform: "Facebook", action: "New inquiry received", timestamp: "5 min ago" },
      { id: 3, platform: "LinkedIn", action: "Message answered - Product information sent", timestamp: "10 min ago" },
      { id: 4, platform: "TikTok", action: "Message answered - Sale completed", timestamp: "15 min ago" },
    ])
  });

  if (isLoadingStats || isLoadingActivity) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="p-4 flex-shrink-0">
        <Header title="Dashboard" />
      </div>

      {/* Top Stats */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden bg-[#111318] border-brand-silver/20 p-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-purple/5 opacity-30" />
            <div className="relative">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-medium text-brand-silver">{stat.label}</h3>
                <StatusBadge active={stat.status} className="scale-90" />
              </div>
              <div className="mt-6">
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
                  {stat.value}
                </p>
                <p className="text-sm text-brand-silver/70 mt-1">{stat.details}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Platform Stats Grid */}
      <div className="px-4 flex-1 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <StatCard key={platform.platform} {...platform} />
          ))}
        </div>
      </div>

      {/* Recent Activity Card */}
      <Card className="mx-4 mb-4 relative overflow-hidden bg-[#111318] border-brand-silver/20">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-brand-purple/5 opacity-30" />
        <div className="relative p-6">
          <h2 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
            Recent Activity
          </h2>
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <span className="text-brand-accent">{activity.platform}</span>
                    <span className="text-brand-silver mx-2">•</span>
                    <span className="text-brand-silver">{activity.action}</span>
                  </div>
                  <span className="text-brand-silver/70 ml-4">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}