// Trip types
export type Trip = {
  id: string
  userId: string
  destination: string
  duration: number
  budget: string
  travelerType: string
  preferences: string
  itinerary: Itinerary
  createdAt: string
}

export type ItineraryParams = {
  destination: string
  duration: number
  budget: string
  travelerType: string
  preferences: string
}

// Itinerary types
export type Itinerary = {
  days: ItineraryDay[]
  estimatedCost: string
  travelTips: string[]
}

export type ItineraryDay = {
  title: string
  description: string
  activities: Activity[]
  accommodation?: Accommodation
}

export type Activity = {
  name: string
  description: string
  time?: string
  cost?: string
  imageUrl?: string
  link?: string
}

export type Accommodation = {
  name: string
  description: string
  cost?: string
  imageUrl?: string
  link?: string
}

