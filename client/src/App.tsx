import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";

// Pages
import Landing from "@/pages/landing";
import Onboarding from "@/pages/onboarding";
import FeedConnect from "@/pages/feed-connect";
import EmpowerBridge from "@/pages/empower-bridge";
import EduBridge from "@/pages/edu-bridge";
import ImpactDashboard from "@/pages/impact-dashboard";
import Dashboard from "@/pages/dashboard";
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
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
