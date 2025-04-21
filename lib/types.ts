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
  createdAt: string | Timestamp;
  imageUrl?: string; // Add for destination image
};

export type ItineraryParams = {
  destination: string;
  duration: number;
  budget: string;
  travelerType: string;
  preferences?: string;
};

// Itinerary types
export type Itinerary = {
  destination: string;
  duration: number;
  budget: string;
  travelerType: string;
  days: ItineraryDay[];
  estimatedCost: string;
  travelTips: string[];
  weatherNote: string;
  imageUrl?: string; // Add for destination image
};

export type ItineraryDay = {
  dayNumber: number;
  title: string;
  description: string;
  activities: Activity[];
  accommodation?: Accommodation;
  transportation?: Transportation;
};

export type Activity = {
  name: string;
  description: string;
  time?: string;
  cost?: string;
  imageUrl?: string;
  link?: string;
};

export type Accommodation = {
  name: string;
  description: string;
  cost?: string;
  imageUrl?: string;
  link?: string;
};

export type Transportation = {
  mode: string;
  description: string;
  cost: string;
};