import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Phone,
  CreditCard,
  CheckCircle,
  Clock,
  MapPin,
  AlertCircle,
  LogOut,
  Wrench,
  Zap,
  Home,
  Car,
  Droplets,
  TreePine,
  Shield
} from "lucide-react";

interface ServiceProviderInfo {
  name: string;
  phone: string;
  aadhaar: string;
  skillSet: string[];
  yearsOfExperience: number;
}

interface WorkRequest {
  id: string;
  consumerName: string;
  consumerPhone: string;
  serviceType: string;
  description: string;
  address: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'assigned' | 'completed';
  createdAt: string;
}

const SKILL_OPTIONS = [
  { id: 'plumber', label: 'Plumber', icon: Droplets },
  { id: 'electrician', label: 'Electrician', icon: Zap },
  { id: 'housekeeping', label: 'Housekeeping', icon: Home },
  { id: 'gardener', label: 'Gardener', icon: TreePine },
  { id: 'driver', label: 'Driver', icon: Car },
];

export default function ServiceProviderDashboard() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [serviceProviderInfo, setServiceProviderInfo] = useState<ServiceProviderInfo>({
    name: "",
    phone: "",
    aadhaar: "",
    skillSet: [],
    yearsOfExperience: 0
  });
  const [infoSubmitted, setInfoSubmitted] = useState(false);
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [otpInputs, setOtpInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user) {
      setLocation("/empower-bridge");
      return;
    }
    if (user.role !== "service-provider") {
      setLocation("/dashboard");
      return;
    }

    // Check if service provider info is already submitted
    checkServiceProviderInfoStatus();
  }, [user, setLocation]);

  const checkServiceProviderInfoStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/service-provider/info/${user?.id}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setServiceProviderInfo({
            name: data.data.name,
            phone: data.data.phone,
            aadhaar: data.data.aadhaar,
            skillSet: JSON.parse(data.data.skillSet || '[]'),
            yearsOfExperience: data.data.yearsOfExperience
          });
          setInfoSubmitted(true);
          setCurrentStep(2);
          loadWorkRequests();
        }
      }
    } catch (error) {
      console.error('Error checking service provider info status:', error);
    }
  };

  const validateServiceProviderInfo = (): boolean => {
    if (!serviceProviderInfo.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!serviceProviderInfo.phone || serviceProviderInfo.phone.length !== 10 || !/^\d+$/.test(serviceProviderInfo.phone)) {
      toast({
        title: "Validation Error",
        description: "Phone number must be exactly 10 digits",
        variant: "destructive"
      });
      return false;
    }

    if (!serviceProviderInfo.aadhaar || serviceProviderInfo.aadhaar.length !== 12 || !/^\d+$/.test(serviceProviderInfo.aadhaar)) {
      toast({
        title: "Validation Error",
        description: "Aadhaar number must be exactly 12 digits",
        variant: "destructive"
      });
      return false;
    }

    if (serviceProviderInfo.skillSet.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one skill",
        variant: "destructive"
      });
      return false;
    }

    if (serviceProviderInfo.yearsOfExperience < 0 || serviceProviderInfo.yearsOfExperience > 50) {
      toast({
        title: "Validation Error",
        description: "Years of experience must be between 0 and 50",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleServiceProviderInfoSubmit = async () => {
    if (!validateServiceProviderInfo()) return;

    try {
      const response = await fetch('http://localhost:5001/api/service-provider/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          ...serviceProviderInfo,
          skillSet: JSON.stringify(serviceProviderInfo.skillSet)
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setInfoSubmitted(true);
        setCurrentStep(2);
        toast({
          title: "Success",
          description: "Service provider information saved successfully",
        });
        loadWorkRequests();
      } else {
        throw new Error(data.error || 'Failed to save service provider information');
      }
    } catch (error) {
      console.error('Service provider info submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadWorkRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await fetch(`http://localhost:5001/api/service-provider/work-requests?serviceProviderId=${user?.id}`, {
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
      toast({
        title: "Error",
        description: "Failed to load work requests",
        variant: "destructive"
      });
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleSkillToggle = (skillId: string) => {
    setServiceProviderInfo(prev => ({
      ...prev,
      skillSet: prev.skillSet.includes(skillId)
        ? prev.skillSet.filter(s => s !== skillId)
        : [...prev.skillSet, skillId]
    }));
  };

  const handleOtpSubmit = async (requestId: string) => {
    const otp = otpInputs[requestId];

    if (!otp || otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 4-digit OTP",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/service-provider/complete-work', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          requestId,
          otp,
          serviceProviderId: user?.id
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: "Work request completed successfully!",
        });

        // Update the request status locally
        setWorkRequests(prev =>
          prev.map(req =>
            req.id === requestId
              ? { ...req, status: 'completed' as const }
              : req
          )
        );

        // Clear the OTP input
        setOtpInputs(prev => ({ ...prev, [requestId]: '' }));
      } else {
        throw new Error(data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete work request",
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

  if (!user || user.role !== "service-provider") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Service Provider Dashboard</h1>
              <p className="text-purple-100 mt-2">
                {infoSubmitted ? `Welcome, ${serviceProviderInfo.name}` : "Complete your profile to start receiving work requests"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{user.name}</div>
              <div className="text-purple-100">Service Provider</div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="mt-2 text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Service Provider Information */}
        {currentStep === 1 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Service Provider Information (Mandatory)
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
                    value={serviceProviderInfo.name}
                    onChange={(e) => setServiceProviderInfo({ ...serviceProviderInfo, name: e.target.value })}
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
                    value={serviceProviderInfo.phone}
                    onChange={(e) => setServiceProviderInfo({ ...serviceProviderInfo, phone: e.target.value })}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaar" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Aadhaar Card Number *
                </Label>
                <Input
                  id="aadhaar"
                  value={serviceProviderInfo.aadhaar}
                  onChange={(e) => setServiceProviderInfo({ ...serviceProviderInfo, aadhaar: e.target.value })}
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-semibold">Skill Set *</Label>
                <p className="text-sm text-gray-600">Select all skills that apply to you</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SKILL_OPTIONS.map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                      <div key={skill.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={skill.id}
                          checked={serviceProviderInfo.skillSet.includes(skill.id)}
                          onCheckedChange={() => handleSkillToggle(skill.id)}
                        />
                        <Label
                          htmlFor={skill.id}
                          className="flex items-center cursor-pointer"
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {skill.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Years of Experience *
                </Label>
                <Input
                  id="experience"
                  type="number"
                  value={serviceProviderInfo.yearsOfExperience}
                  onChange={(e) => setServiceProviderInfo({ ...serviceProviderInfo, yearsOfExperience: parseInt(e.target.value) || 0 })}
                  placeholder="Enter years of experience"
                  min="0"
                  max="50"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleServiceProviderInfoSubmit}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Submit Information
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Work Requests */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Work Requests
                </CardTitle>
                <CardDescription>
                  View and complete work requests from consumers
                </CardDescription>
              </CardHeader>
            </Card>

            {isLoadingRequests ? (
              <Card className="shadow-lg">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
                    <p className="text-gray-600">Loading work requests...</p>
                  </div>
                </CardContent>
              </Card>
            ) : workRequests.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Work Requests</h3>
                    <p className="text-gray-600 mb-4">There are no work requests available at the moment.</p>
                    <Button onClick={loadWorkRequests} variant="outline">
                      Refresh Requests
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <span>{request.consumerName}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{request.consumerPhone}</span>
                            </div>
                            <div className="flex items-center md:col-span-2">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{request.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="border-t pt-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Label htmlFor={`otp-${request.id}`} className="text-sm font-medium">
                                Enter OTP to complete work (Default: 3155)
                              </Label>
                              <Input
                                id={`otp-${request.id}`}
                                type="text"
                                placeholder="Enter 4-digit OTP"
                                maxLength={4}
                                value={otpInputs[request.id] || ''}
                                onChange={(e) => setOtpInputs(prev => ({
                                  ...prev,
                                  [request.id]: e.target.value.replace(/\D/g, '')
                                }))}
                                className="mt-1"
                              />
                            </div>
                            <Button
                              onClick={() => handleOtpSubmit(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={!otpInputs[request.id] || otpInputs[request.id].length !== 4}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete Work
                            </Button>
                          </div>
                        </div>
                      )}

                      {request.status === 'completed' && (
                        <div className="border-t pt-4">
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="font-medium">Work Completed Successfully</span>
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