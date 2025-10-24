import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronDown, HandHeart, TrendingUp } from "lucide-react";

export function HeroSection() {
  const scrollToThreePillars = () => {
    const element = document.getElementById('three-pillars');
    if (element) {
      const navHeight = 80; // Navigation bar height (h-20 = 80px)
      const additionalOffset = 40; // Extra padding for better visibility
      const elementPosition = element.offsetTop - navHeight - additionalOffset;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };
  return (
    <section className="relative bg-gradient-to-br from-trust-blue via-hope-green to-optimism-gold min-h-screen flex items-center">
      {/* Background overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Hero background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
            Together We Can End Poverty, Hunger & Education Gaps
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed" data-testid="text-hero-subtitle">
            A unified digital platform fostering collaboration, data sharing, and citizen engagement to effectively support underserved communities worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={scrollToThreePillars}
              className="bg-hope-green hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105"
              data-testid="button-start-impact"
            >
              <HandHeart className="mr-2 h-5 w-5" />
              Start Making Impact
            </Button>
            <Link href="/impact" data-testid="button-view-impact">
              <Button
                variant="outline"
                className="bg-white/20 hover:bg-white/30 backdrop-blur text-white border-2 border-white px-8 py-4 text-lg font-semibold transition-all"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                View Impact Data
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce text-white text-2xl">
          <ChevronDown />
        </div>
      </div>
    </section>
  );
}
