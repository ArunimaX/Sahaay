export const globalImpactStats = {
  mealsDistributed: 2847392,
  studentsEducated: 156743,
  familiesSupported: 47289,
  activeVolunteers: 23847,
  partnershipsActive: 127,
  programSuccessRate: 89.4,
  fundsRaised: 24700000,
  costPerBeneficiary: 8.2,
};

export const mockPrograms = [
  {
    id: "1",
    name: "Rural Education Initiative",
    type: "education",
    beneficiaries: 647,
    locations: 12,
    progress: 78,
    status: "active",
  },
  {
    id: "2", 
    name: "Community Feeding Program",
    type: "nutrition",
    beneficiaries: 2847,
    locations: 8,
    progress: 92,
    status: "active",
  },
  {
    id: "3",
    name: "Skills Development",
    type: "empowerment",
    beneficiaries: 342,
    locations: 5,
    progress: 65,
    status: "active",
  },
];

export const mockOpportunities = [
  {
    id: "1",
    title: "Math Tutors Needed for Rural Schools",
    organization: "Education for All NGO",
    type: "education",
    location: "Maharashtra, India",
    volunteers_needed: 15,
    commitment: "3 months",
    urgent: true,
    description: "We need 15 volunteer math tutors to support students in rural Maharashtra schools. Flexible timing, basic teaching skills required.",
  },
  {
    id: "2",
    title: "Corporate Food Drive Partnership",
    organization: "TechCorp Inc.",
    type: "nutrition",
    location: "Multiple Cities",
    budget: 50000,
    commitment: "Long-term",
    partnership: true,
    description: "Technology company seeking NGO partners for quarterly food drive initiatives. 10,000+ meals per quarter potential.",
  },
  {
    id: "3",
    title: "Web Development for NGO Websites",
    organization: "Various NGOs",
    type: "technology",
    location: "Remote",
    volunteers_needed: 5,
    commitment: "Flexible",
    skillBased: true,
    description: "Help 5 small NGOs modernize their websites and improve their digital presence. Remote work possible, 2-3 hours per week.",
  },
];

export const mockActivities = [
  {
    id: "1",
    type: "meal_distribution",
    message: "500 meals distributed in Dharavi",
    timestamp: "2 hours ago",
    icon: "utensils",
    color: "hope-green",
  },
  {
    id: "2",
    type: "urgent_need",
    message: "Urgent: 200 families need food in Bandra",
    timestamp: "4 hours ago",
    icon: "exclamation",
    color: "urgent-red",
  },
  {
    id: "3",
    type: "new_center",
    message: "New distribution center opened in Andheri",
    timestamp: "1 day ago",
    icon: "truck",
    color: "trust-blue",
  },
];

export const mockSchoolData = [
  {
    name: "Sunrise Primary School",
    mealsServed: 342,
    attendance: 356,
    attendanceRate: 96,
    status: "complete",
  },
  {
    name: "Valley Elementary",
    mealsServed: 198,
    attendance: 205,
    attendanceRate: 97,
    status: "complete",
  },
  {
    name: "Hillside School",
    mealsServed: 78,
    attendance: 89,
    attendanceRate: 88,
    status: "partial",
  },
];

export const mockMapLocations = [
  {
    id: "delhi",
    name: "Delhi",
    coordinates: [28.6139, 77.2090],
    type: "critical",
    familiesInNeed: 1247,
    dailyMealsRequired: 3741,
    distributionCenters: 8,
  },
  {
    id: "mumbai",
    name: "Mumbai", 
    coordinates: [19.0760, 72.8777],
    type: "moderate",
    familiesInNeed: 856,
    dailyMealsRequired: 2568,
    distributionCenters: 12,
  },
  {
    id: "bangalore",
    name: "Bangalore",
    coordinates: [12.9716, 77.5946],
    type: "center",
    familiesInNeed: 423,
    dailyMealsRequired: 1269,
    distributionCenters: 6,
  },
  {
    id: "chennai",
    name: "Chennai",
    coordinates: [13.0827, 80.2707],
    type: "program",
    familiesInNeed: 634,
    dailyMealsRequired: 1902,
    distributionCenters: 9,
  },
];
