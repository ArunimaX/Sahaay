import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Handshake, 
  Search,
  Clock,
  TrendingUp,
  MapPin,
  Users,
  Calendar,
  Building,
  DollarSign,
  Laptop
} from "lucide-react";
import { mockOpportunities } from "@/lib/mock-data";

export default function EmpowerBridge() {
  const [selectedSkills, setSelectedSkills] = useState(["Teaching"]);
  const skills = ["Teaching", "Cooking", "Healthcare", "Technology", "Administration", "Marketing"];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-trust-blue to-blue-600 text-white py-16" data-testid="empowerbridge-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-empowerbridge-title">EmpowerBridge</h1>
            <p className="text-xl md:text-2xl mb-8" data-testid="text-empowerbridge-subtitle">
              Volunteer Matching & Partnership Coordination Platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-trust-blue px-6 py-3 font-semibold hover:bg-gray-100" data-testid="button-join-volunteer">
                <UserPlus className="mr-2 h-5 w-5" />
                Join as Volunteer
              </Button>
              <Button className="bg-blue-700 text-white px-6 py-3 font-semibold hover:bg-blue-800" data-testid="button-find-partners">
                <Handshake className="mr-2 h-5 w-5" />
                Find Partners
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Matchmaking */}
      <section className="py-12" data-testid="volunteer-matching-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" data-testid="text-matching-title">
                Smart Volunteer Matching
              </h2>
              <p className="text-lg text-gray-600 mb-6" data-testid="text-matching-description">
                Our AI-powered system connects volunteers with opportunities that match their skills, interests, and availability.
              </p>
              
              {/* Search Interface */}
              <Card className="shadow-lg" data-testid="volunteer-search-form">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Find Volunteer Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge 
                          key={skill}
                          variant={selectedSkills.includes(skill) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            selectedSkills.includes(skill) 
                              ? "bg-trust-blue text-white" 
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => toggleSkill(skill)}
                          data-testid={`skill-${skill.toLowerCase()}`}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</Label>
                    <Input 
                      id="location"
                      type="text" 
                      placeholder="Enter your city" 
                      className="w-full"
                      data-testid="input-location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">Availability</Label>
                    <Select>
                      <SelectTrigger data-testid="select-availability">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekends">Weekends only</SelectItem>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-trust-blue text-white hover:bg-blue-700" data-testid="button-find-matches">
                    <Search className="mr-2 h-5 w-5" />
                    Find Matches
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              <img 
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Diverse group of volunteers working together" 
                className="w-full rounded-2xl shadow-lg"
                data-testid="img-volunteer-network"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-12 bg-white" data-testid="partnership-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-partnership-title">
              Partnership Opportunities
            </h2>
            <p className="text-lg text-gray-600" data-testid="text-partnership-subtitle">
              Connect with organizations and create powerful collaborations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Active Partnerships */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200" data-testid="card-active-partnerships">
              <CardContent className="p-6">
                <div className="text-2xl text-hope-green mb-4">
                  <Handshake className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Active Partnerships</CardTitle>
                <div className="text-3xl font-bold text-hope-green mb-2" data-testid="stat-active-partnerships">127</div>
                <CardDescription className="text-green-700 text-sm">Organizations collaborating</CardDescription>
              </CardContent>
            </Card>

            {/* Pending Matches */}
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200" data-testid="card-pending-matches">
              <CardContent className="p-6">
                <div className="text-2xl text-optimism-gold mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Pending Matches</CardTitle>
                <div className="text-3xl font-bold text-optimism-gold mb-2" data-testid="stat-pending-matches">43</div>
                <CardDescription className="text-yellow-700 text-sm">Awaiting connection</CardDescription>
              </CardContent>
            </Card>

            {/* Success Rate */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200" data-testid="card-success-rate">
              <CardContent className="p-6">
                <div className="text-2xl text-trust-blue mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Success Rate</CardTitle>
                <div className="text-3xl font-bold text-trust-blue mb-2" data-testid="stat-success-rate">89%</div>
                <CardDescription className="text-blue-700 text-sm">Successful partnerships</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-12" data-testid="featured-opportunities-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8" data-testid="text-opportunities-title">
            Featured Opportunities
          </h2>
          
          <div className="space-y-6">
            {mockOpportunities.map((opportunity) => {
              const getTypeColor = (type: string) => {
                switch (type) {
                  case "education": return "bg-blue-100 text-blue-800";
                  case "nutrition": return "bg-green-100 text-green-800";
                  case "technology": return "bg-purple-100 text-purple-800";
                  default: return "bg-gray-100 text-gray-800";
                }
              };

              const getUrgencyBadge = () => {
                if (opportunity.urgent) return <Badge className="bg-hope-green text-white">URGENT</Badge>;
                if (opportunity.partnership) return <Badge className="bg-optimism-gold text-white">PARTNERSHIP</Badge>;
                if (opportunity.skillBased) return <Badge className="bg-purple-500 text-white">SKILL-BASED</Badge>;
                return null;
              };

              const getActionButton = () => {
                if (opportunity.partnership) {
                  return (
                    <Button className="bg-optimism-gold text-white hover:bg-yellow-600" data-testid={`button-partner-${opportunity.id}`}>
                      Partner Up
                    </Button>
                  );
                } else if (opportunity.skillBased) {
                  return (
                    <Button className="bg-purple-600 text-white hover:bg-purple-700" data-testid={`button-contribute-${opportunity.id}`}>
                      Contribute
                    </Button>
                  );
                } else {
                  return (
                    <Button className="bg-trust-blue text-white hover:bg-blue-700" data-testid={`button-apply-${opportunity.id}`}>
                      Apply Now
                    </Button>
                  );
                }
              };

              return (
                <Card key={opportunity.id} className="shadow-md hover:shadow-lg transition-shadow" data-testid={`opportunity-${opportunity.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {getUrgencyBadge()}
                          <Badge variant="outline" className={`ml-2 ${getTypeColor(opportunity.type)}`}>
                            {opportunity.type.toUpperCase()}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2" data-testid={`opportunity-title-${opportunity.id}`}>
                          {opportunity.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 mb-3" data-testid={`opportunity-description-${opportunity.id}`}>
                          {opportunity.description}
                        </CardDescription>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center" data-testid={`opportunity-location-${opportunity.id}`}>
                            <MapPin className="mr-1 h-4 w-4" />
                            {opportunity.location}
                          </span>
                          {opportunity.volunteers_needed && (
                            <span className="flex items-center" data-testid={`opportunity-volunteers-${opportunity.id}`}>
                              <Users className="mr-1 h-4 w-4" />
                              {opportunity.volunteers_needed} volunteers needed
                            </span>
                          )}
                          {opportunity.budget && (
                            <span className="flex items-center" data-testid={`opportunity-budget-${opportunity.id}`}>
                              <DollarSign className="mr-1 h-4 w-4" />
                              ${opportunity.budget.toLocaleString()} budget
                            </span>
                          )}
                          <span className="flex items-center" data-testid={`opportunity-commitment-${opportunity.id}`}>
                            <Calendar className="mr-1 h-4 w-4" />
                            {opportunity.commitment}
                          </span>
                        </div>
                      </div>
                      {getActionButton()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
