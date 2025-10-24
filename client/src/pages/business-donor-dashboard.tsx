import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { 
  Building, 
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Award,
  Calendar,
  MapPin,
  Handshake,
  BarChart3,
  Globe,
  Star,
  Package,
  Heart,
  Briefcase
} from "lucide-react";

export default function BusinessDonorDashboard() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/feed-connect");
      return;
    }
    if (user.role !== "businessDonor") {
      setLocation("/dashboard");
      return;
    }
  }, [user, setLocation]);

  if (!user || user.role !== "businessDonor") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Business Donor Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12" data-testid="business-donor-dashboard-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-business-donor-dashboard-title">Business Donor Dashboard</h1>
              <p className="text-blue-100 mt-2" data-testid="text-business-donor-dashboard-subtitle">
                Corporate Social Responsibility & Strategic Partnerships
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" data-testid="text-business-donor-name">
                {user.name}
              </div>
              <div className="text-blue-100" data-testid="text-business-donor-role">
                Business Partner • Strategic Impact
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Corporate Impact Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center shadow-md" data-testid="stat-corporate-donations">
            <CardContent className="p-6">
              <div className="text-3xl text-blue-600 mb-2"><DollarSign className="h-8 w-8 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-900">₹2.4M</div>
              <div className="text-sm text-gray-600">Total Corporate Donations</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md" data-testid="stat-partnerships">
            <CardContent className="p-6">
              <div className="text-3xl text-green-600 mb-2"><Handshake className="h-8 w-8 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Active Partnerships</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md" data-testid="stat-lives-impacted">
            <CardContent className="p-6">
              <div className="text-3xl text-purple-600 mb-2"><Heart className="h-8 w-8 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-900">15,247</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md" data-testid="stat-csr-score">
            <CardContent className="p-6">
              <div className="text-3xl text-orange-600 mb-2"><Star className="h-8 w-8 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-900">A+</div>
              <div className="text-sm text-gray-600">CSR Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Partnerships & Programs */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Strategic Partnerships */}
          <Card className="shadow-lg" data-testid="card-strategic-partnerships">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Handshake className="h-5 w-5 mr-2" />
                Strategic Partnerships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg" data-testid="partnership-techcorp">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">TechCorp Inc.</h3>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Quarterly food drive partnership</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>₹500K / ₹1M</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div className="text-xs text-gray-500">Next milestone: March 2024</div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg" data-testid="partnership-manufacturing">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Manufacturing Solutions Ltd.</h3>
                    <Badge className="bg-blue-500 text-white">Planning</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Annual CSR initiative for rural development</p>
                  <div className="text-xs text-gray-500">Partnership starts: April 2024</div>
                </div>

                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" data-testid="button-explore-partnerships">
                  Explore New Partnerships
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Corporate Programs */}
          <Card className="shadow-lg" data-testid="card-corporate-programs">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Corporate Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg" data-testid="program-employee-volunteering">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Employee Volunteering</h3>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Monthly community service initiatives</p>
                  <div className="flex justify-between text-sm">
                    <span>Participants: 45</span>
                    <span>Hours: 180</span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg" data-testid="program-skill-development">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Skill Development</h3>
                    <Badge className="bg-yellow-500 text-white">In Progress</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Digital literacy training for youth</p>
                  <div className="flex justify-between text-sm">
                    <span>Beneficiaries: 120</span>
                    <span>Completion: 75%</span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg" data-testid="program-sustainable-agriculture">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">Sustainable Agriculture</h3>
                    <Badge className="bg-purple-500 text-white">Planning</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Supporting local farming communities</p>
                  <div className="text-xs text-gray-500">Launch: Q2 2024</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Analytics & Recent Activities */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Impact Analytics */}
          <Card className="shadow-lg" data-testid="card-impact-analytics">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Impact Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg" data-testid="analytics-meals">
                    <div className="text-lg font-bold text-blue-600">45,892</div>
                    <div className="text-sm text-gray-600">Meals Provided</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg" data-testid="analytics-families">
                    <div className="text-lg font-bold text-green-600">2,847</div>
                    <div className="text-sm text-gray-600">Families Supported</div>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg" data-testid="analytics-summary">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 mb-1">₹2.4M Impact Generated</div>
                    <div className="text-sm text-gray-600">Through strategic partnerships and programs</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Education Programs</span>
                    <span className="font-semibold">₹800K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Food Security</span>
                    <span className="font-semibold">₹1.2M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Healthcare</span>
                    <span className="font-semibold">₹400K</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" data-testid="button-view-detailed-analytics">
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Corporate Activities */}
          <Card className="shadow-lg" data-testid="card-corporate-activities">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">Recent Corporate Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3" data-testid="activity-partnership-signed">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">New partnership signed with TechCorp Inc.</div>
                    <div className="text-xs text-gray-500">₹1M commitment over 12 months</div>
                    <div className="text-xs text-gray-500">2 days ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3" data-testid="activity-employee-volunteering">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Employee volunteering day completed</div>
                    <div className="text-xs text-gray-500">45 employees, 180 hours contributed</div>
                    <div className="text-xs text-gray-500">1 week ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3" data-testid="activity-csr-award">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Received CSR Excellence Award</div>
                    <div className="text-xs text-gray-500">Category: Large Enterprise</div>
                    <div className="text-xs text-gray-500">2 weeks ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3" data-testid="activity-skill-program">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Skill development program launched</div>
                    <div className="text-xs text-gray-500">120 youth enrolled in digital literacy</div>
                    <div className="text-xs text-gray-500">3 weeks ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
