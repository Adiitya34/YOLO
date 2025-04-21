"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Wallet, Users, Trash2, RefreshCw } from "lucide-react"
import { getUserTrips, deleteTrip } from "@/lib/firebase-service"
import type { Trip } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export default function SavedTrips() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTrips, setSelectedTrips] = useState<string[]>([])

  const loadTrips = useCallback(async () => {
    if (!user) return
    setIsLoading(true)

    try {
      const userTrips = await getUserTrips(user.uid)
      setTrips(userTrips)
    } catch {
      toast({
        title: "Failed to load trips",
        description: "Could not load your saved trips. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    loadTrips()
  }, [loadTrips])

  const handleDeleteTrip = async (tripId: string) => {
    if (!user) return

    try {
      await deleteTrip(user.uid, tripId)
      setTrips((prev) => prev.filter((trip) => trip.id !== tripId))
      setSelectedTrips((prev) => prev.filter((id) => id !== tripId))

      toast({
        title: "Trip deleted",
        description: "Your trip has been deleted successfully.",
      })
    } catch {
      toast({
        title: "Delete failed",
        description: "Could not delete the trip. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSelectTrip = (tripId: string) => {
    setSelectedTrips((prev) =>
      prev.includes(tripId) ? prev.filter((id) => id !== tripId) : [...prev, tripId]
    )
  }

  const handleCompareTrips = () => {
    if (selectedTrips.length < 2) {
      toast({
        title: "Select at least two trips",
        description: "Please select at least two trips to compare.",
        variant: "destructive",
      })
      return
    }

    const queryString = selectedTrips.map((id) => `tripIds=${id}`).join("&")
    window.location.href = `/compare?${queryString}`
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>No trips saved yet</CardTitle>
          <CardDescription>Plan your first trip to get started</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/">Plan a Trip</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        {selectedTrips.length > 0 ? (
          <div className="flex items-center gap-4">
            <p>{selectedTrips.length} trips selected</p>
            <Button variant="outline" onClick={() => setSelectedTrips([])}>
              Clear Selection
            </Button>
            <Button onClick={handleCompareTrips}>Compare Selected</Button>
          </div>
        ) : (
          <div />
        )}

        <Button variant="outline" onClick={loadTrips} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Trips
        </Button>
      </div>

      {/* Trip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <Card key={trip.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedTrips.includes(trip.id)}
                    onCheckedChange={() => handleSelectTrip(trip.id)}
                    id={`select-${trip.id}`}
                  />
                  <CardTitle className="text-xl">{trip.destination}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTrip(trip.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete trip</span>
                </Button>
              </div>
              <CardDescription>Created on {formatDate(trip.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{trip.duration} days</span>
                </div>
                <div className="flex items-center text-sm">
                  <Wallet className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{trip.budget}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{trip.travelerType}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/trips/${trip.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
