import { AuthForm } from "@/components/auth-form";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4" data-testid="onboarding-page">
      <AuthForm />
    </div>
  );
}

