import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { 
  CheckCircle, 
  Heart, 
  Users, 
  Package,
  ArrowRight,
  Home
} from "lucide-react";

export default function TempDonorSuccess() {
  const { user } = useAppStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/feed-connect");
      return;
    }
    if (user.role !== "tempDonor") {
      setLocation("/dashboard");
      return;
    }
  }, [user, setLocation]);

  if (!user || user.role !== "tempDonor") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Your Donation!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your generous contribution will help feed families in need. Your donation has been successfully recorded and will be distributed to those who need it most.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl text-green-600 mb-2">
                <Heart className="h-8 w-8 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl text-blue-600 mb-2">
                <Users className="h-8 w-8 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-gray-900">15</div>
              <div className="text-sm text-gray-600">Families Helped</div>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-lg">
            <CardContent className="p-6">
              <div className="text-3xl text-orange-600 mb-2">
                <Package className="h-8 w-8 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-gray-900">100+</div>
              <div className="text-sm text-gray-600">Meals Provided</div>
            </CardContent>
          </Card>
        </div>

        {/* What Happens Next */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              What Happens Next?
            </CardTitle>
            <CardDescription>
              Here's what will happen with your donation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Verification & Processing</h3>
                  <p className="text-gray-600">Our team will verify your donation details and prepare it for distribution.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Distribution Planning</h3>
                  <p className="text-gray-600">We'll coordinate with local distribution centers to ensure your donation reaches those in need.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Impact Tracking</h3>
                  <p className="text-gray-600">You'll receive updates on how your donation is making a difference in the community.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => setLocation("/temp-donor-dashboard")}
            className="bg-green-600 hover:bg-green-700"
          >
            Make Another Donation
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setLocation("/feed-connect")}
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your donation or need assistance, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span className="text-gray-500">Email: support@sahaayconnect.org</span>
              <span className="text-gray-500">Phone: +91-1800-123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
