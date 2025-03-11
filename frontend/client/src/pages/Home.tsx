import { Card } from "@/components/ui/card";
import Header from "../components/layout/Header";
import StatusBadge from "../components/shared/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
const fetchActiveChannels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/connections`);
    return response.data.active_channels;
  } catch (error) {
    console.error("Error fetching channels:", error);
    return 0;
  }
};

export default function Home() {
  const { data: activeChannels = 0 } = useQuery({
    queryKey: ['activeChannels'],
    queryFn: fetchActiveChannels,
  });
  const { data: activeUsers = 0 } = useQuery({
    queryKey: ['activeUsers'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data.active_users;
      } catch (error) {
        console.error("Error fetching active users:", error);
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
  const { data: recentMessages = 0 } = useQuery({
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
  const stats = [
    { label: "AI Model", value: "GPT-4", status: true, details: "Connected" },
    { label: "Active Channels", value: activeChannels.toString(), status: true, details: "Channels" },
    { label: "Active Users", value: activeUsers.toString(), status: true, details: "Users" },
    { label: "Active Scenarios", value: activeScenarios.toString(), status: true, details: "Scenarios" },
    { label: "Recent Messages", value: recentMessages, status: true, details: "Today" },
  ];

  const { data: platforms = [], isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/platform-stats'],
    queryFn: async (): Promise<PlatformStats[]> => [
      { platform: "Facebook", icon: SiFacebook, totalMessages: 145, answered: 120, unanswered: 25, successRate: 82 },
      { platform: "Instagram", icon: SiInstagram, totalMessages: 89, answered: 75, unanswered: 14, successRate: 78 },
      { platform: "X (Twitter)", icon: SiX, totalMessages: 56, answered: 45, unanswered: 11, successRate: 65 },
      { platform: "LinkedIn", icon: SiLinkedin, totalMessages: 34, answered: 30, unanswered: 4, successRate: 88 },
      { platform: "TikTok", icon: SiTiktok, totalMessages: 78, answered: 60, unanswered: 18, successRate: 70 },
      { platform: "YouTube", icon: SiYoutube, totalMessages: 23, answered: 20, unanswered: 3, successRate: 85 },
    ],
  });

  const { data: recentActivity = [] } = useQuery({
    queryKey: ['/api/recent-activity'],
    queryFn: async (): Promise<RecentActivity[]> => [
      { id: 1, platform: "Instagram", action: "Message answered - Appointment scheduled", timestamp: "2 min ago" },
      { id: 2, platform: "Facebook", action: "New inquiry received", timestamp: "5 min ago" },
      { id: 3, platform: "LinkedIn", action: "Message answered - Product information sent", timestamp: "10 min ago" },
      { id: 4, platform: "TikTok", action: "Message answered - Sale completed", timestamp: "15 min ago" },
    ],
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="p-4 flex-shrink-0">
        <Header title="Dashboard" />
      </div>
      <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden bg-[#111318] border-brand-silver/20 p-6">
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
    </div>
  );
}
