import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Server, 
  Headphones, 
  Shield, 
  Rocket,
  Tag,
  LayoutDashboard,
  ShoppingCart
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard-stats"],
  });

  return (
    <div className="min-h-screen">
      {/* Welcome Section */}
      <section className="bg-minecraft py-16 px-6">
        <div className="bg-gradient-to-b from-black/80 to-gray-900/80">
          <div className="max-w-screen-xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Welcome back, <span className="gradient-text">{user?.firstName || "User"}</span>!
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Ready to enhance your Minecraft server? Explore our services, manage your orders, or check your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="btn-primary font-bold py-4 px-8 rounded-full text-lg">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/services">
                <Button className="btn-secondary font-bold py-4 px-8 rounded-full text-lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Browse Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-6 bg-gray-900 border-b border-gray-800">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Your Account Overview</h2>
          
          {statsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="dashboard-stat">
                <CardContent className="pt-6">
                  <div className="text-3xl gradient-text mb-2">{stats?.totalOrders || 0}</div>
                  <div className="text-gray-400">Total Orders</div>
                </CardContent>
              </Card>
              
              <Card className="dashboard-stat">
                <CardContent className="pt-6">
                  <div className="text-3xl gradient-text mb-2">{stats?.activeServices || 0}</div>
                  <div className="text-gray-400">Active Services</div>
                </CardContent>
              </Card>
              
              <Card className="dashboard-stat">
                <CardContent className="pt-6">
                  <div className="text-3xl gradient-text mb-2">${stats?.totalRevenue || 0}</div>
                  <div className="text-gray-400">Total Spent</div>
                </CardContent>
              </Card>
              
              <Card className="dashboard-stat">
                <CardContent className="pt-6">
                  <div className="text-3xl gradient-text mb-2">{stats?.openTickets || 0}</div>
                  <div className="text-gray-400">Support Tickets</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">Seragon</span>?
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              We deliver exceptional Minecraft server solutions with cutting-edge technology and 24/7 support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="service-card text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Infrastructure</h3>
                <p className="text-gray-400">
                  High-performance servers with 99.9% uptime guarantee and DDoS protection.
                </p>
              </CardContent>
            </Card>
            
            <Card className="service-card text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Expert Support</h3>
                <p className="text-gray-400">
                  Round-the-clock technical support from certified Minecraft professionals.
                </p>
              </CardContent>
            </Card>
            
            <Card className="service-card text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
                <p className="text-gray-400">
                  Bank-grade security with automated backups and fraud protection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
