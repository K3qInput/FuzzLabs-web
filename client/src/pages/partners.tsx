import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink,
  Shield,
  Server,
  Zap,
  Globe,
  Award,
  Mail
} from "lucide-react";

const partners = [
  {
    name: "CloudFlare",
    description: "Global CDN and DDoS protection services ensuring fast and secure connections worldwide.",
    logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&w=200&h=100&fit=crop",
    category: "Security",
    website: "https://cloudflare.com",
    icon: Shield,
    benefits: ["DDoS Protection", "Global CDN", "SSL Certificates", "Analytics"]
  },
  {
    name: "DigitalOcean",
    description: "Cloud infrastructure provider powering our high-performance server hosting solutions.",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&w=200&h=100&fit=crop",
    category: "Infrastructure",
    website: "https://digitalocean.com",
    icon: Server,
    benefits: ["SSD Storage", "Scalable Droplets", "Global Data Centers", "99.99% Uptime"]
  },
  {
    name: "Stripe",
    description: "Secure payment processing platform enabling seamless transactions for our customers.",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&w=200&h=100&fit=crop",
    category: "Payments",
    website: "https://stripe.com",
    icon: Zap,
    benefits: ["Secure Payments", "Global Support", "Fraud Protection", "Easy Integration"]
  },
  {
    name: "Discord",
    description: "Communication platform integration for seamless community management and support.",
    logo: "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&w=200&h=100&fit=crop",
    category: "Communication",
    website: "https://discord.com",
    icon: Globe,
    benefits: ["Bot Integration", "Community Tools", "Voice Channels", "Rich Presence"]
  }
];

const certifications = [
  {
    name: "ISO 27001",
    description: "Information Security Management System certification",
    icon: Shield
  },
  {
    name: "SOC 2 Type II",
    description: "Security, Availability, and Processing Integrity compliance",
    icon: Award
  },
  {
    name: "PCI DSS",
    description: "Payment Card Industry Data Security Standard compliance",
    icon: Zap
  },
  {
    name: "GDPR Compliant",
    description: "General Data Protection Regulation compliance",
    icon: Globe
  }
];

export default function Partners() {
  return (
    <div className="min-h-screen py-20 px-6 bg-gray-900">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Partners</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Trusted by industry leaders worldwide. We partner with the best technology companies to deliver exceptional Minecraft hosting services.
          </p>
        </div>

        {/* Technology Partners */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Technology <span className="gradient-text">Partners</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {partners.map((partner) => {
              const IconComponent = partner.icon;
              
              return (
                <Card key={partner.name} className="partner-card">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-10 w-10 text-black" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-bold">{partner.name}</h3>
                          <Badge variant="outline" className="border-green-400 text-green-400">
                            {partner.category}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-400 mb-4 leading-relaxed">
                          {partner.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 mb-6">
                          {partner.benefits.map((benefit) => (
                            <div key={benefit} className="text-sm text-gray-300 flex items-center">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                              {benefit}
                            </div>
                          ))}
                        </div>
                        
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                        >
                          Visit Website
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Security <span className="gradient-text">Certifications</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {certifications.map((cert) => {
              const IconComponent = cert.icon;
              
              return (
                <Card key={cert.name} className="partner-card text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{cert.name}</h3>
                    <p className="text-gray-400 text-sm">{cert.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Partnership Stats */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Partnership <span className="gradient-text">Impact</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">15+</div>
              <div className="text-gray-400">Global Partners</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">50+</div>
              <div className="text-gray-400">Data Centers</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">180+</div>
              <div className="text-gray-400">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">99.99%</div>
              <div className="text-gray-400">Network Uptime</div>
            </div>
          </div>
        </div>

        {/* Become a Partner */}
        <div className="text-center bg-black rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Become a <span className="gradient-text">Partner</span>
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our growing network of technology partners and help us deliver exceptional Minecraft hosting services to communities worldwide.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-black" />
              </div>
              <h3 className="font-semibold mb-2">Global Reach</h3>
              <p className="text-gray-400 text-sm">Access to worldwide customer base</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-black" />
              </div>
              <h3 className="font-semibold mb-2">Technical Excellence</h3>
              <p className="text-gray-400 text-sm">Collaborate on cutting-edge solutions</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-black" />
              </div>
              <h3 className="font-semibold mb-2">Mutual Growth</h3>
              <p className="text-gray-400 text-sm">Shared success and revenue opportunities</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:partnerships@fuzzlabs.com" 
              className="btn-primary font-bold py-3 px-8 rounded-full inline-flex items-center justify-center"
            >
              <Mail className="mr-2 h-5 w-5" />
              Partner with Us
            </a>
            <Button className="btn-secondary font-bold py-3 px-8 rounded-full">
              Partnership Guidelines
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
