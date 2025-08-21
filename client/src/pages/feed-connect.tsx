import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InteractiveMap } from "@/components/interactive-map";
import { 
  MapPin, 
  Truck, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Warehouse,
  Utensils,
  TriangleAlert,
  Building
} from "lucide-react";
import { mockActivities } from "@/lib/mock-data";

export default function FeedConnect() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-hope-green to-green-600 text-white py-16" data-testid="feedconnect-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-feedconnect-title">FeedConnect</h1>
            <p className="text-xl md:text-2xl mb-8" data-testid="text-feedconnect-subtitle">
              Intelligent Food Distribution & Hunger Combat System
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-hope-green px-6 py-3 font-semibold hover:bg-gray-100" data-testid="button-report-need">
                <MapPin className="mr-2 h-5 w-5" />
                Report Food Need
              </Button>
              <Button className="bg-green-700 text-white px-6 py-3 font-semibold hover:bg-green-800" data-testid="button-coordinate-distribution">
                <Truck className="mr-2 h-5 w-5" />
                Coordinate Distribution
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-12" data-testid="map-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-map-title">Live Hunger Map</h2>
            <p className="text-lg text-gray-600" data-testid="text-map-subtitle">
              Real-time visualization of food needs and distribution centers
            </p>
          </div>

          <InteractiveMap />
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="py-12" data-testid="quick-actions-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Report Need */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-report-shortage">
              <CardContent className="p-6">
                <div className="text-3xl text-red-500 mb-4">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Report Food Shortage</CardTitle>
                <CardDescription className="text-gray-600 text-sm mb-4">
                  Alert the community about urgent food needs in your area
                </CardDescription>
                <Button variant="link" className="text-red-500 font-semibold hover:text-red-700 p-0" data-testid="button-report-now">
                  Report Now →
                </Button>
              </CardContent>
            </Card>

            {/* Schedule Distribution */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-schedule-distribution">
              <CardContent className="p-6">
                <div className="text-3xl text-blue-500 mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Schedule Distribution</CardTitle>
                <CardDescription className="text-gray-600 text-sm mb-4">
                  Plan and coordinate food distribution events
                </CardDescription>
                <Button variant="link" className="text-blue-500 font-semibold hover:text-blue-700 p-0" data-testid="button-schedule">
                  Schedule →
                </Button>
              </CardContent>
            </Card>

            {/* Track Meals */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-track-meals">
              <CardContent className="p-6">
                <div className="text-3xl text-hope-green mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Track Meal Programs</CardTitle>
                <CardDescription className="text-gray-600 text-sm mb-4">
                  Monitor ongoing feeding programs and their impact
                </CardDescription>
                <Button variant="link" className="text-hope-green font-semibold hover:text-green-700 p-0" data-testid="button-view-stats">
                  View Stats →
                </Button>
              </CardContent>
            </Card>

            {/* Resource Hub */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-resource-hub">
              <CardContent className="p-6">
                <div className="text-3xl text-optimism-gold mb-4">
                  <Warehouse className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">Resource Hub</CardTitle>
                <CardDescription className="text-gray-600 text-sm mb-4">
                  Access food inventory and distribution resources
                </CardDescription>
                <Button variant="link" className="text-optimism-gold font-semibold hover:text-yellow-700 p-0" data-testid="button-access-hub">
                  Access Hub →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="py-12" data-testid="activities-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-activities-title">
            Recent FeedConnect Activities
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Activity Feed */}
            <Card className="shadow-md" data-testid="card-activity-feed">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Live Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.map((activity) => {
                    const getIcon = (iconName: string) => {
                      switch (iconName) {
                        case "utensils": return <Utensils className="text-white text-xs" />;
                        case "exclamation": return <TriangleAlert className="text-white text-xs" />;
                        case "truck": return <Truck className="text-white text-xs" />;
                        default: return <Building className="text-white text-xs" />;
                      }
                    };

                    const getColorClass = (color: string) => {
                      switch (color) {
                        case "hope-green": return "bg-hope-green";
                        case "urgent-red": return "bg-urgent-red";
                        case "trust-blue": return "bg-trust-blue";
                        default: return "bg-gray-500";
                      }
                    };

                    return (
                      <div 
                        key={activity.id} 
                        className={`flex items-start space-x-3 p-3 rounded-lg ${
                          activity.color === "hope-green" ? "bg-green-50" : 
                          activity.color === "urgent-red" ? "bg-red-50" : "bg-blue-50"
                        }`}
                        data-testid={`activity-${activity.id}`}
                      >
                        <div className={`w-8 h-8 ${getColorClass(activity.color)} rounded-full flex items-center justify-center`}>
                          {getIcon(activity.icon)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900" data-testid={`activity-message-${activity.id}`}>
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-600" data-testid={`activity-time-${activity.id}`}>
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Impact Statistics */}
            <Card className="shadow-md" data-testid="card-impact-stats">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">This Week's Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg" data-testid="stat-meals-served">
                    <span className="text-sm text-gray-600">Meals Served</span>
                    <span className="text-lg font-bold text-hope-green">12,547</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg" data-testid="stat-families-helped">
                    <span className="text-sm text-gray-600">Families Helped</span>
                    <span className="text-lg font-bold text-trust-blue">3,186</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg" data-testid="stat-active-programs">
                    <span className="text-sm text-gray-600">Active Programs</span>
                    <span className="text-lg font-bold text-optimism-gold">47</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg" data-testid="stat-distribution-centers">
                    <span className="text-sm text-gray-600">Distribution Centers</span>
                    <span className="text-lg font-bold text-purple-600">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
