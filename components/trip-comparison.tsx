"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { getUserTrips, getTripById } from "@/lib/firebase-service"
import type { Trip } from "@/lib/types"

export default function TripComparison() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([])
  const [comparisonTrips, setComparisonTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get trip IDs from URL if present
  useEffect(() => {
    const tripIds = searchParams.getAll("tripIds")
    if (tripIds.length > 0) {
      setSelectedTripIds(tripIds)
    }
  }, [searchParams])

  // Load all user trips
  useEffect(() => {
    async function loadTrips() {
      if (!user) return

      try {
        const userTrips = await getUserTrips(user.uid)
        setTrips(userTrips)
      } catch (error) {
        toast({
          title: "Failed to load trips",
          description: "Could not load your saved trips. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTrips()
  }, [user, toast])

  // Load selected trips for comparison
  useEffect(() => {
    async function loadComparisonTrips() {
      if (!user || selectedTripIds.length === 0) {
        setComparisonTrips([])
        return
      }

      try {
        const tripsData = await Promise.all(selectedTripIds.map((id) => getTripById(user.uid, id)))

        setComparisonTrips(tripsData.filter(Boolean))
      } catch (error) {
        toast({
          title: "Failed to load comparison",
          description: "Could not load the selected trips for comparison.",
          variant: "destructive",
        })
      }
    }

    loadComparisonTrips()
  }, [user, selectedTripIds, toast])

  const handleAddTrip = (tripId: string) => {
    if (selectedTripIds.includes(tripId)) return

    const newSelectedIds = [...selectedTripIds, tripId]
    setSelectedTripIds(newSelectedIds)

    // Update URL with selected trip IDs
    const params = new URLSearchParams()
    newSelectedIds.forEach((id) => params.append("tripIds", id))
    router.push(`/compare?${params.toString()}`)
  }

  const handleRemoveTrip = (tripId: string) => {
    const newSelectedIds = selectedTripIds.filter((id) => id !== tripId)
    setSelectedTripIds(newSelectedIds)

    // Update URL with selected trip IDs
    const params = new URLSearchParams()
    newSelectedIds.forEach((id) => params.append("tripIds", id))
    router.push(`/compare?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/trips")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Trips
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Trips to Compare</CardTitle>
          <CardDescription>Choose up to 3 trips to compare side by side</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select onValueChange={handleAddTrip} disabled={selectedTripIds.length >= 3 || trips.length === 0}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Add a trip to compare" />
              </SelectTrigger>
              <SelectContent>
                {trips
                  .filter((trip) => !selectedTripIds.includes(trip.id))
                  .map((trip) => (
                    <SelectItem key={trip.id} value={trip.id}>
                      {trip.destination} ({trip.duration} days)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {selectedTripIds.length === 0 && (
              <p className="text-muted-foreground">Select at least two trips to compare them</p>
            )}
          </div>
        </CardContent>
      </Card>

      {comparisonTrips.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-muted">Comparison</th>
                {comparisonTrips.map((trip) => (
                  <th key={trip.id} className="p-4 bg-muted">
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-bold">{trip.destination}</span>
                      <Button variant="outline" size="sm" onClick={() => handleRemoveTrip(trip.id)}>
                        Remove
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border">Duration</td>
                {comparisonTrips.map((trip) => (
                  <td key={trip.id} className="p-4 border text-center">
                    {trip.duration} days
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border">Budget</td>
                {comparisonTrips.map((trip) => (
                  <td key={trip.id} className="p-4 border text-center capitalize">
                    {trip.budget}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border">Traveler Type</td>
                {comparisonTrips.map((trip) => (
                  <td key={trip.id} className="p-4 border text-center capitalize">
                    {trip.travelerType}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border">Estimated Cost</td>
                {comparisonTrips.map((trip) => (
                  <td key={trip.id} className="p-4 border text-center">
                    {trip.itinerary.estimatedCost}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border">Number of Activities</td>
                {comparisonTrips.map((trip) => (
                  <td key={trip.id} className="p-4 border text-center">
                    {trip.itinerary.days.reduce((total, day) => total + day.activities.length, 0)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border">Actions</td>
                {comparisonTrips.map((trip) => (
                  <td key={trip.id} className="p-4 border text-center">
                    <Button asChild>
                      <a href={`/trips/${trip.id}`}>View Details</a>
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

