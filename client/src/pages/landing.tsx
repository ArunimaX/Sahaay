import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building, GraduationCap, Users, Utensils } from "lucide-react";
import { Link } from "wouter";
import { globalImpactStats } from "@/lib/mock-data";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Platform Overview */}
      <section className="py-20 bg-white" data-testid="section-platform-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="text-pillars-title">
              Three Pillars of Change
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-pillars-subtitle">
              Our comprehensive platform addresses the interconnected challenges of poverty, hunger, and education through targeted solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* FeedConnect */}
            <Link href="/feed-connect" data-testid="card-feedconnect">
              <Card className="group cursor-pointer bg-gradient-to-br from-hope-green/10 to-hope-green/5 p-8 border border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                    alt="Children receiving nutritious meals" 
                    className="w-full h-48 object-cover rounded-xl mb-6"
                    data-testid="img-feedconnect"
                  />
                  <div className="text-4xl text-hope-green mb-4">
                    <Utensils />
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-4">FeedConnect</CardTitle>
                    <CardDescription className="text-gray-600 mb-6">
                      Combat hunger through intelligent food distribution mapping, real-time need reporting, and coordinated meal programs for vulnerable communities.
                    </CardDescription>
                  </CardHeader>
                  <div className="flex items-center text-hope-green font-semibold group-hover:translate-x-2 transition-transform">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Card>
            </Link>

            {/* EmpowerBridge */}
            <Link href="/empower-bridge" data-testid="card-empowerbridge">
              <Card className="group cursor-pointer bg-gradient-to-br from-trust-blue/10 to-trust-blue/5 p-8 border border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                    alt="Community volunteers collaborating" 
                    className="w-full h-48 object-cover rounded-xl mb-6"
                    data-testid="img-empowerbridge"
                  />
                  <div className="text-4xl text-trust-blue mb-4">
                    <Users />
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-4">EmpowerBridge</CardTitle>
                    <CardDescription className="text-gray-600 mb-6">
                      Connect volunteers, donors, and organizations through smart matchmaking, resource coordination, and collaborative poverty alleviation efforts.
                    </CardDescription>
                  </CardHeader>
                  <div className="flex items-center text-trust-blue font-semibold group-hover:translate-x-2 transition-transform">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Card>
            </Link>

            {/* EduBridge */}
            <Link href="/edu-bridge" data-testid="card-edubridge">
              <Card className="group cursor-pointer bg-gradient-to-br from-optimism-gold/10 to-optimism-gold/5 p-8 border border-yellow-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                    alt="Rural classroom education" 
                    className="w-full h-48 object-cover rounded-xl mb-6"
                    data-testid="img-edubridge"
                  />
                  <div className="text-4xl text-optimism-gold mb-4">
                    <GraduationCap />
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-4">EduBridge</CardTitle>
                    <CardDescription className="text-gray-600 mb-6">
                      Bridge education gaps through attendance tracking, learning resource distribution, and comprehensive educational outcome monitoring.
                    </CardDescription>
                  </CardHeader>
                  <div className="flex items-center text-optimism-gold font-semibold group-hover:translate-x-2 transition-transform">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gray-900 text-white" data-testid="section-impact-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-impact-title">Global Impact So Far</h2>
            <p className="text-xl text-gray-300" data-testid="text-impact-subtitle">Real numbers from our collaborative efforts worldwide</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="stat-meals">
              <div className="text-4xl md:text-5xl font-bold text-hope-green mb-2">
                {(globalImpactStats.mealsDistributed / 1000000).toFixed(1)}M+
              </div>
              <div className="text-gray-300">Meals Distributed</div>
            </div>
            <div className="text-center" data-testid="stat-students">
              <div className="text-4xl md:text-5xl font-bold text-trust-blue mb-2">
                {(globalImpactStats.studentsEducated / 1000).toFixed(0)}K+
              </div>
              <div className="text-gray-300">Children Educated</div>
            </div>
            <div className="text-center" data-testid="stat-communities">
              <div className="text-4xl md:text-5xl font-bold text-optimism-gold mb-2">850+</div>
              <div className="text-gray-300">Communities Served</div>
            </div>
            <div className="text-center" data-testid="stat-volunteers">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                {(globalImpactStats.activeVolunteers / 1000).toFixed(0)}K+
              </div>
              <div className="text-gray-300">Active Volunteers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-hope-green to-trust-blue" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" data-testid="text-cta-title">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8" data-testid="text-cta-subtitle">
            Join thousands of changemakers using Sahaay to create lasting impact in their communities
          </p>
          <Link href="/onboarding" data-testid="button-start-journey">
            <Button className="bg-white text-trust-blue px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
              <Building className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
