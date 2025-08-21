import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAppStore } from "@/lib/store";
import logoPath from "@assets/00004_1755739132526.png";

export function Navigation() {
  const [location] = useLocation();
  const { user, showMobileMenu, setShowMobileMenu } = useAppStore();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/feed-connect", label: "FeedConnect", color: "hope-green" },
    { path: "/empower-bridge", label: "EmpowerBridge", color: "trust-blue" },
    { path: "/edu-bridge", label: "EduBridge", color: "optimism-gold" },
    { path: "/impact", label: "Impact", color: "gray-700" },
  ];

  if (location === "/onboarding") return null;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50" data-testid="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center cursor-pointer">
              <img src={logoPath} alt="Sahaay Logo" className="h-8 w-auto" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path} data-testid={`link-${item.label.toLowerCase()}`}>
                  <span className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer hover:text-${item.color} ${
                    isActive(item.path) ? `text-${item.color}` : "text-gray-700"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <Link href="/onboarding" data-testid="button-get-started">
                <Button className="bg-trust-blue hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard" data-testid="button-dashboard">
                <Button className="bg-hope-green hover:bg-green-700 text-white">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path} data-testid={`mobile-link-${item.label.toLowerCase()}`}>
                    <span
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
                {!user ? (
                  <Link href="/onboarding" data-testid="mobile-button-get-started">
                    <Button 
                      className="w-full bg-trust-blue hover:bg-blue-700 text-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Get Started
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard" data-testid="mobile-button-dashboard">
                    <Button 
                      className="w-full bg-hope-green hover:bg-green-700 text-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
