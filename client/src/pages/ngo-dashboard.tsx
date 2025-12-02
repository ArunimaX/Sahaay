import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  X,
  Camera,
  Upload,
  Heart,
  Users,
  Package,
  Clock,
  AlertCircle,
  LogOut
} from "lucide-react";

interface NgoInfo {
  name: string;
  phone: string;
  address: string;
  panId: string;
}

interface DonorRequest {
  id: string;
  donorName: string;
  donorPhone: string;
  donorAddress: string;
  foodItems: Array<{
    foodType: string;
    quantity: number;
    foodTypeCategory: string;
    storageRequirement: string;
    expiryDate: string;
    expiryTime: string;
  }>;
  totalQuantity: number;
  createdAt: string;
}

interface DeliveryProof {
  beforeImage: File | null;
  afterImage: File | null;
  beforeLocation: { lat: number; lng: number } | null;
  afterLocation: { lat: number; lng: number } | null;
}

export default function NgoDashboard() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [ngoInfo, setNgoInfo] = useState<NgoInfo>({
    name: "",
    phone: "",
    address: "",
    panId: ""
  });
  const [ngoInfoSubmitted, setNgoInfoSubmitted] = useState(false);
  const [currentDonorRequest, setCurrentDonorRequest] = useState<DonorRequest | null>(null);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [deliveryProof, setDeliveryProof] = useState<DeliveryProof>({
    beforeImage: null,
    afterImage: null,
    beforeLocation: null,
    afterLocation: null
  });
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation("/feed-connect");
      return;
    }
    if (user.role !== "ngo") {
      setLocation("/dashboard");
      return;
    }

    // Check if NGO info is already submitted
    checkNgoInfoStatus();
  }, [user, setLocation]);

  const checkNgoInfoStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/ngo/info/${user?.id}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setNgoInfo(data.data);
          setNgoInfoSubmitted(true);
          setCurrentStep(2);
          loadNextDonorRequest();
        }
      }
    } catch (error) {
      console.error('Error checking NGO info status:', error);
    }
  };

  const validateNgoInfo = (): boolean => {
    if (!ngoInfo.name.trim()) {
      toast({
        title: "Validation Error",
        description: "NGO name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!ngoInfo.phone || ngoInfo.phone.length !== 10 || !/^\d+$/.test(ngoInfo.phone)) {
      toast({
        title: "Validation Error",
        description: "Phone number must be exactly 10 digits",
        variant: "destructive"
      });
      return false;
    }

    if (!ngoInfo.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Address is required",
        variant: "destructive"
      });
      return false;
    }

    if (!ngoInfo.panId.trim() || ngoInfo.panId.length < 10) {
      toast({
        title: "Validation Error",
        description: "PAN ID must be at least 10 characters",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleNgoInfoSubmit = async () => {
    if (!validateNgoInfo()) return;

    try {
      console.log('Submitting NGO info:', { userId: user?.id, ...ngoInfo });

      const response = await fetch('http://localhost:5001/api/ngo/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          ...ngoInfo
        }),
      });

      const data = await response.json();
      console.log('NGO info response:', data);

      if (response.ok && data.success) {
        setNgoInfoSubmitted(true);
        setCurrentStep(2);
        toast({
          title: "Success",
          description: "NGO information saved successfully. Admin has been notified.",
        });
        loadNextDonorRequest();
      } else {
        throw new Error(data.error || 'Failed to save NGO information');
      }
    } catch (error) {
      console.error('NGO info submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save NGO information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadNextDonorRequest = async () => {
    setIsLoadingRequest(true);
    try {
      const response = await fetch(`http://localhost:5001/api/ngo/donor-requests/next?ngoUserId=${user?.id}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCurrentDonorRequest(data.data);
        } else {
          setCurrentDonorRequest(null);
        }
      }
    } catch (error) {
      console.error('Error loading donor request:', error);
      toast({
        title: "Error",
        description: "Failed to load donor requests",
        variant: "destructive"
      });
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!currentDonorRequest) return;

    try {
      const response = await fetch('http://localhost:5001/api/ngo/donor-requests/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          donationId: currentDonorRequest.id,
          ngoUserId: user?.id
        }),
      });

      if (response.ok) {
        toast({
          title: "Request Rejected",
          description: "Donor request has been rejected",
        });
        loadNextDonorRequest();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive"
      });
    }
  };

  const handleAcceptRequest = () => {
    setShowDeliveryForm(true);
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true }
      );
    });
  };

  const handleImageUpload = async (type: 'before' | 'after', file: File) => {
    try {
      const location = await getCurrentLocation();

      setDeliveryProof(prev => ({
        ...prev,
        [type === 'before' ? 'beforeImage' : 'afterImage']: file,
        [type === 'before' ? 'beforeLocation' : 'afterLocation']: location
      }));

      toast({
        title: "Image Uploaded",
        description: `${type === 'before' ? 'Before' : 'After'} delivery image uploaded with location`,
      });
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Failed to get location. Please enable GPS and try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitDeliveryProof = async () => {
    if (!deliveryProof.beforeImage || !deliveryProof.afterImage) {
      toast({
        title: "Missing Images",
        description: "Both before and after images are required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingProof(true);

    try {
      const formData = new FormData();
      formData.append('donationId', currentDonorRequest?.id || '');
      formData.append('ngoUserId', user?.id || '');
      formData.append('beforeImage', deliveryProof.beforeImage);
      formData.append('afterImage', deliveryProof.afterImage);
      formData.append('beforeLat', deliveryProof.beforeLocation?.lat.toString() || '');
      formData.append('beforeLng', deliveryProof.beforeLocation?.lng.toString() || '');
      formData.append('afterLat', deliveryProof.afterLocation?.lat.toString() || '');
      formData.append('afterLng', deliveryProof.afterLocation?.lng.toString() || '');

      const response = await fetch('http://localhost:5001/api/ngo/delivery-proof', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Delivery proof submitted successfully!",
        });

        // Reset delivery form
        setDeliveryProof({
          beforeImage: null,
          afterImage: null,
          beforeLocation: null,
          afterLocation: null
        });
        setShowDeliveryForm(false);

        // Load next request
        loadNextDonorRequest();
      } else {
        throw new Error('Failed to submit delivery proof');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit delivery proof. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const handleLogout = () => {
    const { setUser } = useAppStore.getState();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    setLocation("/feed-connect");
  };

  if (!user || user.role !== "ngo") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">NGO Dashboard</h1>
              <p className="text-blue-100 mt-2">
                {ngoInfoSubmitted ? ngoInfo.name : "Complete your NGO registration"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{user.name}</div>
              <div className="text-blue-100">NGO Representative</div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 2
            </span>
            <span className="text-sm text-gray-500">
              {currentStep === 1 ? "NGO Information" : "Food Donation Handling"}
            </span>
          </div>
          <Progress value={currentStep * 50} className="h-2" />
        </div>

        {/* Step 1: NGO Information */}
        {currentStep === 1 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Step 1: NGO Information (Mandatory)
              </CardTitle>
              <CardDescription>
                Please provide your NGO information. This step is mandatory and cannot be skipped.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    NGO Name *
                  </Label>
                  <Input
                    id="name"
                    value={ngoInfo.name}
                    onChange={(e) => setNgoInfo({ ...ngoInfo, name: e.target.value })}
                    placeholder="Enter your NGO name"
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
                    value={ngoInfo.phone}
                    onChange={(e) => setNgoInfo({ ...ngoInfo, phone: e.target.value })}
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
                  value={ngoInfo.address}
                  onChange={(e) => setNgoInfo({ ...ngoInfo, address: e.target.value })}
                  placeholder="Enter your NGO's complete address"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="panId" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  PAN ID *
                </Label>
                <Input
                  id="panId"
                  value={ngoInfo.panId}
                  onChange={(e) => setNgoInfo({ ...ngoInfo, panId: e.target.value.toUpperCase() })}
                  placeholder="Enter PAN ID (alphanumeric)"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNgoInfoSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit NGO Information
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Food Donation Handling */}
        {currentStep === 2 && !showDeliveryForm && (
          <div className="space-y-6">
            {/* Current Request Card */}
            {isLoadingRequest ? (
              <Card className="shadow-lg">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading donor requests...</p>
                  </div>
                </CardContent>
              </Card>
            ) : currentDonorRequest ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Food Donation Request
                  </CardTitle>
                  <CardDescription>
                    Review this donor request and choose to accept or reject
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Donor Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Donor Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Name</Label>
                        <p className="font-medium">{currentDonorRequest.donorName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Phone</Label>
                        <p className="font-medium">{currentDonorRequest.donorPhone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm text-gray-600">Address</Label>
                        <p className="font-medium">{currentDonorRequest.donorAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Food Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Food Items ({currentDonorRequest.foodItems.length})</h3>
                    <div className="space-y-3">
                      {currentDonorRequest.foodItems.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-sm text-gray-600">Food Type</Label>
                              <p className="font-medium">{item.foodType}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-600">Quantity</Label>
                              <p className="font-medium">{item.quantity} KG</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-600">Category</Label>
                              <Badge variant="outline">{item.foodTypeCategory}</Badge>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-600">Storage</Label>
                              <p className="text-sm">{item.storageRequirement}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-600">Expires</Label>
                              <p className="text-sm">{item.expiryDate} at {item.expiryTime}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Summary */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-900">Total Food Quantity</span>
                      <span className="text-2xl font-bold text-blue-600">{currentDonorRequest.totalQuantity} KG</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Estimated meals: {Math.floor(currentDonorRequest.totalQuantity * 2)}+ |
                      Families helped: {Math.floor(currentDonorRequest.totalQuantity / 2)}+
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Button
                      onClick={handleRejectRequest}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Request
                    </Button>

                    <Button
                      onClick={handleAcceptRequest}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Accept & Deliver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                    <p className="text-gray-600 mb-4">There are no donor requests available at the moment.</p>
                    <Button onClick={loadNextDonorRequest} variant="outline">
                      Refresh Requests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Delivery Proof Form */}
        {showDeliveryForm && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Delivery Proof Form (Mandatory)
              </CardTitle>
              <CardDescription>
                Upload geotagged images to complete the delivery process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Before Image */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Before Delivery Image *</Label>
                <p className="text-sm text-gray-600">Take a photo of the food condition before delivery</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    {deliveryProof.beforeImage ? (
                      <div className="space-y-2">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                        <p className="text-green-600 font-medium">Before image uploaded with location</p>
                        <p className="text-xs text-gray-500">{deliveryProof.beforeImage.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                        <p className="text-gray-600">Upload before delivery image</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('before', file);
                      }}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* After Image */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">After Delivery Image *</Label>
                <p className="text-sm text-gray-600">Take a photo during food distribution</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    {deliveryProof.afterImage ? (
                      <div className="space-y-2">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                        <p className="text-green-600 font-medium">After image uploaded with location</p>
                        <p className="text-xs text-gray-500">{deliveryProof.afterImage.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                        <p className="text-gray-600">Upload after delivery image</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('after', file);
                      }}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Location Info */}
              {(deliveryProof.beforeLocation || deliveryProof.afterLocation) && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">GPS Locations Captured</h3>
                  {deliveryProof.beforeLocation && (
                    <p className="text-sm text-green-700">
                      Before: {deliveryProof.beforeLocation.lat.toFixed(6)}, {deliveryProof.beforeLocation.lng.toFixed(6)}
                    </p>
                  )}
                  {deliveryProof.afterLocation && (
                    <p className="text-sm text-green-700">
                      After: {deliveryProof.afterLocation.lat.toFixed(6)}, {deliveryProof.afterLocation.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowDeliveryForm(false)}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSubmitDeliveryProof}
                  disabled={!deliveryProof.beforeImage || !deliveryProof.afterImage || isSubmittingProof}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmittingProof ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Delivery Proof
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}