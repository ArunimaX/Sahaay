import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  BookOpen, 
  School, 
  Users, 
  Percent, 
  Building, 
  Utensils,
  Plus,
  TrendingUp,
  BookOpenCheck,
  Package
} from "lucide-react";
import { mockSchoolData } from "@/lib/mock-data";

export default function EduBridge() {
  const subjectPerformance = [
    { subject: "Mathematics", score: 78, color: "bg-hope-green" },
    { subject: "Language", score: 85, color: "bg-trust-blue" },
    { subject: "Science", score: 72, color: "bg-optimism-gold" },
  ];

  const resources = [
    {
      id: "digital-library",
      title: "Digital Library", 
      description: "Access thousands of educational resources, e-books, and multimedia content",
      count: "5,247 Resources Available",
      icon: BookOpen,
      color: "trust-blue",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      id: "learning-kits",
      title: "Learning Kits",
      description: "Physical learning materials and supplies distributed to schools and students", 
      count: "1,847 Kits Distributed",
      icon: Package,
      color: "hope-green",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      id: "teacher-training",
      title: "Teacher Training",
      description: "Professional development programs and training modules for educators",
      count: "342 Teachers Trained", 
      icon: GraduationCap,
      color: "purple-600",
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-optimism-gold to-yellow-600 text-white py-16" data-testid="edubridge-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-edubridge-title">EduBridge</h1>
            <p className="text-xl md:text-2xl mb-8" data-testid="text-edubridge-subtitle">
              Educational Resource Management & Progress Tracking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-optimism-gold px-6 py-3 font-semibold hover:bg-gray-100" data-testid="button-track-progress">
                <School className="mr-2 h-5 w-5" />
                Track School Progress
              </Button>
              <Button className="bg-yellow-700 text-white px-6 py-3 font-semibold hover:bg-yellow-800" data-testid="button-access-resources">
                <BookOpen className="mr-2 h-5 w-5" />
                Access Resources
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* School Dashboard Overview */}
      <section className="py-12" data-testid="dashboard-overview-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-dashboard-title">
              School Performance Dashboard
            </h2>
            <p className="text-lg text-gray-600" data-testid="text-dashboard-subtitle">
              Comprehensive tracking of educational outcomes and resource distribution
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center shadow-md" data-testid="metric-students-enrolled">
              <CardContent className="p-6">
                <div className="text-3xl text-optimism-gold mb-2">
                  <Users className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">12,847</div>
                <div className="text-sm text-gray-600">Students Enrolled</div>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-md" data-testid="metric-attendance-rate">
              <CardContent className="p-6">
                <div className="text-3xl text-hope-green mb-2">
                  <Percent className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">89.2%</div>
                <div className="text-sm text-gray-600">Attendance Rate</div>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-md" data-testid="metric-partner-schools">
              <CardContent className="p-6">
                <div className="text-3xl text-trust-blue mb-2">
                  <School className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">247</div>
                <div className="text-sm text-gray-600">Partner Schools</div>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-md" data-testid="metric-meals-served">
              <CardContent className="p-6">
                <div className="text-3xl text-purple-600 mb-2">
                  <Utensils className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">98,534</div>
                <div className="text-sm text-gray-600">Meals Served</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Attendance Tracking */}
            <Card className="shadow-lg" data-testid="card-attendance-analytics">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Attendance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mock chart area */}
                <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-trust-blue mb-4 mx-auto opacity-60" />
                    <p className="text-gray-600 font-semibold">Weekly attendance trends</p>
                    <p className="text-sm text-gray-500">Interactive chart showing attendance patterns</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div data-testid="attendance-this-week">
                    <div className="text-lg font-bold text-hope-green">92%</div>
                    <div className="text-xs text-gray-600">This Week</div>
                  </div>
                  <div data-testid="attendance-last-week">
                    <div className="text-lg font-bold text-optimism-gold">87%</div>
                    <div className="text-xs text-gray-600">Last Week</div>
                  </div>
                  <div data-testid="attendance-average">
                    <div className="text-lg font-bold text-trust-blue">89%</div>
                    <div className="text-xs text-gray-600">Average</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Outcomes */}
            <Card className="shadow-lg" data-testid="card-learning-outcomes">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Learning Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mock chart area */}
                <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <GraduationCap className="h-16 w-16 text-purple-600 mb-4 mx-auto opacity-60" />
                    <p className="text-gray-600 font-semibold">Subject-wise performance</p>
                    <p className="text-sm text-gray-500">Track student progress across subjects</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {subjectPerformance.map((subject) => (
                    <div key={subject.subject} className="space-y-1" data-testid={`subject-${subject.subject.toLowerCase()}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{subject.subject}</span>
                        <span className="text-sm font-semibold">{subject.score}%</span>
                      </div>
                      <Progress value={subject.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resource Management */}
      <section className="py-12 bg-white" data-testid="resource-management-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-resources-title">
              Educational Resources
            </h2>
            <p className="text-lg text-gray-600" data-testid="text-resources-subtitle">
              Manage and distribute learning materials effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Card 
                  key={resource.id}
                  className={`cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-${resource.color}/10 to-${resource.color}/5 border border-${resource.color}/20`}
                  data-testid={`card-${resource.id}`}
                >
                  <CardContent className="p-6">
                    <img 
                      src={resource.image} 
                      alt={resource.title} 
                      className="w-full h-32 object-cover rounded-lg mb-4"
                      data-testid={`img-${resource.id}`}
                    />
                    <div className={`text-3xl text-${resource.color} mb-4`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-3" data-testid={`title-${resource.id}`}>
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm mb-4" data-testid={`description-${resource.id}`}>
                      {resource.description}
                    </CardDescription>
                    <div className={`text-${resource.color} font-semibold`} data-testid={`count-${resource.id}`}>
                      {resource.count}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* School Meal Tracking */}
      <section className="py-12" data-testid="meal-tracking-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg" data-testid="card-meal-tracking">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900" data-testid="text-meal-tracking-title">
                    Mid-Day Meal Program Tracking
                  </CardTitle>
                  <CardDescription data-testid="text-meal-tracking-subtitle">
                    Monitor nutrition programs and meal distribution across schools
                  </CardDescription>
                </div>
                <Button className="bg-optimism-gold text-white hover:bg-yellow-600" data-testid="button-add-meal-record">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Meal Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center" data-testid="meal-stat-today">
                  <div className="text-3xl font-bold text-hope-green">8,456</div>
                  <div className="text-sm text-gray-600">Meals Today</div>
                </div>
                <div className="text-center" data-testid="meal-stat-coverage">
                  <div className="text-3xl font-bold text-trust-blue">94.2%</div>
                  <div className="text-sm text-gray-600">Coverage Rate</div>
                </div>
                <div className="text-center" data-testid="meal-stat-cost">
                  <div className="text-3xl font-bold text-optimism-gold">₹125</div>
                  <div className="text-sm text-gray-600">Cost per Meal</div>
                </div>
                <div className="text-center" data-testid="meal-stat-schools">
                  <div className="text-3xl font-bold text-purple-600">247</div>
                  <div className="text-sm text-gray-600">Active Schools</div>
                </div>
              </div>

              {/* Recent Meal Records */}
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="meal-records-table">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">School</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Meals Served</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Attendance</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockSchoolData.map((school, index) => (
                      <tr key={index} data-testid={`school-row-${index}`}>
                        <td className="py-3 px-4" data-testid={`school-name-${index}`}>{school.name}</td>
                        <td className="py-3 px-4" data-testid={`school-date-${index}`}>Today</td>
                        <td className="py-3 px-4" data-testid={`school-meals-${index}`}>{school.mealsServed}</td>
                        <td className="py-3 px-4" data-testid={`school-attendance-${index}`}>
                          {school.attendance} ({school.attendanceRate}%)
                        </td>
                        <td className="py-3 px-4" data-testid={`school-status-${index}`}>
                          <Badge 
                            className={school.status === "complete" ? "bg-hope-green text-white" : "bg-optimism-gold text-white"}
                          >
                            {school.status === "complete" ? "Complete" : "Partial"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
