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
  const stats = [
    { icon: Users, label: "Happy Customers", value: "2,500+" },
    { icon: Server, label: "Servers Hosted", value: "1,200+" },
    { icon: Clock, label: "Years of Experience", value: "5+" },
    { icon: Award, label: "Success Rate", value: "99.8%" },
  ];

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
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/30">
            About Seragon
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Powering Minecraft Dreams
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Founded by passionate Minecraft enthusiasts, Seragon by Sterix has been the trusted partner 
            for thousands of server owners worldwide. We combine technical expertise with genuine care 
            for the community to deliver exceptional hosting and development services.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 mb-6">
                To empower Minecraft server owners with affordable, reliable, and innovative solutions 
                that help them build thriving communities. We believe that great ideas shouldn't be 
                limited by technical barriers or expensive costs.
              </p>
              <p className="text-lg text-gray-300">
                Every service we offer is designed with affordability in mind, ensuring that creators 
                of all sizes can access professional-grade hosting, development, and support services.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Team collaboration"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-black px-4 py-2 rounded-lg font-bold">
                Since 2019
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <div className="text-green-400 text-4xl font-bold mb-2">$5.99</div>
                <div className="text-gray-400 mb-4">Starting Price</div>
                <p className="text-sm text-gray-300">
                  Affordable pricing that doesn't compromise on quality. All services under $30.
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