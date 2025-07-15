import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Server, 
  Headphones, 
  Shield, 
  Rocket,
  Tag
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-minecraft py-24 px-6">
        <div className="bg-gradient-to-b from-black/80 to-gray-900/80">
          <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                <span className="gradient-text">Ultimate Minecraft</span><br />
                Server Solutions
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
                From world-class server setups to stunning custom assets, Seragon by Sterix is your one-stop solution for premium Minecraft experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/services">
                  <Button className="btn-primary font-bold py-4 px-8 rounded-full text-lg">
                    <Rocket className="mr-2 h-5 w-5" />
                    Explore Services
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button className="btn-secondary font-bold py-4 px-8 rounded-full text-lg">
                    <Tag className="mr-2 h-5 w-5" />
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Gaming server setup with multiple monitors" 
                className="rounded-xl shadow-2xl floating w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-900">
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
