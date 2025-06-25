import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/components/cart/cart-provider";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import Header from "@/components/layout/header";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Pricing from "@/pages/pricing";
import Team from "@/pages/team";
import Partners from "@/pages/partners";
import Contact from "@/pages/contact";
import Dashboard from "@/pages/dashboard";
import Admin from "@/pages/admin";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Switch>
          {isLoading || !isAuthenticated ? (
            <>
              <Route path="/" component={Landing} />
              <Route path="/services" component={Services} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/team" component={Team} />
              <Route path="/partners" component={Partners} />
              <Route path="/contact" component={Contact} />
            </>
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/services" component={Services} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/team" component={Team} />
              <Route path="/partners" component={Partners} />
              <Route path="/contact" component={Contact} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/admin" component={Admin} />
              <Route path="/checkout" component={Checkout} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
