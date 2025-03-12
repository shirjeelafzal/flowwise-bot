import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ViewProvider } from "./hooks/use-view";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/Home";
import AIConfig from "./pages/AIConfig";
import Triggers from "./pages/Triggers";
import Channels from "./pages/Channels";
import Settings from "./pages/Settings";
import Appointments from "./pages/Appointments";
import Conversations from "./pages/Conversations";
import ConnectionSettings from "./pages/ConnectionSettings";
import MySocials from "./pages/MySocials";
import Chat from "./pages/Chat";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chat" component={Chat} />
        <Route path="/ai-config" component={AIConfig} />
        <Route path="/triggers" component={Triggers} />
        <Route path="/channels" component={Channels} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/conversations" component={Conversations} />
        <Route path="/settings" component={Settings} />
        <Route path="/connection-settings" component={ConnectionSettings} />
        <Route path="/my-socials" component={MySocials} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ViewProvider>
        <Router />
        <Toaster />
      </ViewProvider>
    </QueryClientProvider>
  );
}

export default App;