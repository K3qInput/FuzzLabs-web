import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  MessageCircle, 
  Clock,
  Globe,
  Shield,
  Headphones
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email within 2 hours",
    contact: "kirodev.java@gmail.com",
    action: "mailto:kirodev.java@gmail.com"
  },
  {
    icon: MessageCircle,
    title: "Discord Community",
    description: "Join our Discord for instant support",
    contact: "discord.gg/b4f8WZy4R8",
    action: "https://discord.gg/b4f8WZy4R8"
  }
];

const supportFeatures = [
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance for all our hosting customers"
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Support teams across multiple time zones worldwide"
  },
  {
    icon: Shield,
    title: "Expert Team",
    description: "Certified Minecraft professionals with years of experience"
  },
  {
    icon: Headphones,
    title: "Multiple Channels",
    description: "Email, Discord, and live chat support options"
  }
];

export default function Contact() {
  return (
    <div className="min-h-screen py-20 px-6 bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Ready to start your project? Contact us today and let's build something amazing together.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 md:col-span-2">Contact Methods</h2>
            {contactMethods.map((method) => {
              const IconComponent = method.icon;
              
              return (
                <Card key={method.title} className="order-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{method.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{method.description}</p>
                        <a
                          href={method.action}
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          {method.contact}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Support Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Our <span className="gradient-text">Support Promise</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {supportFeatures.map((feature) => {
              const IconComponent = feature.icon;
              
              return (
                <Card key={feature.title} className="service-card text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}