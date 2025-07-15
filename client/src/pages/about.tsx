import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Users, 
  Server, 
  Clock, 
  Shield,
  Target,
  Heart,
  Code
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Customer First",
      description: "Every decision we make is centered around delivering exceptional value to our customers."
    },
    {
      icon: Shield,
      title: "Security & Reliability",
      description: "We maintain the highest standards of security and ensure 99.9% uptime for all services."
    },
    {
      icon: Heart,
      title: "Community Focused",
      description: "We're passionate about the Minecraft community and helping creators build amazing experiences."
    },
    {
      icon: Code,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge solutions for modern Minecraft servers."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              These core principles guide everything we do at Seragon.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <value.icon className="h-8 w-8 text-green-400" />
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Seragon?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="pt-6">
                <div className="text-green-400 text-4xl font-bold mb-2">$2.33</div>
                <div className="text-gray-400 mb-4">Starting Price</div>
                <p className="text-sm text-gray-300">
                  Ultra-affordable pricing that doesn't compromise on quality. All services under $20.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="pt-6">
                <div className="text-green-400 text-4xl font-bold mb-2">24/7</div>
                <div className="text-gray-400 mb-4">Support</div>
                <p className="text-sm text-gray-300">
                  Round-the-clock support to ensure your server runs smoothly at all times.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="pt-6">
                <div className="text-green-400 text-4xl font-bold mb-2">99.9%</div>
                <div className="text-gray-400 mb-4">Uptime</div>
                <p className="text-sm text-gray-300">
                  Enterprise-grade infrastructure ensuring your server is always accessible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}