import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

// Pages
import Landing from "@/pages/landing";
import Onboarding from "@/pages/onboarding";
import FeedConnect from "@/pages/feed-connect";
import EmpowerBridge from "@/pages/empower-bridge";
import EduBridge from "@/pages/edu-bridge";
import ImpactDashboard from "@/pages/impact-dashboard";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminAnalyticsDashboard from "@/pages/admin-analytics-dashboard";
import TempDonorDashboard from "@/pages/temp-donor-dashboard";
import TempDonorSuccess from "@/pages/temp-donor-success";
import NGODashboard from "@/pages/ngo-dashboard";
import ConsumerDashboard from "@/pages/consumer-dashboard";
import ServiceProviderDashboard from "@/pages/service-provider-dashboard";
import BlockchainVerification from "@/pages/blockchain-verification";
import { BlockchainProofUpload } from "@/components/blockchain-proof-upload";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/feed-connect" component={FeedConnect} />
      <Route path="/empower-bridge" component={EmpowerBridge} />
      <Route path="/edu-bridge" component={EduBridge} />
      <Route path="/impact" component={ImpactDashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/admin-analytics" component={AdminAnalyticsDashboard} />
      <Route path="/temp-donor-dashboard" component={TempDonorDashboard} />
      <Route path="/donor-dashboard" component={TempDonorDashboard} />
      <Route path="/temp-donor-success" component={TempDonorSuccess} />
      <Route path="/ngo-dashboard" component={NGODashboard} />
      <Route path="/consumer-dashboard" component={ConsumerDashboard} />
      <Route path="/service-provider-dashboard" component={ServiceProviderDashboard} />
      <Route path="/blockchain" component={BlockchainVerification} />
      <Route path="/blockchain/upload" component={BlockchainProofUpload} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { setUser } = useAppStore();
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const me = await res.json();
          setUser({ id: me.id, name: me.name, role: me.role, email: me.email, joinedDate: new Date() } as any);
        } else {
          setUser(null as any);
        }
      } catch {
        setUser(null as any);
      }
    })();
  }, [setUser]);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>
            <Router />
          </main>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
