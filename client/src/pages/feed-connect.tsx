import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IndiaMap } from "@/components/india-map";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Truck,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Warehouse,
  Utensils,
  TriangleAlert,
  Building,
  Star,
  MessageSquare
} from "lucide-react";
import { mockActivities } from "@/lib/mock-data";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { redirectToRoleDashboard } from "@/lib/role-redirect";
import { useState, useEffect } from "react";

interface NGO {
  id: string;
  name: string;
  email: string;
}

interface Business {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function FeedConnect() {
  const { toast } = useToast();
  const { setUser } = useAppStore();
  const [, setLocation] = useLocation();
  
  // Review system state
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingNgos, setLoadingNgos] = useState(false);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);

  const loginForm = useForm<{ email: string; password: string }>();

  const registerForm = useForm<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "admin" | "donor" | "ngo"
  }>();

  const reviewForm = useForm<{
    ngoId: string;
    businessId: string;
    rating: number;
    reviewTitle: string;
    reviewText: string;
  }>();

  async function handleLoginSubmit(values: { email: string; password: string }) {
    try {
      const res = await apiRequest("POST", "/api/test/login", {
        email: values.email,
        password: values.password,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }

      const user = await res.json();
      setUser({ id: user.user.id, name: user.user.name, role: user.user.role, email: user.user.email, joinedDate: new Date() } as any);
      toast({ title: "Welcome back!", description: "You are now logged in." });

      // Redirect to role-specific dashboard
      redirectToRoleDashboard(user.user.role, setLocation);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    }
  }

  // Fetch NGOs for dropdown
  async function fetchNGOs() {
    setLoadingNgos(true);
    try {
      const res = await apiRequest("GET", "/api/reviews/ngos");
      if (res.ok) {
        const data = await res.json();
        setNgos(data.data);
      }
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    } finally {
      setLoadingNgos(false);
    }
  }

  // Fetch businesses for dropdown
  async function fetchBusinesses() {
    setLoadingBusinesses(true);
    try {
      const res = await apiRequest("GET", "/api/reviews/businesses");
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data.data);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoadingBusinesses(false);
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchNGOs();
    fetchBusinesses();
  }, []);

  // Handle review submission
  async function handleReviewSubmit(values: {
    ngoId: string;
    businessId: string;
    rating: number;
    reviewTitle: string;
    reviewText: string;
  }) {
    try {
      console.log('🚀 Submitting review:', values);

      // For now, use a dummy reviewer profile ID (in real app, this would come from logged-in user)
      const reviewData = {
        reviewerProfileId: 'dummy-reviewer-id', // This should be the actual logged-in user's profile ID
        ngoProfileId: values.ngoId || null,
        businessProfileId: values.businessId || null,
        rating: values.rating,
        reviewTitle: values.reviewTitle,
        reviewText: values.reviewText,
      };

      const res = await apiRequest("POST", "/api/reviews", reviewData);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Review submission failed');
      }

      const result = await res.json();
      console.log('✅ Review submitted successfully:', result);

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });

      // Reset form
      reviewForm.reset();
    } catch (error) {
      console.error('💥 Review submission error:', error);
      toast({
        title: "Review submission failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    }
  }

  async function handleRegisterSubmit(values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "admin" | "donor" | "ngo"
  }) {
    console.log("🚀 Starting registration process...", values);

    // Basic client-side validation
    if (values.password !== values.confirmPassword) {
      console.log("❌ Password mismatch");
      toast({
        title: "Validation Error",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }

    if (values.password.length < 6) {
      console.log("❌ Password too short");
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("📡 Making API request to /api/test/register");
      const res = await apiRequest("POST", "/api/test/register", {
        email: values.email,
        name: values.name,
        role: values.role,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      console.log("✅ API response received:", res);

      if (!res.ok) {
        const error = await res.json();
        console.log("❌ API error:", error);
        throw new Error(error.error || 'Registration failed');
      }

      const created = await res.json();
      console.log("🎉 User created successfully:", created);

      setUser({ id: created.user.id, name: created.user.name, role: created.user.role, email: created.user.email, joinedDate: new Date() } as any);
      toast({ title: "Account created", description: `Registered as ${values.role.replace(/([A-Z])/g, " $1").trim()}` });

      // Redirect to role-specific dashboard
      redirectToRoleDashboard(values.role, setLocation);
    } catch (error) {
      console.error("💥 Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-hope-green to-green-600 text-white py-16" data-testid="feedconnect-hero">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/attached_assets/00004_1755739132526.png')"
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-feedconnect-title">FeedConnect</h1>
            <p className="text-xl md:text-2xl mb-8" data-testid="text-feedconnect-subtitle">
              Intelligent Food Distribution & Hunger Combat System
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white text-hope-green px-6 py-3 font-semibold hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all transform hover:scale-105" data-testid="button-login">
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                  </DialogHeader>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }: { field: any }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" required {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }: { field: any }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" required {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-hope-green text-white hover:bg-green-700">Sign In</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-700 text-white px-6 py-3 font-semibold hover:bg-green-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105" data-testid="button-register">
                    Register
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create your account</DialogTitle>
                  </DialogHeader>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }: { field: any }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" required {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }: { field: any }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" required {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" required {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your password" required {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="donor">Donor</SelectItem>
                                  <SelectItem value="ngo">NGO</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-hope-green text-white hover:bg-green-700">Create account</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-12" data-testid="map-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-map-title">India Hunger Risk Map</h2>
            <p className="text-lg text-gray-600" data-testid="text-map-subtitle">
              Interactive map of India showing district-level hunger risk assessment and food distribution centers
            </p>
          </div>

          <IndiaMap />
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
                        className={`flex items-start space-x-3 p-3 rounded-lg ${activity.color === "hope-green" ? "bg-green-50" :
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

      {/* Review Section */}
      <section className="py-12 bg-gray-100" data-testid="review-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-review-title">
              Share Your Experience
            </h2>
            <p className="text-lg text-gray-600" data-testid="text-review-subtitle">
              Help others by reviewing NGOs and businesses in our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Review Form */}
            <Card className="shadow-lg" data-testid="card-review-form">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-hope-green" />
                  Write a Review
                </CardTitle>
                <CardDescription>
                  Share your experience with NGOs and businesses to help build trust in our community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...reviewForm}>
                  <form onSubmit={reviewForm.handleSubmit(handleReviewSubmit)} className="space-y-4">
                    {/* NGO Selection */}
                    <FormField
                      control={reviewForm.control}
                      name="ngoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select NGO (Optional)</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder={loadingNgos ? "Loading NGOs..." : "Choose an NGO"} />
                              </SelectTrigger>
                              <SelectContent>
                                {ngos.map((ngo) => (
                                  <SelectItem key={ngo.id} value={ngo.id}>
                                    {ngo.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Business Selection */}
                    <FormField
                      control={reviewForm.control}
                      name="businessId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Business (Optional)</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder={loadingBusinesses ? "Loading businesses..." : "Choose a business"} />
                              </SelectTrigger>
                              <SelectContent>
                                {businesses.map((business) => (
                                  <SelectItem key={business.id} value={business.id}>
                                    {business.name} ({business.role})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Rating */}
                    <FormField
                      control={reviewForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
                                <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
                                <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
                                <SelectItem value="2">⭐⭐ (2 stars)</SelectItem>
                                <SelectItem value="1">⭐ (1 star)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Review Title */}
                    <FormField
                      control={reviewForm.control}
                      name="reviewTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Review Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief summary of your experience" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Review Text */}
                    <FormField
                      control={reviewForm.control}
                      name="reviewText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Review</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share your detailed experience..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-hope-green text-white hover:bg-green-700"
                      data-testid="button-submit-review"
                    >
                      Submit Review
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Review Guidelines */}
            <Card className="shadow-lg" data-testid="card-review-guidelines">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-optimism-gold" />
                  Review Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Do:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Be honest and constructive</li>
                      <li>• Share specific experiences</li>
                      <li>• Focus on service quality</li>
                      <li>• Help others make informed decisions</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Don't:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Use offensive language</li>
                      <li>• Share personal information</li>
                      <li>• Make false claims</li>
                      <li>• Post spam or irrelevant content</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Tips:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Select either an NGO or business (not both)</li>
                      <li>• Rate based on overall experience</li>
                      <li>• Include both positives and areas for improvement</li>
                      <li>• Your review helps build community trust</li>
                    </ul>
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
