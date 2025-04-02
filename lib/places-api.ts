// This is a mock implementation for the Google Places API
// In a real application, you would use the actual Google Places API

import { indiaDestinations } from "./sample-data"

export async function searchPlaces(query: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter destinations based on query
  const results = indiaDestinations.filter((place) => place.name.toLowerCase().includes(query.toLowerCase()))

  return results
}

