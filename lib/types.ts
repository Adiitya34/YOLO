import { Timestamp } from "firebase/firestore";

// Trip types
export type Trip = {
  id: string;
  userId: string;
  destination: string;
  duration: number;
  budget: string;
  travelerType: string;
  preferences: string;
  itinerary: Itinerary;
  createdAt: string | Timestamp; // Allow both string and Timestamp
};

export type ItineraryParams = {
  destination: string;
  duration: number;
  budget: string;
  travelerType: string;
  preferences?: string; // Made optional to match earlier usage
};

// Itinerary types
export type Itinerary = {
  destination: string; // Added to match enhanced prompt
  duration: number; // Added for consistency
  budget: string; // Added for consistency
  travelerType: string; // Added for consistency
  days: ItineraryDay[];
  estimatedCost: string; // Kept your original field name
  travelTips: string[];
  weatherNote: string; // Added from enhanced prompt
};

export type ItineraryDay = {
  dayNumber: number; // Added for explicit day tracking
  title: string;
  description: string;
  activities: Activity[];
  accommodation?: Accommodation; // Kept optional as in your original
  transportation?: Transportation; // Added for new feature
};

export type Activity = {
  name: string;
  description: string;
  time?: string;
  cost?: string;
  imageUrl?: string; // Kept optional as in your original
  link?: string;
};

export type Accommodation = {
  name: string;
  description: string;
  cost?: string;
  imageUrl?: string; // Kept optional as in your original
  link?: string;
};

export type Transportation = {
  mode: string; // e.g., "Auto-rickshaw", "Rental Car"
  description: string;
  cost: string; // Changed to string to match other cost fields
};