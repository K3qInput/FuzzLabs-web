import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/modals/auth-modal";
import { CartModal } from "@/components/modals/cart-modal";
import { 
  Menu, 
  ShoppingCart, 
  User, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Shield,
  Box
} from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { items, getTotalItems } = useCart();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Team", href: "/team" },
    { name: "Partners", href: "/partners" },
    { name: "Contact", href: "/contact" },
  ];

  const authenticatedNavigation = [
    ...navigation,
    { name: "Dashboard", href: "/dashboard" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const currentNav = isAuthenticated ? authenticatedNavigation : navigation;
  const totalItems = getTotalItems();

  return (
    <>
      <header className="bg-black/80 backdrop-blur-sm py-4 px-6 sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Box className="text-3xl text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text" />
            <span className="text-2xl font-bold text-white">Fuzz Labs</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {currentNav.map((item) => (
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
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                className={`nav-link text-gray-300 transition-colors ${
                  isActive("/admin") ? "active-link" : ""
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartModalOpen(true)}
              className="relative text-gray-300 hover:text-green-400"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs cart-badge show"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-8 h-8 animate-spin border-2 border-green-400 border-t-transparent rounded-full" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl} alt={user.firstName} />
                      <AvatarFallback className="bg-green-400 text-black">
                        {user.firstName?.[0] || user.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-300">
                      {user.firstName || user.email?.split("@")[0] || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => setAuthModalOpen(true)}
                className="btn-secondary"
              >
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
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
                {currentNav.map((item) => (
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
                {isAuthenticated && user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className={`text-white py-2 px-4 rounded transition-colors ${
                      isActive("/admin") ? "bg-green-400 text-black" : "hover:bg-gray-800"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                
                <div className="pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => {
                      setCartModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mb-4 btn-secondary"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart ({totalItems})
                  </Button>

                  {!isAuthenticated ? (
                    <Button 
                      onClick={() => {
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full btn-primary"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleLogout}
                      variant="destructive"
                      className="w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <CartModal open={cartModalOpen} onOpenChange={setCartModalOpen} />
    </>
  );
}
