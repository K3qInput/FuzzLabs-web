import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Box } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-black/90 backdrop-blur-lg py-4 px-6 sticky top-0 z-50 border-b border-gray-800/50 transition-all duration-300">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <Box className="text-3xl text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text transform group-hover:scale-110 transition-transform duration-300" />
          <span className="text-2xl font-bold gradient-text">Seragon</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link text-gray-300 transition-colors ${
                isActive(item.href) ? "active-link" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => window.open('https://discord.gg/b4f8WZy4R8', '_blank')}
            className="text-gray-300 hover:text-green-400"
          >
            Discord
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-900 border-gray-700">
            <div className="flex flex-col space-y-4 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-white py-2 px-4 rounded transition-colors ${
                    isActive(item.href) ? "bg-green-400 text-black" : "hover:bg-gray-800"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-700">
                <Button
                  onClick={() => {
                    window.open('https://discord.gg/b4f8WZy4R8', '_blank');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-primary"
                >
                  Discord
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}