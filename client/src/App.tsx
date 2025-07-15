import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/components/cart/cart-provider";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Fireflies from "@/components/ui/fireflies";
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
import About from "@/pages/about";
import Blog from "@/pages/blog";
import Testimonials from "@/pages/testimonials";
import NotFound from "@/pages/not-found";
import { AIChatToggle } from "@/components/ai-chat/ai-chatbot";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Fireflies />
      <Header />
      <main>
        <Switch>
          <Route path="/" component={isAuthenticated ? Home : Landing} />
          <Route path="/services" component={Services} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/about" component={About} />
          <Route path="/blog" component={Blog} />
          <Route path="/testimonials" component={Testimonials} />
          <Route path="/team" component={Team} />
          <Route path="/partners" component={Partners} />
          <Route path="/contact" component={Contact} />
          {isAuthenticated && (
            <>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/admin" component={Admin} />
              <Route path="/checkout" component={Checkout} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <AIChatToggle />
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
