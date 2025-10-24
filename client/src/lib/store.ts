import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  role:
    | "ngo"
    | "volunteer"
    | "donor"
    | "educator"
    | "community"
    | "fieldworker"
    | "admin";
  email: string;
  organization?: string;
  skills?: string[];
  location?: string;
  joinedDate: Date;
}

interface AppState {
  user: User | null;
  currentView: string;
  selectedLocation: any;
  showMobileMenu: boolean;
  setUser: (user: User | null) => void;
  setCurrentView: (view: string) => void;
  setSelectedLocation: (location: any) => void;
  setShowMobileMenu: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  currentView: "landing",
  selectedLocation: null,
  showMobileMenu: false,
  setUser: (user) => set({ user }),
  setCurrentView: (currentView) => set({ currentView }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setShowMobileMenu: (showMobileMenu) => set({ showMobileMenu }),
}));
