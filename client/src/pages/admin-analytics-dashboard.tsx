import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { 
  Users, 
  Package,
  TrendingUp,
  Activity,
  Database,
  PieChart,
  BarChart3,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DashboardAnalytics {
  overview: {
    totalUsers: number;
    totalDonors: number;
    totalNGOs: number;
    totalServiceProviders: number;
    totalConsumers: number;
    totalFoodDonations: number;
    totalFoodQuantity: number;
    totalWorkRequests: number;
  };
  foodDonations: {
    totalDonations: number;
    totalQuantity: number;
    totalItems: number;
    averageQuantityPerDonation: number;
    donationsByCategory: Array<{
      category: string;
      count: number;
      totalQuantity: number;
    }>;
    donationsByStorageType: Array<{
      storageType: string;
      count: number;
      totalQuantity: number;
    }>;
    recentDonations: Array<{
      id: string;
      donorName: string;
      totalItems: number;
      totalQuantity: number;
      createdAt: Date;
      foodItems: Array<{
        foodType: string;
        quantity: number;
        category: string;
      }>;
    }>;
    monthlyTrends: Array<{
      month: string;
      donations: number;
      quantity: number;
    }>;
  };
  userGrowth: {
    totalRegistrations: number;
    monthlyRegistrations: Array<{
      month: string;
      count: number;
      role: string;
    }>;
    roleDistribution: Array<{
      role: string;
      count: number;
      percentage: number;
    }>;
  };
  workRequests: {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    requestsByUrgency: Array<{
      urgency: string;
      count: number;
    }>;
    requestsByServiceType: Array<{
      serviceType: string;
      count: number;
    }>;
  };
}

export default function AdminAnalyticsDashboard() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation("/feed-connect");
      return;
    }
    if (user.role !== "admin") {
      setLocation("/dashboard");
      return;
    }
  }, [user, setLocation]);

  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardAnalytics>({
    queryKey: ["dashboardAnalytics"],
    queryFn: async () => {
      console.log("📊 Fetching dashboard analytics...");
      const res = await fetch("http://localhost:5000/api/analytics/dashboard");
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Analytics API error:", res.status, errorText);
        throw new Error(`Failed to fetch analytics: ${res.status} ${errorText}`);
      }
      const json = await res.json();
      console.log("✅ Analytics received:", json);
      return json.data as DashboardAnalytics;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 3,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      donor: "bg-green-100 text-green-800",
      ngo: "bg-blue-100 text-blue-800",
      "service-provider": "bg-purple-100 text-purple-800",
      consumer: "bg-yellow-100 text-yellow-800",
      volunteer: "bg-pink-100 text-pink-800",
      educator: "bg-indigo-100 text-indigo-800",
      community: "bg-teal-100 text-teal-800",
      fieldworker: "bg-orange-100 text-orange-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cooked: "bg-orange-100 text-orange-800",
      packed: "bg-blue-100 text-blue-800",
      raw: "bg-green-100 text-green-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getStorageColor = (storage: string) => {
    const colors: Record<string, string> = {
      cold: "bg-blue-100 text-blue-800",
      hot: "bg-red-100 text-red-800",
      "room-temp": "bg-yellow-100 text-yellow-800"
    };
    return colors[storage] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-blue-100 mt-2">
                Comprehensive data insights and food donation analytics
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{user.name}</div>
              <div className="text-blue-100">System Administrator</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-sm text-gray-600">
              {error ? 'Connection Error' : 'Live Data'}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800">Error loading analytics</div>
                  <div className="text-sm text-red-600">{error.message}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && !analytics && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-gray-600">Loading analytics data...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overview Statistics */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalUsers}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalFoodDonations}</div>
                  <div className="text-sm text-gray-600">Food Donations</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalFoodQuantity} KG</div>
                  <div className="text-sm text-gray-600">Food Quantity</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{analytics.overview.totalWorkRequests}</div>
                  <div className="text-sm text-gray-600">Work Requests</div>
                </CardContent>
              </Card>
            </div>

            {/* User Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    User Role Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of users by their roles in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.userGrowth.roleDistribution.map((role) => (
                      <div key={role.role} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getRoleColor(role.role)}>
                            {role.role}
                          </Badge>
                          <span className="text-sm text-gray-600">{role.count} users</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={role.percentage} className="w-20 h-2" />
                          <span className="text-sm font-medium">{role.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Food Donation Categories
                  </CardTitle>
                  <CardDescription>
                    Distribution of food donations by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.foodDonations.donationsByCategory.map((category) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getCategoryColor(category.category)}>
                            {category.category}
                          </Badge>
                          <span className="text-sm text-gray-600">{category.count} donations</span>
                        </div>
                        <div className="text-sm font-medium">{category.totalQuantity} KG</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Food Donation Analytics */}
            <Card className="shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Food Donation Analytics
                </CardTitle>
                <CardDescription>
                  Detailed insights into food donations and distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analytics.foodDonations.totalDonations}</div>
                    <div className="text-sm text-gray-600">Total Donations</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analytics.foodDonations.totalQuantity} KG</div>
                    <div className="text-sm text-gray-600">Total Quantity</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{analytics.foodDonations.totalItems}</div>
                    <div className="text-sm text-gray-600">Total Items</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{analytics.foodDonations.averageQuantityPerDonation} KG</div>
                    <div className="text-sm text-gray-600">Avg per Donation</div>
                  </div>
                </div>

                {/* Storage Requirements */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Storage Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analytics.foodDonations.donationsByStorageType.map((storage) => (
                      <div key={storage.storageType} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getStorageColor(storage.storageType)}>
                            {storage.storageType}
                          </Badge>
                          <span className="text-sm font-medium">{storage.count} items</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{storage.totalQuantity} KG</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Trends */}
                {analytics.foodDonations.monthlyTrends.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Monthly Trends</h3>
                    <div className="space-y-3">
                      {analytics.foodDonations.monthlyTrends.map((trend) => (
                        <div key={trend.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">{trend.month}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              <span className="font-medium">{trend.donations}</span> donations
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">{trend.quantity} KG</span> total
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card className="shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Food Donations
                </CardTitle>
                <CardDescription>
                  Latest food donations with detailed information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.foodDonations.recentDonations.slice(0, 10).map((donation) => (
                    <div key={donation.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{donation.donorName}</h4>
                            <p className="text-sm text-gray-600">
                              {donation.totalItems} items • {donation.totalQuantity} KG
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500 text-white">Received</Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(donation.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {donation.foodItems.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item.foodType}: {item.quantity}kg ({item.category})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {analytics.foodDonations.recentDonations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No recent donations found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Requests Analytics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Work Requests Analytics
                </CardTitle>
                <CardDescription>
                  Service provider work requests and completion statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analytics.workRequests.totalRequests}</div>
                    <div className="text-sm text-gray-600">Total Requests</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{analytics.workRequests.pendingRequests}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analytics.workRequests.completedRequests}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Requests by Urgency */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Requests by Urgency</h3>
                    <div className="space-y-3">
                      {analytics.workRequests.requestsByUrgency.map((urgency) => (
                        <div key={urgency.urgency} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <Badge className={
                            urgency.urgency === 'high' ? 'bg-red-100 text-red-800' :
                            urgency.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {urgency.urgency.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{urgency.count} requests</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Service Types */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Top Service Types</h3>
                    <div className="space-y-3">
                      {analytics.workRequests.requestsByServiceType.slice(0, 5).map((service) => (
                        <div key={service.serviceType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{service.serviceType}</span>
                          <Badge variant="outline">{service.count} requests</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}