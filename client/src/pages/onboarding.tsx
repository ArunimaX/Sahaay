import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  Heart, 
  DollarSign, 
  GraduationCap, 
  Users, 
  ClipboardList,
  ArrowRight 
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useLocation } from "wouter";

const roles = [
  {
    id: "ngo",
    title: "NGO/Organization",
    description: "Coordinate resources, manage programs, and track impact in your community.",
    icon: Building,
    color: "hope-green",
    hoverColor: "hover:border-hope-green hover:shadow-lg",
  },
  {
    id: "volunteer",
    title: "Volunteer", 
    description: "Contribute your time and skills to help communities in need.",
    icon: Heart,
    color: "trust-blue",
    hoverColor: "hover:border-trust-blue hover:shadow-lg",
  },
  {
    id: "donor",
    title: "Donor",
    description: "Fund impactful projects and track how your donations create change.",
    icon: DollarSign,
    color: "optimism-gold",
    hoverColor: "hover:border-optimism-gold hover:shadow-lg",
  },
  {
    id: "educator",
    title: "Educator",
    description: "Track student progress, manage resources, and improve educational outcomes.",
    icon: GraduationCap,
    color: "purple-500",
    hoverColor: "hover:border-purple-500 hover:shadow-lg",
  },
  {
    id: "community",
    title: "Community Member",
    description: "Report local needs, access resources, and stay informed about community programs.",
    icon: Users,
    color: "green-500",
    hoverColor: "hover:border-green-500 hover:shadow-lg",
  },
  {
    id: "fieldworker",
    title: "Field Worker",
    description: "Collect ground-level data, assess community needs, and coordinate local efforts.",
    icon: ClipboardList,
    color: "red-500",
    hoverColor: "hover:border-red-500 hover:shadow-lg",
  },
];

export default function Onboarding() {
  const { setUser } = useAppStore();
  const [, setLocation] = useLocation();

  const handleRoleSelect = (roleId: string) => {
    const mockUser = {
      id: "1",
      name: roleId === "volunteer" ? "Sarah Johnson" : "Hope Foundation",
      role: roleId as any,
      email: `user@${roleId}.example.com`,
      organization: roleId === "ngo" ? "Hope Foundation" : undefined,
      joinedDate: new Date(),
    };
    
    setUser(mockUser);
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50" data-testid="onboarding-page">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress indicator */}
        <div className="mb-8" data-testid="progress-indicator">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-trust-blue text-white rounded-full flex items-center justify-center font-semibold">1</div>
              <span className="ml-2 text-trust-blue font-semibold">Choose Role</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">2</div>
              <span className="ml-2 text-gray-600">Setup Profile</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">3</div>
              <span className="ml-2 text-gray-600">Get Started</span>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <Card className="shadow-xl" data-testid="role-selection-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-role-title">
              How would you like to help?
            </CardTitle>
            <CardDescription className="text-lg text-gray-600" data-testid="text-role-subtitle">
              Choose your role to get started with Sahaay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <div 
                    key={role.id}
                    className={`group cursor-pointer p-6 border-2 border-gray-200 rounded-xl transition-all hover:scale-105 ${role.hoverColor}`}
                    onClick={() => handleRoleSelect(role.id)}
                    data-testid={`role-card-${role.id}`}
                  >
                    <div className={`text-4xl text-${role.color} mb-4 text-center`}>
                      <IconComponent className="h-10 w-10 mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center" data-testid={`text-role-${role.id}-title`}>
                      {role.title}
                    </h3>
                    <p className="text-gray-600 text-center mb-4" data-testid={`text-role-${role.id}-description`}>
                      {role.description}
                    </p>
                    <div className="text-center">
                      <span className={`text-${role.color} font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center`}>
                        Select Role <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
