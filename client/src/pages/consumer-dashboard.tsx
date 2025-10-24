import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Clock,
  AlertCircle,
  LogOut,
  Plus,
  Wrench,
  Zap,
  Home,
  Car,
  Droplets,
  TreePine
} from "lucide-react";

interface ConsumerInfo {
  name: string;
  phone: string;
  address: string;
}

interface WorkRequest {
  id: string;
  serviceType: string;
  description: string;
  address: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'assigned' | 'completed';
  createdAt: string;
}

const SERVICE_TYPES = [
  { id: 'plumber', label: 'Plumbing', icon: Droplets },
  { id: 'electrician', label: 'Electrical', icon: Zap },
  { id: 'housekeeping', label: 'Housekeeping', icon: Home },
  { id: 'gardener', label: 'Gardening', icon: TreePine },
  { id: 'driver', label: 'Driver', icon: Car },
];

export default function ConsumerDashboard() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [consumerInfo, setConsumerInfo] = useState<ConsumerInfo>({
    name: "",
    phone: "",
    address: ""
  });
  const [infoSubmitted, setInfoSubmitted] = useState(false);
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>([]);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    serviceType: "",
    description: "",
    address: "",
    urgency: "medium" as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    if (!user) {
      setLocation("/empower-bridge");
      return;
    }
    if (user.role !== "consumer") {
      setLocation("/dashboard");
      return;
    }
    
    // Check if consumer info is already submitted
    checkConsumerInfoStatus();
  }, [user, setLocation]);

  const checkConsumerInfoStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/service-provider/consumer-info/${user?.id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setConsumerInfo({
            name: data.data.name,
            phone: data.data.phone,
            address: data.data.address
          });
          setInfoSubmitted(true);
          setCurrentStep(2);
          loadWorkRequests();
        }
      }
    } catch (error) {
      console.error('Error checking consumer info status:', error);
    }
  };

  const validateConsumerInfo = (): boolean => {
    if (!consumerInfo.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return false;
    }
    
    if (!consumerInfo.phone || consumerInfo.phone.length !== 10 || !/^\d+$/.test(consumerInfo.phone)) {
      toast({
        title: "Validation Error",
        description: "Phone number must be exactly 10 digits",
        variant: "destructive"
      });
      return false;
    }
    
    if (!consumerInfo.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Address is required",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleConsumerInfoSubmit = async () => {
    if (!validateConsumerInfo()) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/service-provider/consumer-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          ...consumerInfo
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setInfoSubmitted(true);
        setCurrentStep(2);
        toast({
          title: "Success",
          description: "Consumer information saved successfully",
        });
        loadWorkRequests();
      } else {
        throw new Error(data.error || 'Failed to save consumer information');
      }
    } catch (error) {
      console.error('Consumer info submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadWorkRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/service-provider/consumer-requests?consumerId=${user?.id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWorkRequests(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading work requests:', error);
    }
  };

  const validateNewRequest = (): boolean => {
    if (!newRequest.serviceType) {
      toast({
        title: "Validation Error",
        description: "Please select a service type",
        variant: "destructive"
      });
      return false;
    }
    
    if (!newRequest.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive"
      });
      return false;
    }
    
    if (!newRequest.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Address is required",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleCreateRequest = async () => {
    if (!validateNewRequest()) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/service-provider/work-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          consumerUserId: user?.id,
          ...newRequest
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: "Work request created successfully",
        });
        
        // Reset form
        setNewRequest({
          serviceType: "",
          description: "",
          address: "",
          urgency: "medium"
        });
        setShowCreateRequest(false);
        
        // Reload requests
        loadWorkRequests();
      } else {
        throw new Error(data.error || 'Failed to create work request');
      }
    } catch (error) {
      console.error('Create request error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    const { setUser } = useAppStore.getState();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    setLocation("/empower-bridge");
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || user.role !== "consumer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Consumer Dashboard</h1>
              <p className="text-green-100 mt-2">
                {infoSubmitted ? `Welcome, ${consumerInfo.name}` : "Complete your profile to start requesting services"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{user.name}</div>
              <div className="text-green-100">Consumer</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="mt-2 text-green-600 border-green-200 hover:bg-green-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Consumer Information */}
        {currentStep === 1 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Consumer Information (Mandatory)
              </CardTitle>
              <CardDescription>
                Please provide your information. This form is mandatory and cannot be skipped.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={consumerInfo.name}
                    onChange={(e) => setConsumerInfo({ ...consumerInfo, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={consumerInfo.phone}
                    onChange={(e) => setConsumerInfo({ ...consumerInfo, phone: e.target.value })}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address *
                </Label>
                <Textarea
                  id="address"
                  value={consumerInfo.address}
                  onChange={(e) => setConsumerInfo({ ...consumerInfo, address: e.target.value })}
                  placeholder="Enter your complete address"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleConsumerInfoSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Information
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Work Requests Management */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Card className="shadow-lg flex-1 mr-4">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Wrench className="h-5 w-5 mr-2" />
                    My Work Requests
                  </CardTitle>
                  <CardDescription>
                    Manage your service requests
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Button 
                onClick={() => setShowCreateRequest(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>

            {/* Create New Request Form */}
            {showCreateRequest && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Create New Work Request</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Service Type *</Label>
                      <Select value={newRequest.serviceType} onValueChange={(value) => setNewRequest({ ...newRequest, serviceType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_TYPES.map((service) => (
                            <SelectItem key={service.id} value={service.label}>
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Urgency *</Label>
                      <Select value={newRequest.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => setNewRequest({ ...newRequest, urgency: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                      placeholder="Describe the work needed in detail"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Service Address *</Label>
                    <Textarea
                      value={newRequest.address}
                      onChange={(e) => setNewRequest({ ...newRequest, address: e.target.value })}
                      placeholder="Enter the address where service is needed"
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button 
                      variant="outline"
                      onClick={() => setShowCreateRequest(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateRequest}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Create Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work Requests List */}
            {workRequests.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Work Requests</h3>
                    <p className="text-gray-600 mb-4">You haven't created any work requests yet.</p>
                    <Button 
                      onClick={() => setShowCreateRequest(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {workRequests.map((request) => (
                  <Card key={request.id} className="shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getUrgencyColor(request.urgency)}>
                              {request.urgency.toUpperCase()} PRIORITY
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status.toUpperCase()}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {request.serviceType}
                          </h3>
                          <p className="text-gray-600 mb-3">{request.description}</p>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{request.address}</span>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm text-gray-500">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {request.status === 'completed' && (
                        <div className="border-t pt-4">
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="font-medium">Service Completed Successfully</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}