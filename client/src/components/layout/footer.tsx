import { Link } from "wouter";
import { 
  Github, 
  Twitter, 
  MessageCircle, 
  Mail, 
  Box,
  ExternalLink
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const navigation = {
    services: [
      { name: "Server Hosting", href: "/services#hosting" },
      { name: "Custom Development", href: "/services#development" },
      { name: "Design Services", href: "/services#design" },
      { name: "Support Services", href: "/services#support" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Partners", href: "/partners" },
      { name: "Blog", href: "/blog" },
    ],
    resources: [
      { name: "Testimonials", href: "/testimonials" },
      { name: "Pricing", href: "/pricing" },
      { name: "Contact", href: "/contact" },
      { name: "Support", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refunds" },
    ],
  };

  const socialLinks = [
    { name: "Discord", href: "https://discord.gg/b4f8WZy4R8", icon: MessageCircle },
    { name: "Twitter", href: "https://twitter.com/seragonmc", icon: Twitter },
    { name: "GitHub", href: "https://github.com/seragon", icon: Github },
    { name: "Email", href: "mailto:kirodev.java@gmail.com", icon: Mail },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Box className="text-3xl text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text" />
              <span className="text-2xl font-bold gradient-text">Seragon</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Affordable Minecraft server solutions by Sterix. Professional quality, budget-friendly prices.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Seragon by Sterix. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>All services available</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <span className="text-red-400">♥</span>
              <span>for the Minecraft community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}