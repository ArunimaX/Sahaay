import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Share, 
  Utensils, 
  GraduationCap, 
  Home, 
  Users,
  TrendingUp,
  Globe,
  BarChart3,
  FileText
} from "lucide-react";
import { globalImpactStats } from "@/lib/mock-data";

export default function ImpactDashboard() {
  const programImpacts = [
    {
      name: "FeedConnect Impact",
      icon: Utensils,
      color: "hope-green",
      stats: [
        { label: "Daily Meals", value: "47,832", color: "hope-green" },
        { label: "Active Centers", value: "342", color: "hope-green" },
        { label: "Coverage Areas", value: "1,247", color: "hope-green" },
        { label: "Cost Efficiency", value: "₹38/meal", color: "hope-green" },
      ],
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      name: "EmpowerBridge Impact", 
      icon: Users,
      color: "trust-blue",
      stats: [
        { label: "Volunteer Matches", value: "12,847", color: "trust-blue" },
        { label: "Active Partnerships", value: "689", color: "trust-blue" },
        { label: "Volunteer Hours", value: "247K", color: "trust-blue" },
        { label: "Success Rate", value: "89.2%", color: "trust-blue" },
      ],
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      name: "EduBridge Impact",
      icon: GraduationCap,
      color: "optimism-gold",
      stats: [
        { label: "Students Enrolled", value: "156,743", color: "optimism-gold" },
        { label: "Learning Resources", value: "89,432", color: "optimism-gold" },
        { label: "Teacher Training", value: "3,247", color: "optimism-gold" },
        { label: "Completion Rate", value: "94.7%", color: "optimism-gold" },
      ],
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    }
  ];

  const geographicalDistribution = [
    { region: "Asia-Pacific", percentage: 68, color: "hope-green" },
    { region: "Africa", percentage: 18, color: "trust-blue" },
    { region: "Latin America", percentage: 10, color: "optimism-gold" },
    { region: "Others", percentage: 4, color: "purple-600" },
  ];

  const monthlyTrends = [
    { category: "Food Programs", growth: "+24%", color: "hope-green" },
    { category: "Education", growth: "+18%", color: "trust-blue" },
    { category: "Partnerships", growth: "+31%", color: "optimism-gold" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16" data-testid="impact-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-impact-title">Impact Dashboard</h1>
            <p className="text-xl md:text-2xl mb-8" data-testid="text-impact-subtitle">
              Transparent Reporting & Real-Time Impact Visualization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 px-6 py-3 font-semibold hover:bg-gray-100" data-testid="button-download-report">
                <Download className="mr-2 h-5 w-5" />
                Download Report
              </Button>
              <Button className="bg-purple-700 text-white px-6 py-3 font-semibold hover:bg-purple-800" data-testid="button-share-impact">
                <Share className="mr-2 h-5 w-5" />
                Share Impact
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact Overview */}
      <section className="py-12" data-testid="global-impact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-global-impact-title">
              Global Impact Overview
            </h2>
            <p className="text-lg text-gray-600" data-testid="text-global-impact-subtitle">
              Real-time data showing the collective impact of all Sahaay initiatives
            </p>
          </div>

          {/* Key Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="text-center hover:shadow-xl transition-shadow" data-testid="metric-meals-distributed">
              <CardContent className="p-8">
                <div className="text-4xl text-hope-green mb-4">
                  <Utensils className="h-10 w-10 mx-auto" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {globalImpactStats.mealsDistributed.toLocaleString()}
                </div>
                <div className="text-gray-600 mb-3">Meals Distributed</div>
                <div className="text-sm text-hope-green font-semibold">↑ 12% this month</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow" data-testid="metric-students-educated">
              <CardContent className="p-8">
                <div className="text-4xl text-trust-blue mb-4">
                  <GraduationCap className="h-10 w-10 mx-auto" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {globalImpactStats.studentsEducated.toLocaleString()}
                </div>
                <div className="text-gray-600 mb-3">Students Educated</div>
                <div className="text-sm text-trust-blue font-semibold">↑ 8% this month</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow" data-testid="metric-families-supported">
              <CardContent className="p-8">
                <div className="text-4xl text-optimism-gold mb-4">
                  <Home className="h-10 w-10 mx-auto" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {globalImpactStats.familiesSupported.toLocaleString()}
                </div>
                <div className="text-gray-600 mb-3">Families Supported</div>
                <div className="text-sm text-optimism-gold font-semibold">↑ 15% this month</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow" data-testid="metric-active-volunteers">
              <CardContent className="p-8">
                <div className="text-4xl text-purple-600 mb-4">
                  <Users className="h-10 w-10 mx-auto" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {globalImpactStats.activeVolunteers.toLocaleString()}
                </div>
                <div className="text-gray-600 mb-3">Active Volunteers</div>
                <div className="text-sm text-purple-600 font-semibold">↑ 22% this month</div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Visualization Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Geographical Impact */}
            <Card className="shadow-lg" data-testid="card-geographical-impact">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Geographical Impact Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mock world map visualization */}
                <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-16 w-16 text-trust-blue mb-4 mx-auto opacity-60" />
                    <p className="text-gray-600 font-semibold">Interactive Impact Map</p>
                    <p className="text-sm text-gray-500">Click regions to view detailed metrics</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  {geographicalDistribution.map((region) => (
                    <div key={region.region} className="flex justify-between" data-testid={`geo-${region.region.toLowerCase().replace(' ', '-')}`}>
                      <span className="text-gray-600">{region.region}</span>
                      <span className={`font-semibold text-${region.color}`}>{region.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card className="shadow-lg" data-testid="card-monthly-trends">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Monthly Impact Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mock trend chart */}
                <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-purple-600 mb-4 mx-auto opacity-60" />
                    <p className="text-gray-600 font-semibold">Growth Trend Analysis</p>
                    <p className="text-sm text-gray-500">12-month impact progression</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  {monthlyTrends.map((trend) => (
                    <div key={trend.category} className="text-center" data-testid={`trend-${trend.category.toLowerCase().replace(' ', '-')}`}>
                      <div className={`font-bold text-${trend.color}`}>{trend.growth}</div>
                      <div className="text-gray-600">{trend.category}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program-Specific Impact */}
      <section className="py-12 bg-white" data-testid="program-impact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8" data-testid="text-program-impact-title">
            Program-Specific Impact Breakdown
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {programImpacts.map((program) => {
              const IconComponent = program.icon;
              return (
                <Card 
                  key={program.name}
                  className={`bg-gradient-to-br from-${program.color}/10 to-${program.color}/5 border border-${program.color}/20`}
                  data-testid={`card-${program.name.toLowerCase().replace(' ', '-')}`}
                >
                  <CardHeader>
                    <div className="flex items-center">
                      <div className={`text-2xl text-${program.color} mr-3`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">{program.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-4">
                      {program.stats.map((stat) => (
                        <div key={stat.label} className="flex justify-between" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                          <span className="text-gray-600">{stat.label}</span>
                          <span className={`font-bold text-${stat.color}`}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <img 
                      src={program.image} 
                      alt={program.name} 
                      className="w-full h-32 object-cover rounded-lg"
                      data-testid={`img-${program.name.toLowerCase().replace(' ', '-')}`}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparency Reports */}
      <section className="py-12" data-testid="transparency-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg" data-testid="card-transparency">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900" data-testid="text-transparency-title">
                    Transparency & Accountability
                  </CardTitle>
                  <CardDescription data-testid="text-transparency-subtitle">
                    Detailed financial and operational reporting
                  </CardDescription>
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-purple-600 text-white hover:bg-purple-700" data-testid="button-annual-report">
                    <FileText className="mr-2 h-4 w-4" />
                    Annual Report
                  </Button>
                  <Button className="bg-gray-600 text-white hover:bg-gray-700" data-testid="button-financial-statement">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Financial Statement
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg" data-testid="transparency-funds-raised">
                  <div className="text-2xl font-bold text-gray-900">₹{(globalImpactStats.fundsRaised / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-gray-600">Total Funds Raised</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg" data-testid="transparency-program-efficiency">
                  <div className="text-2xl font-bold text-hope-green">{globalImpactStats.programSuccessRate}%</div>
                  <div className="text-sm text-gray-600">Program Efficiency</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg" data-testid="transparency-cost-per-beneficiary">
                  <div className="text-2xl font-bold text-trust-blue">₹{globalImpactStats.costPerBeneficiary}</div>
                  <div className="text-sm text-gray-600">Cost per Beneficiary</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg" data-testid="transparency-transparency-score">
                  <div className="text-2xl font-bold text-optimism-gold">97.8%</div>
                  <div className="text-sm text-gray-600">Transparency Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
