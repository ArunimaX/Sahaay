import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { mockPrograms } from "@/lib/mock-data";
import { 
  Plus, 
  Users, 
  TrendingUp, 
  DollarSign,
  Clock,
  Star,
  Heart,
  Building,
  Settings
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/onboarding");
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  // NGO Dashboard
  if (user.role === "ngo") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-hope-green text-white py-12" data-testid="ngo-dashboard-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">NGO Dashboard</h1>
                <p className="text-green-100 mt-2" data-testid="text-dashboard-subtitle">
                  Manage your organization's impact programs
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" data-testid="text-organization-name">
                  {user.organization || "Hope Foundation"}
                </div>
                <div className="text-green-100" data-testid="text-organization-details">
                  Since 2018 • 15,247 Lives Impacted
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="action-create-program">
              <CardContent className="p-4">
                <Plus className="h-8 w-8 text-hope-green mb-2" />
                <div className="font-semibold">Create Program</div>
                <div className="text-sm text-gray-600">Launch new initiative</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="action-manage-volunteers">
              <CardContent className="p-4">
                <Users className="h-8 w-8 text-trust-blue mb-2" />
                <div className="font-semibold">Manage Volunteers</div>
                <div className="text-sm text-gray-600">Coordinate team</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="action-view-analytics">
              <CardContent className="p-4">
                <TrendingUp className="h-8 w-8 text-optimism-gold mb-2" />
                <div className="font-semibold">View Analytics</div>
                <div className="text-sm text-gray-600">Track progress</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="action-funding-status">
              <CardContent className="p-4">
                <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
                <div className="font-semibold">Funding Status</div>
                <div className="text-sm text-gray-600">Monitor resources</div>
              </CardContent>
            </Card>
          </div>

          {/* Active Programs */}
          <Card className="shadow-lg mb-8" data-testid="card-active-programs">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Active Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {mockPrograms.map((program) => (
                  <Card key={program.id} className="border border-gray-200" data-testid={`program-${program.id}`}>
                    <CardContent className="p-4">
                      <CardTitle className="font-semibold text-gray-900 mb-2" data-testid={`program-title-${program.id}`}>
                        {program.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-3" data-testid={`program-details-${program.id}`}>
                        {program.beneficiaries} {program.type === "education" ? "students" : "beneficiaries"} • {program.locations} {program.type === "education" ? "schools" : "centers"}
                      </CardDescription>
                      <Progress value={program.progress} className="mb-2" />
                      <div className="text-sm text-gray-600" data-testid={`program-progress-${program.id}`}>
                        {program.progress}% Complete
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity & Analytics */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-lg" data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3" data-testid="activity-volunteer-joined">
                    <div className="w-2 h-2 bg-hope-green rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">New volunteer joined Rural Education</div>
                      <div className="text-xs text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3" data-testid="activity-meal-distribution">
                    <div className="w-2 h-2 bg-trust-blue rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Meal distribution completed in Sector 7</div>
                      <div className="text-xs text-gray-500">5 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3" data-testid="activity-report-generated">
                    <div className="w-2 h-2 bg-optimism-gold rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Monthly report generated</div>
                      <div className="text-xs text-gray-500">1 day ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg" data-testid="card-key-metrics">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center" data-testid="metric-beneficiaries">
                    <div className="text-2xl font-bold text-hope-green">2,847</div>
                    <div className="text-sm text-gray-600">Beneficiaries</div>
                  </div>
                  <div className="text-center" data-testid="metric-program-success">
                    <div className="text-2xl font-bold text-trust-blue">89%</div>
                    <div className="text-sm text-gray-600">Program Success</div>
                  </div>
                  <div className="text-center" data-testid="metric-active-volunteers">
                    <div className="text-2xl font-bold text-optimism-gold">47</div>
                    <div className="text-sm text-gray-600">Active Volunteers</div>
                  </div>
                  <div className="text-center" data-testid="metric-funds-utilized">
                    <div className="text-2xl font-bold text-purple-600">₹12.4L</div>
                    <div className="text-sm text-gray-600">Funds Utilized</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Volunteer Dashboard
  if (user.role === "volunteer") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-trust-blue text-white py-12" data-testid="volunteer-dashboard-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-volunteer-dashboard-title">Volunteer Dashboard</h1>
                <p className="text-blue-100 mt-2" data-testid="text-volunteer-dashboard-subtitle">
                  Track your volunteer journey and impact
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" data-testid="text-volunteer-name">{user.name}</div>
                <div className="text-blue-100" data-testid="text-volunteer-details">
                  Volunteer since {user.joinedDate.toLocaleDateString()} • 247 hours contributed
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Volunteer Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center shadow-md" data-testid="stat-hours-volunteered">
              <CardContent className="p-6">
                <div className="text-3xl text-trust-blue mb-2"><Clock className="h-8 w-8 mx-auto" /></div>
                <div className="text-2xl font-bold text-gray-900">247</div>
                <div className="text-sm text-gray-600">Hours Volunteered</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md" data-testid="stat-lives-impacted">
              <CardContent className="p-6">
                <div className="text-3xl text-hope-green mb-2"><Heart className="h-8 w-8 mx-auto" /></div>
                <div className="text-2xl font-bold text-gray-900">1,847</div>
                <div className="text-sm text-gray-600">Lives Impacted</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md" data-testid="stat-programs-completed">
              <CardContent className="p-6">
                <div className="text-3xl text-optimism-gold mb-2"><TrendingUp className="h-8 w-8 mx-auto" /></div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">Programs Completed</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md" data-testid="stat-impact-rating">
              <CardContent className="p-6">
                <div className="text-3xl text-purple-600 mb-2"><Star className="h-8 w-8 mx-auto" /></div>
                <div className="text-2xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-600">Impact Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Active Assignments & Available Opportunities */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Active Assignments */}
            <Card className="shadow-lg" data-testid="card-active-assignments">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Active Assignments</CardTitle>
                  <Button variant="link" className="text-trust-blue hover:text-blue-700 text-sm font-semibold p-0" data-testid="button-view-all-assignments">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card className="border border-gray-200" data-testid="assignment-teaching">
                    <CardContent className="p-4">
                      <CardTitle className="font-semibold text-gray-900 mb-2">Teaching Assistant - Sunrise School</CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-2">Mathematics • Grade 5 • 2 hours/week</CardDescription>
                      <div className="flex items-center space-x-2 text-xs">
                        <Badge className="bg-hope-green text-white">In Progress</Badge>
                        <span className="text-gray-500">Next session: Tomorrow 10 AM</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200" data-testid="assignment-meal-distribution">
                    <CardContent className="p-4">
                      <CardTitle className="font-semibold text-gray-900 mb-2">Meal Distribution Volunteer</CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-2">Community Center B • Weekend shifts</CardDescription>
                      <div className="flex items-center space-x-2 text-xs">
                        <Badge className="bg-trust-blue text-white">Scheduled</Badge>
                        <span className="text-gray-500">Next shift: Saturday 9 AM</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Available Opportunities */}
            <Card className="shadow-lg" data-testid="card-recommended-opportunities">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Recommended for You</CardTitle>
                  <Button variant="link" className="text-trust-blue hover:text-blue-700 text-sm font-semibold p-0" data-testid="button-browse-all-opportunities">
                    Browse All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card className="border border-gray-200 hover:border-trust-blue cursor-pointer transition-colors" data-testid="opportunity-digital-literacy">
                    <CardContent className="p-4">
                      <CardTitle className="font-semibold text-gray-900 mb-2">Digital Literacy Trainer</CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-2">Adult Education Center • 3 hours/week</CardDescription>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-hope-green border-hope-green">95% match</Badge>
                        <Button variant="link" className="text-trust-blue hover:text-blue-700 text-sm font-semibold p-0" data-testid="button-apply-digital-literacy">
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 hover:border-trust-blue cursor-pointer transition-colors" data-testid="opportunity-community-garden">
                    <CardContent className="p-4">
                      <CardTitle className="font-semibold text-gray-900 mb-2">Community Garden Helper</CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-2">Urban Farming Initiative • Flexible schedule</CardDescription>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-optimism-gold border-optimism-gold">87% match</Badge>
                        <Button variant="link" className="text-trust-blue hover:text-blue-700 text-sm font-semibold p-0" data-testid="button-apply-community-garden">
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Generic Dashboard for Other Roles
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12" data-testid="generic-dashboard-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold capitalize" data-testid="text-generic-dashboard-title">
              {user.role} Dashboard
            </h1>
            <p className="text-purple-100 mt-2" data-testid="text-generic-dashboard-subtitle">
              Welcome to your personalized Sahaay experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg text-center" data-testid="card-coming-soon">
          <CardContent className="p-8">
            <div className="text-4xl text-purple-600 mb-4">
              <Settings className="h-16 w-16 mx-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Dashboard Coming Soon</CardTitle>
            <CardDescription className="text-lg text-gray-600 mb-6">
              We're building a personalized experience for your role. Stay tuned!
            </CardDescription>
            <Button 
              onClick={() => setLocation("/")} 
              className="bg-purple-600 text-white hover:bg-purple-700" 
              data-testid="button-return-home"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
