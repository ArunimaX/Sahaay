// Role-based dashboard redirect utility

export function getRoleDashboardPath(role: string): string {
  switch (role.toLowerCase()) {
    case "admin":
      return "/admin-dashboard";
    case "donor":
      return "/temp-donor-dashboard";
    case "ngo":
      return "/ngo-dashboard";
    case "consumer":
      return "/consumer-dashboard";
    case "service-provider":
      return "/service-provider-dashboard";
    case "volunteer":
      return "/dashboard"; // Default dashboard for volunteers
    case "educator":
      return "/dashboard"; // Default dashboard for educators
    case "community":
      return "/dashboard"; // Default dashboard for community members
    case "fieldworker":
      return "/dashboard"; // Default dashboard for fieldworkers
    default:
      return "/dashboard"; // Fallback to main dashboard
  }
}

export function redirectToRoleDashboard(role: string, setLocation: (path: string) => void) {
  const dashboardPath = getRoleDashboardPath(role);
  console.log(`🔄 Redirecting ${role} to ${dashboardPath}`);
  setLocation(dashboardPath);
}