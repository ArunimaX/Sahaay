import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Package,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  Home,
  AlertCircle
} from "lucide-react";

interface DonorInfo {
  name: string;
  phone: string;
  address: string;
}

interface FoodItem {
  foodType: string;
  quantity: number;
  foodSafetyTag: string;
  preparationTime: string;
  preparationDate: string;
  foodTypeCategory: string;
  storageRequirement: string;
  expiryDate: string;
  expiryTime: string;
}

export default function TempDonorDashboard() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [donorInfo, setDonorInfo] = useState<DonorInfo>({
    name: "",
    phone: "",
    address: "",
  });
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [numberOfFoodTypes, setNumberOfFoodTypes] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationSubmitted, setDonationSubmitted] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation("/feed-connect");
      return;
    }
    if (user.role !== "donor") {
      setLocation("/dashboard");
      return;
    }
  }, [user, setLocation]);

  useEffect(() => {
    // Initialize food items based on number selected
    const newFoodItems: FoodItem[] = [];
    for (let i = 0; i < numberOfFoodTypes; i++) {
      newFoodItems.push({
        foodType: "",
        quantity: 0,
        foodSafetyTag: "",
        preparationTime: "",
        preparationDate: "",
        foodTypeCategory: "",
        storageRequirement: "",
        expiryDate: "",
        expiryTime: ""
      });
    }
    setFoodItems(newFoodItems);
  }, [numberOfFoodTypes]);

  if (!user || user.role !== "donor") {
    return null;
  }

  const validateDonorInfo = (): boolean => {
    if (!donorInfo.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!donorInfo.phone || donorInfo.phone.length !== 10 || !/^\d+$/.test(donorInfo.phone)) {
      toast({
        title: "Validation Error",
        description: "Phone number must be exactly 10 digits",
        variant: "destructive"
      });
      return false;
    }

    if (!donorInfo.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Address is required",
        variant: "destructive"
      });
      return false;
    }



    return true;
  };

  const validateFoodItems = (): boolean => {
    for (let i = 0; i < foodItems.length; i++) {
      const item = foodItems[i];

      if (!item.foodType.trim()) {
        toast({
          title: "Validation Error",
          description: `Food type is required for item ${i + 1}`,
          variant: "destructive"
        });
        return false;
      }

      if (item.quantity < 2) {
        toast({
          title: "Validation Error",
          description: `Quantity for ${item.foodType} must be at least 2 KG`,
          variant: "destructive"
        });
        return false;
      }

      if (!item.foodTypeCategory) {
        toast({
          title: "Validation Error",
          description: `Food type category is required for ${item.foodType}`,
          variant: "destructive"
        });
        return false;
      }

      if (!item.storageRequirement) {
        toast({
          title: "Validation Error",
          description: `Storage requirement is required for ${item.foodType}`,
          variant: "destructive"
        });
        return false;
      }

      if (!item.preparationTime || !item.preparationDate) {
        toast({
          title: "Validation Error",
          description: `Preparation time and date are required for ${item.foodType}`,
          variant: "destructive"
        });
        return false;
      }

      if (!item.expiryDate || !item.expiryTime) {
        toast({
          title: "Validation Error",
          description: `Expiry date and time are required for ${item.foodType}`,
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleDonorInfoSubmit = async () => {
    if (!validateDonorInfo()) return;

    try {
      // Store donor info in database
      const response = await fetch('http://localhost:5001/api/temp-donor/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          ...donorInfo
        }),
      });

      if (response.ok) {
        setCurrentStep(2);
        toast({
          title: "Success",
          description: "Donor information saved successfully",
        });
      } else {
        throw new Error('Failed to save donor information');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save donor information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFoodDonationSubmit = async () => {
    if (!validateFoodItems()) return;

    setIsSubmitting(true);

    try {
      // Store food donation details in database
      const response = await fetch('http://localhost:5001/api/temp-donor/food-donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          foodItems
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Food donation details submitted successfully!",
        });
        // Move to step 3 (completion step)
        setCurrentStep(3);
        setDonationSubmitted(true);
      } else {
        throw new Error('Failed to submit food donation details');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit food donation details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFoodItem = (index: number, field: keyof FoodItem, value: string | number) => {
    const updatedItems = [...foodItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFoodItems(updatedItems);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    const date = now.toLocaleDateString('en-GB');
    return { time, date };
  };

  const handleAddAnotherEntry = () => {
    // Reset food items and go back to step 2
    setFoodItems([]);
    setNumberOfFoodTypes(1);
    setDonationSubmitted(false);
    setCurrentStep(2);
    toast({
      title: "Ready for Another Donation",
      description: "You can now add another food donation entry.",
    });
  };

  const handleLogout = () => {
    // Clear user session and redirect to feed-connect
    const { setUser } = useAppStore.getState();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "Thank you for your contribution. You have been logged out successfully.",
    });
    setLocation("/feed-connect");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Temporary Donor Dashboard</h1>
              <p className="text-green-100 mt-2">
                Complete your donation information to help those in need
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{user.name}</div>
              <div className="text-green-100">Temporary Donor</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {currentStep === 3 ? 3 : 2}
            </span>
            <span className="text-sm text-gray-500">
              {currentStep === 1 ? "Donor Information" :
                currentStep === 2 ? "Food Donation Details" :
                  "Donation Complete"}
            </span>
          </div>
          <Progress value={currentStep === 3 ? 100 : currentStep * 50} className="h-2" />
        </div>

        {/* Step 1: Donor Information */}
        {currentStep === 1 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Step 1: Donor Information
              </CardTitle>
              <CardDescription>
                Please provide your personal information. This step is mandatory and cannot be skipped.
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
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
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
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Address *
                </Label>
                <Textarea
                  id="address"
                  value={donorInfo.address}
                  onChange={(e) => setDonorInfo({ ...donorInfo, address: e.target.value })}
                  placeholder="Enter your complete address"
                  rows={3}
                  required
                />
              </div>



              <div className="flex justify-end">
                <Button
                  onClick={handleDonorInfoSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue to Food Donation
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Food Donation Details */}
        {currentStep === 2 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Step 2: Food Donation Details
              </CardTitle>
              <CardDescription>
                Provide details about the food items you are donating. Each item must be at least 2 KG.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Number of Food Types */}
              <div className="space-y-2">
                <Label htmlFor="foodTypes">Number of Food Types *</Label>
                <Select value={numberOfFoodTypes.toString()} onValueChange={(value) => setNumberOfFoodTypes(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of food types" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'type' : 'types'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Food Items */}
              <div className="space-y-6">
                {foodItems.map((item, index) => (
                  <Card key={index} className="border-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Food Item {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Food Type *</Label>
                          <Input
                            value={item.foodType}
                            onChange={(e) => updateFoodItem(index, 'foodType', e.target.value)}
                            placeholder="e.g., Rice, Dal, Vegetables"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Quantity (KG) *</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateFoodItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            placeholder="Minimum 2 KG"
                            min="2"
                            step="0.1"
                            required
                          />
                          {item.quantity > 0 && item.quantity < 2 && (
                            <div className="flex items-center text-red-600 text-sm">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Minimum 2 KG required
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type of Food *</Label>
                          <Select value={item.foodTypeCategory} onValueChange={(value) => updateFoodItem(index, 'foodTypeCategory', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select food type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cooked">Cooked</SelectItem>
                              <SelectItem value="packed">Packed</SelectItem>
                              <SelectItem value="raw">Raw</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Storage Requirement *</Label>
                          <Select value={item.storageRequirement} onValueChange={(value) => updateFoodItem(index, 'storageRequirement', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select storage requirement" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cold">Cold</SelectItem>
                              <SelectItem value="hot">Hot</SelectItem>
                              <SelectItem value="room-temp">Room Temperature</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Food Safety Tag</Label>
                        <Input
                          value={item.foodSafetyTag}
                          onChange={(e) => updateFoodItem(index, 'foodSafetyTag', e.target.value)}
                          placeholder="e.g., FSSAI certified, Home cooked"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Preparation Time *</Label>
                          <Input
                            type="time"
                            value={item.preparationTime}
                            onChange={(e) => updateFoodItem(index, 'preparationTime', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Preparation Date *</Label>
                          <Input
                            type="date"
                            value={item.preparationDate}
                            onChange={(e) => updateFoodItem(index, 'preparationDate', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expiry Date *</Label>
                          <Input
                            type="date"
                            value={item.expiryDate}
                            onChange={(e) => updateFoodItem(index, 'expiryDate', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Expiry Time *</Label>
                          <Input
                            type="time"
                            value={item.expiryTime}
                            onChange={(e) => updateFoodItem(index, 'expiryTime', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Back to Donor Information
                </Button>
                <Button
                  onClick={handleFoodDonationSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Donation
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Donation Complete */}
        {currentStep === 3 && donationSubmitted && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Donation Submitted Successfully!
              </CardTitle>
              <CardDescription className="text-lg">
                Thank you for your generous contribution. Your food donation will help feed families in need.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Impact Preview */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-3">Your Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {foodItems.reduce((total, item) => total + item.quantity, 0)} KG
                    </div>
                    <div className="text-sm text-green-700">Food Donated</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.floor(foodItems.reduce((total, item) => total + item.quantity, 0) * 2)}+
                    </div>
                    <div className="text-sm text-green-700">Meals Provided</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.floor(foodItems.reduce((total, item) => total + item.quantity, 0) / 2)}+
                    </div>
                    <div className="text-sm text-green-700">Families Helped</div>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">What Happens Next?</h3>
                <div className="space-y-3 text-sm text-blue-700">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span>Our team will verify and process your donation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span>Food will be distributed to families in need</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span>You'll receive updates on your donation's impact</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  onClick={handleAddAnotherEntry}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Add Another Food Entry
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Logout from Session
                </Button>
              </div>

              {/* Contact Info */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Need help or have questions about your donation?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-gray-500">
                  <span>Email: support@sahaayconnect.org</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Phone: +91-1800-123-4567</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
