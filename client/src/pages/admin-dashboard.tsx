import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { InteractiveMap } from "@/components/interactive-map";
import {
  Users,
  DollarSign,
  Shield,
  Activity,
  Database,
  Globe,
  AlertTriangle,
  Flag,
  Eye,
  CheckCircle,
  XCircle,
  Building
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";

interface ReportItem {
  donationId: string;
  userId: string;
  userName: string;
  donorName: string;
  phone: string;
  totalItems: number;
  totalQuantity: string | number;
  createdAt: string | Date | null;
  items: Array<{
    id: string;
    donationId: string;
    foodType: string;
    quantity: string; // decimal as string from DB
    foodSafetyTag: string | null;
    preparationTime: string;
    preparationDate: string;
    foodTypeCategory: string;
    storageRequirement: string;
    expiryDate: string;
    expiryTime: string;
  }>;
}

interface DonorDetails {
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    role: string;
  };
  donorInfo: {
    id: string;
    userId: string;
    name: string;
    phone: string;
    address: string;
    aadhaar: string;
    createdAt: string | Date | null;
  };
  donations: Array<{
    donation: {
      id: string;
      userId: string;
      totalItems: number;
      totalQuantity: string; // decimal
      createdAt: string | Date | null;
    };
    items: Array<ReportItem["items"][number]>;
  }>;
}

// Service Provider Section Component
function ServiceProviderSection() {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [workRequests, setWorkRequests] = useState([]);
  const [completedLogs, setCompletedLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceProviderData();
  }, []);

  const loadServiceProviderData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading service provider data...');

      const [providersRes, requestsRes, logsRes] = await Promise.all([
        fetch('http://localhost:5001/api/service-provider/all'),
        fetch('http://localhost:5001/api/service-provider/all-requests'),
        fetch('http://localhost:5001/api/service-provider/completed-logs')
      ]);

      console.log('📊 API Responses:', {
        providers: providersRes.status,
        requests: requestsRes.status,
        logs: logsRes.status
      });

      if (providersRes.ok) {
        const providersData = await providersRes.json();
        console.log('👥 Service Providers Data:', providersData);
        setServiceProviders(providersData.data || []);
      } else {
        console.error('❌ Failed to fetch providers:', providersRes.status);
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        console.log('📋 Work Requests Data:', requestsData);
        setWorkRequests(requestsData.data || []);
      } else {
        console.error('❌ Failed to fetch requests:', requestsRes.status);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        console.log('📝 Completed Logs Data:', logsData);
        setCompletedLogs(logsData.data || []);
      } else {
        console.error('❌ Failed to fetch logs:', logsRes.status);
      }
    } catch (error) {
      console.error('💥 Error loading service provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillBadges = (skillSet: string) => {
    try {
      const skills = JSON.parse(skillSet || '[]');
      return skills.map((skill: string) => (
        <Badge key={skill} variant="outline" className="text-xs">
          {skill}
        </Badge>
      ));
    } catch {
      return <Badge variant="outline" className="text-xs">No skills</Badge>;
    }
  };

  return (
    <Card className="shadow-lg mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              EmpowerBridge Service Providers
            </CardTitle>
            <CardDescription>
              Service provider registrations, work requests, and completion logs with OTP validation
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={loadServiceProviderData} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4 text-center">
            <div className="text-gray-600">Loading service provider data...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Service Provider Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{serviceProviders.length}</div>
                <div className="text-sm text-gray-600">Registered Providers</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{workRequests.length}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedLogs.length}</div>
                <div className="text-sm text-gray-600">Completed Works</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {workRequests.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </div>
            </div>

            {/* Service Providers List */}
            <div>
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-2 mb-4">Registered Service Providers</h3>
              {serviceProviders.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                  No service providers registered yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {serviceProviders.slice(0, 5).map((provider: any) => (
                    <div key={provider.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                              <p className="text-sm text-gray-600">Phone: {provider.phone}</p>
                              <p className="text-sm text-gray-600">Experience: {provider.yearsOfExperience} years</p>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {getSkillBadges(provider.skillSet)}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>Registered</div>
                          <div>{new Date(provider.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {serviceProviders.length > 5 && (
                    <div className="text-center p-2">
                      <Button variant="outline" size="sm">
                        View All {serviceProviders.length} Providers
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Work Requests */}
            <div>
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-2 mb-4">Recent Work Requests</h3>
              {workRequests.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                  No work requests yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {workRequests.slice(0, 5).map((request: any) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                              request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                          }>
                            {request.urgency.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={
                            request.status === 'completed' ? 'bg-green-100 text-green-800' :
                              request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                          }>
                            {request.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900">{request.serviceType}</h4>
                      <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                      <div className="text-sm text-gray-600">
                        <div>Consumer: {request.consumerName}</div>
                        <div>Phone: {request.consumerPhone}</div>
                        <div>Address: {request.address}</div>
                      </div>
                    </div>
                  ))}
                  {workRequests.length > 5 && (
                    <div className="text-center p-2">
                      <Button variant="outline" size="sm">
                        View All {workRequests.length} Requests
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Completed Work Logs with OTP Validation */}
            <div>
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-2 mb-4">Completed Work Logs (OTP Validated)</h3>
              {completedLogs.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                  No completed work logs yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {completedLogs.slice(0, 5).map((log: any) => (
                    <div key={log.id} className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-500 text-white">COMPLETED</Badge>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            OTP: {log.otpValidated}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(log.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900">{log.serviceType}</h4>
                      <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                      <div className="text-sm text-gray-600">
                        <div>Service Provider ID: {log.serviceProviderId}</div>
                        <div>Validation Time: {new Date(log.completedAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  {completedLogs.length > 5 && (
                    <div className="text-center p-2">
                      <Button variant="outline" size="sm">
                        View All {completedLogs.length} Completed Works
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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
    data: reports,
    isLoading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery<ReportItem[]>({
    queryKey: ["tempDonorReports"],
    queryFn: async () => {
      console.log("Admin Dashboard: Fetching temp donor reports...");
      const res = await fetch("/api/temp-donor/reports");
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Admin Dashboard: API error:", res.status, errorText);
        throw new Error(`Failed to fetch reports: ${res.status} ${errorText}`);
      }
      const json = await res.json();
      console.log("Admin Dashboard: Reports received:", json);
      return (json.reports || []) as ReportItem[];
    },
    refetchInterval: 5000, // Reduced to 5 seconds for faster updates
    retry: 3,
  });

  const {
    data: donorDetails,
    isLoading: detailsLoading,
    error: detailsError,
    refetch: refetchDetails,
  } = useQuery<DonorDetails>({
    queryKey: ["donorDetails", selectedUserId],
    queryFn: async () => {
      console.log("Admin Dashboard: Fetching donor details for:", selectedUserId);
      const res = await fetch(`/api/temp-donor/donor/${selectedUserId}`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Admin Dashboard: Donor details API error:", res.status, errorText);
        throw new Error(`Failed to fetch donor details: ${res.status} ${errorText}`);
      }
      const json = await res.json();
      console.log("Admin Dashboard: Donor details received:", json);
      return json.donorDetails as DonorDetails;
    },
    enabled: !!selectedUserId && detailsOpen,
    retry: 3,
  });

  const handleOpenDetails = (userId: string) => {
    setSelectedUserId(userId);
    setDetailsOpen(true);
    // refetch will trigger via enabled flag
  };

  const exportCsv = () => {
    const rows = (reports || []).map(r => ({
      donationId: r.donationId,
      userId: r.userId,
      donorName: r.donorName,
      phone: r.phone,
      totalItems: r.totalItems,
      totalQuantity: String(r.totalQuantity),
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
      items: r.items.map(i => `${i.foodType}:${i.quantity}kg`).join("|")
    }));
    const headers = Object.keys(rows[0] || { donationId: '', userId: '', donorName: '', phone: '', totalItems: '', totalQuantity: '', createdAt: '', items: '' });
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => String((r as any)[h]).replace(/"/g, '""')).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `temp-donor-reports-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const latestNotifications = (reports || []).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-red-100 mt-2">
                System Administration & Control Center
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {user.name}
              </div>
              <div className="text-red-100">
                System Administrator • Full Access
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation to Analytics */}
        <div className="mb-8">
          <Card className="shadow-lg border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Advanced Analytics Dashboard</h3>
                  <p className="text-blue-700 text-sm">View comprehensive food donation analytics, user growth trends, and detailed insights</p>
                </div>
                <Button
                  onClick={() => setLocation("/admin-analytics")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Database className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center shadow-md">
            <CardContent className="p-6">
              <div className="text-3xl text-red-600 mb-2"><Users className="h-8 w-8 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-900">2,847</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md">
            <CardContent className="p-6">
              <div className="text-3xl text-blue-600 mb-2"><Activity className="h-8 w-8 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-900">47</div>
              <div className="text-sm text-gray-600">Active Programs</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md">
            <CardContent className="p-6">
              <div className="text-3xl text-green-600 mb-2"><DollarSign className="h-8 w-8 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-900">₹24.7M</div>
              <div className="text-sm text-gray-600">Total Donations</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md">
            <CardContent className="p-6">
              <div className="text-3xl text-purple-600 mb-2"><Shield className="h-8 w-8 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">System Health</div>
            </CardContent>
          </Card>
        </div>

        {/* Live Reports Section */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Live Reports & Notifications
                </CardTitle>
                <CardDescription>
                  Real-time updates, notifications, and system activities
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => refetchReports()}>
                  <Activity className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={exportCsv}>
                  <Database className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Real-time Notifications */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Live Notifications</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {(reportsLoading ? [] : latestNotifications).map((n) => (
                    <div key={n.donationId} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="text-sm font-medium text-green-800">New Temporary Donor Donation</div>
                            <div className="text-xs text-green-700">
                              <button className="underline" onClick={() => handleOpenDetails(n.userId)}>
                                {n.donorName}
                              </button>
                              {" • "}{n.totalItems} items • {Number(n.totalQuantity)} KG
                            </div>
                            <div className="text-xs text-gray-500">
                              {n.createdAt ? new Date(n.createdAt).toLocaleString() : "Just now"}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white text-xs">New</Badge>
                      </div>
                    </div>
                  ))}

                  {/* Static samples fallback when no reports */}
                  {!reportsLoading && (reports || []).length === 0 && (
                    <div className="p-3 bg-gray-50 border rounded-lg text-sm text-gray-600">
                      No recent temporary donor activity yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Activity Timeline</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">User Login</div>
                      <div className="text-xs text-gray-600">Admin user logged in from Mumbai</div>
                      <div className="text-xs text-gray-500">1 minute ago</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Data Export</div>
                      <div className="text-xs text-gray-600">Monthly report exported to CSV</div>
                      <div className="text-xs text-gray-500">3 minutes ago</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">User Approval</div>
                      <div className="text-xs text-gray-600">Business donor account approved</div>
                      <div className="text-xs text-gray-500">7 minutes ago</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">System Backup</div>
                      <div className="text-xs text-gray-600">Automated backup completed</div>
                      <div className="text-xs text-gray-500">15 minutes ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temporary Donor Reports Section */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Temporary Donor Reports
                </CardTitle>
                <CardDescription>
                  Recent food donations from temporary donors with detailed information
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => refetchReports()}>
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={exportCsv}>
                  <Database className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Error Display */}
            {reportsError && (
              <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="text-red-600">⚠️</div>
                  <div>
                    <div className="text-sm font-medium text-red-800">Error loading reports</div>
                    <div className="text-xs text-red-600">{reportsError.message}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {reportsLoading && (
              <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-600">⏳</div>
                  <div className="text-sm text-blue-800">Loading temporary donor reports...</div>
                </div>
              </div>
            )}

            {/* Debug Info */}
            <div className="p-3 mb-4 bg-gray-50 border rounded-lg text-xs text-gray-600">
              <div>Reports loaded: {reports?.length || 0}</div>
              <div>Last updated: {new Date().toLocaleTimeString()}</div>
              <div>Query status: {reportsLoading ? 'Loading' : reportsError ? 'Error' : 'Success'}</div>
            </div>

            <div className="space-y-4">
              {(reports || []).map((r) => (
                <div key={r.donationId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          <button className="underline" onClick={() => handleOpenDetails(r.userId)}>
                            {r.donorName}
                          </button>
                        </h4>
                        <p className="text-sm text-gray-600">Phone: {r.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500 text-white">Received</Badge>
                      <div className="text-xs text-gray-500 mt-1">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-blue-600">{r.totalItems}</div>
                      <div className="text-sm text-gray-600">Food Items</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-green-600">{Number(r.totalQuantity)} KG</div>
                      <div className="text-sm text-gray-600">Total Quantity</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-purple-600">—</div>
                      <div className="text-sm text-gray-600">Location</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Donated Items:</h5>
                    <div className="flex flex-wrap gap-2">
                      {r.items.map((it) => (
                        <Badge key={it.id} variant="outline">{it.foodType} ({Number(it.quantity)} KG)</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {!reportsLoading && !reportsError && (reports || []).length === 0 && (
                <div className="p-3 bg-gray-50 border rounded-lg text-sm text-gray-600">
                  No temporary donor reports yet. Try submitting a donation from the Temporary Donor Dashboard.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Geo-tagged Image Visual Section */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Geo-tagged Image Visual
                </CardTitle>
                <CardDescription>
                  Visual proof of food distribution with location tracking and timestamps
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  View All
                </Button>
                <Button variant="outline" size="sm" onClick={exportCsv}>
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Image Filters */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="today-images" defaultChecked />
                    <label htmlFor="today-images" className="text-sm font-medium">Today</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="week-images" defaultChecked />
                    <label htmlFor="week-images" className="text-sm font-medium">This Week</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="verified-images" defaultChecked />
                    <label htmlFor="verified-images" className="text-sm font-medium">Verified Only</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="pending-images" />
                    <label htmlFor="pending-images" className="text-sm font-medium">Pending Review</label>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Showing 24 of 156 images
                </div>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Image Card 1 */}
                <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src="/attached_assets/Food-Distribution-Indonesia-Antata-Foto-Reuters-752x357.jpg"
                      alt="Food distribution in Mumbai"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white text-xs">Verified</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      📍 Mumbai, Maharashtra
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Community Kitchen Distribution</h4>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      500 meals distributed to local community. Volunteers from ABC Foundation.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>📸 John Smith</span>
                      <span>✅ Verified</span>
                    </div>
                  </div>
                </div>

                {/* Image Card 2 */}
                <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src="/attached_assets/00004.png"
                      alt="Food distribution in Delhi"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white text-xs">Verified</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      📍 Delhi, NCR
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">School Lunch Program</h4>
                      <span className="text-xs text-gray-500">4 hours ago</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      300 students received nutritious meals. Sponsored by XYZ Foods Ltd.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>📸 Sarah Johnson</span>
                      <span>✅ Verified</span>
                    </div>
                  </div>
                </div>

                {/* Image Card 3 */}
                <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src="/attached_assets/00004_1755739132526.png"
                      alt="Food distribution in Bangalore"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white text-xs">Pending</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      📍 Bangalore, Karnataka
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Emergency Relief Distribution</h4>
                      <span className="text-xs text-gray-500">6 hours ago</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      200 emergency food packets distributed. Response to flood-affected area.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>📸 Mike Chen</span>
                      <span>⏳ Pending Review</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-sm text-gray-600">Total Images</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">142</div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">14</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24</div>
                  <div className="text-sm text-gray-600">Today</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EmpowerBridge Service Provider Section */}
        <ServiceProviderSection />

        {/* Live Hunger Map */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Live Hunger Map</CardTitle>
                <CardDescription>
                  Real-time visualization of food needs and distribution centers across the system
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Map View
                </Button>
                <Button variant="outline" size="sm">
                  Heat Map
                </Button>
                <Button variant="outline" size="sm">
                  Analytics
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Map Controls */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="critical-needs" defaultChecked />
                    <label htmlFor="critical-needs" className="text-sm">Critical Needs</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="distribution-centers" defaultChecked />
                    <label htmlFor="distribution-centers" className="text-sm">Distribution Centers</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="active-programs" defaultChecked />
                    <label htmlFor="active-programs" className="text-sm">Active Programs</label>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    Export Data
                  </Button>
                </div>
              </div>

              {/* Map Container */}
              <div className="relative min-h-[400px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <InteractiveMap />

                {/* Overlay for future heat map integration */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <div className="text-xs text-gray-600">Map Layer: Standard</div>
                  <div className="text-xs text-gray-500">Data Points: 1,247</div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical Need</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Moderate Need</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Distribution Center</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Active Program</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blacklist Management Section */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Flagged Entities (Blacklist Management)
                </CardTitle>
                <CardDescription>
                  Entities flagged by AI sentiment analysis for having more than 30% negative reviews
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Trigger sentiment analysis
                    fetch('http://localhost:5001/api/sentiment/analyze-all', { method: 'POST' })
                      .then(res => res.json())
                      .then(data => {
                        console.log('Sentiment analysis completed:', data);
                        // Refresh the page or update state
                        window.location.reload();
                      })
                      .catch(err => console.error('Error running sentiment analysis:', err));
                  }}
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Run Analysis
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BlacklistSection />
          </CardContent>
        </Card>
      </div>

      {/* Donor Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Temporary Donor Details</DialogTitle>
            <DialogDescription>Full donation information and items</DialogDescription>
          </DialogHeader>
          {!donorDetails || detailsLoading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-gray-900">{donorDetails.donorInfo.name}</div>
                <div className="text-sm text-gray-600">Phone: {donorDetails.donorInfo.phone}</div>
                <div className="text-sm text-gray-600">Aadhaar: {donorDetails.donorInfo.aadhaar}</div>
                <div className="text-sm text-gray-600">Address: {donorDetails.donorInfo.address}</div>
              </div>

              {donorDetails.donations.map(({ donation, items }) => (
                <Card key={donation.id} className="border">
                  <CardHeader>
                    <CardTitle className="text-base">Donation • {donation.createdAt ? new Date(donation.createdAt).toLocaleString() : ""}</CardTitle>
                    <CardDescription>
                      {donation.totalItems} items • {Number(donation.totalQuantity)} KG total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {items.map((it) => (
                        <Badge key={it.id} variant="outline">{it.foodType} ({Number(it.quantity)} KG)</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Dashboard Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* System Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-400">SahaayConnect</h3>
              <p className="text-gray-300 text-sm">
                Empowering communities through technology-driven food distribution and hunger relief initiatives.
              </p>
              <div className="flex space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-300">System Online</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-200">System Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Users:</span>
                  <span className="text-white font-medium">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Donations:</span>
                  <span className="text-white font-medium">₹24.7M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Meals Distributed:</span>
                  <span className="text-white font-medium">1.2M+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">System Uptime:</span>
                  <span className="text-white font-medium">99.9%</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-200">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <div className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                  System Documentation
                </div>
                <div className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                  User Management
                </div>
                <div className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                  Data Analytics
                </div>
                <div className="text-gray-300 hover:text-white cursor-pointer transition-colors">
                  Support Center
                </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-200">Support</h4>
              <div className="space-y-2 text-sm">
                <div className="text-gray-300">
                  <span className="font-medium">Email:</span> admin@sahaayconnect.org
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Phone:</span> +91-1800-123-4567
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Emergency:</span> +91-98765-43210
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Last Updated:</span> {new Date().toLocaleDateString('en-US')}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                © 2024 SahaayConnect. All rights reserved. | Admin Dashboard v2.1.0
              </div>
              <div className="flex space-x-6 text-sm">
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  Privacy Policy
                </span>
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  Terms of Service
                </span>
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  Security
                </span>
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  Help
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Blacklist Section Component
function BlacklistSection() {
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch flagged entities
  const { data: flaggedEntities, isLoading, error, refetch } = useQuery({
    queryKey: ['flagged-entities'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/sentiment/flagged-entities");
      if (!res.ok) {
        throw new Error('Failed to fetch flagged entities');
      }
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Handle admin action on blacklist item
  const handleAdminAction = async (blacklistId: string, status: string, notes?: string) => {
    setActionLoading(true);
    try {
      const res = await apiRequest("PUT", `/api/sentiment/blacklist/${blacklistId}`, {
        status,
        adminProfileId: 'admin-user-id', // In real app, get from logged-in user
        adminNotes: notes
      });

      if (res.ok) {
        console.log(`✅ Blacklist status updated to: ${status}`);
        refetch(); // Refresh the list
      } else {
        console.error('❌ Failed to update blacklist status');
      }
    } catch (error) {
      console.error('❌ Error updating blacklist:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600">⏳</div>
          <div className="text-sm text-blue-800">Loading flagged entities...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="text-red-600">⚠️</div>
          <div>
            <div className="text-sm font-medium text-red-800">Error loading flagged entities</div>
            <div className="text-xs text-red-600">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!flaggedEntities || flaggedEntities.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Flagged Entities</h3>
        <p className="text-gray-600 mb-4">
          All entities are performing well with positive reviews. No blacklist actions needed.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            fetch('http://localhost:5001/api/sentiment/analyze-all', { method: 'POST' })
              .then(() => refetch())
              .catch(err => console.error('Error:', err));
          }}
        >
          Run Sentiment Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{flaggedEntities.length}</div>
          <div className="text-sm text-red-700">Flagged Entities</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {flaggedEntities.filter((e: any) => e.status === 'flagged').length}
          </div>
          <div className="text-sm text-yellow-700">Pending Review</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {flaggedEntities.filter((e: any) => e.status === 'investigated').length}
          </div>
          <div className="text-sm text-blue-700">Under Investigation</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {flaggedEntities.filter((e: any) => e.status === 'cleared').length}
          </div>
          <div className="text-sm text-green-700">Cleared</div>
        </div>
      </div>

      {/* Flagged Entities List */}
      <div className="space-y-3">
        {flaggedEntities.map((entity: any) => (
          <div key={entity.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entity.entityType === 'ngo' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                  {entity.entityType === 'ngo' ? (
                    <Users className={`h-5 w-5 ${entity.entityType === 'ngo' ? 'text-blue-600' : 'text-purple-600'}`} />
                  ) : (
                    <Building className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{entity.entityName}</h4>
                  <p className="text-sm text-gray-600">{entity.entityEmail}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className={
                      entity.entityType === 'ngo' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                    }>
                      {entity.entityType.toUpperCase()}
                    </Badge>
                    <Badge className={
                      entity.status === 'flagged' ? 'bg-red-100 text-red-800' :
                        entity.status === 'investigated' ? 'bg-yellow-100 text-yellow-800' :
                          entity.status === 'cleared' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                    }>
                      {entity.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-600">
                  {entity.negativeReviewPercentage}%
                </div>
                <div className="text-sm text-gray-600">
                  {entity.negativeReviews}/{entity.totalReviews} negative
                </div>
                <div className="text-xs text-gray-500">
                  Flagged: {new Date(entity.flaggedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Flagged Reason */}
            <div className="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm font-medium text-red-800 mb-1">Flagged Reason:</div>
              <div className="text-sm text-red-700">{entity.flaggedReason}</div>
            </div>

            {/* Admin Notes */}
            {entity.adminNotes && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-1">Admin Notes:</div>
                <div className="text-sm text-blue-700">{entity.adminNotes}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {entity.status === 'flagged' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdminAction(entity.id, 'investigated', 'Under admin investigation')}
                    disabled={actionLoading}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Investigate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => handleAdminAction(entity.id, 'cleared', 'Reviewed and cleared by admin')}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleAdminAction(entity.id, 'blacklisted', 'Confirmed for blacklisting')}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Blacklist
                  </Button>
                </>
              )}

              {entity.status === 'investigated' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => handleAdminAction(entity.id, 'cleared', 'Investigation complete - cleared')}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleAdminAction(entity.id, 'blacklisted', 'Investigation complete - blacklisted')}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Blacklist
                  </Button>
                </>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedEntity(entity)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
