"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Wallet, Users, ArrowLeft, Trash2, Share2 } from "lucide-react";
import { getTripById, deleteTrip } from "@/lib/firebase-service";
import type { Trip } from "@/lib/types";
import { formatDate, getStaticImage } from "@/lib/utils";
import Image from "next/image";

export default function TripDetails({ id }: { id: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTrip() {
      if (!user || !id) return;

      try {
        const tripData = await getTripById(user.uid, id);
        setTrip(tripData);
      } catch (error) {
        toast({
          title: "Failed to load trip",
          description: "Could not load the trip details. Please try again.",
          variant: "destructive",
        });
        router.push("/trips");
      } finally {
        setIsLoading(false);
      }
    }

    loadTrip();
  }, [user, id, toast, router]);

  const handleDeleteTrip = async () => {
    if (!user || !trip) return;

    if (!confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteTrip(user.uid, trip.id);
      toast({
        title: "Trip deleted",
        description: "Your trip has been deleted successfully.",
      });
      router.push("/trips");
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete the trip. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareTrip = async () => {
    if (!trip) return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Trip link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>Trip not found</CardTitle>
          <CardDescription>
            The trip you're looking for doesn't exist or you don't have permission to view it.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <a href="/trips">Back to My Trips</a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const destinationImage = trip.imageUrl || getStaticImage(trip.destination);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/trips")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Trips
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShareTrip}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="destructive" onClick={handleDeleteTrip}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{trip.destination}</CardTitle>
            <CardDescription>Created on {formatDate(trip.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-48 rounded-md overflow-hidden">
              <Image
                src={destinationImage}
                alt={trip.destination}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>{trip.duration} days</span>
              </div>
              <div className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="capitalize">{trip.budget}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="capitalize">{trip.travelerType}</span>
              </div>
            </div>
            {trip.preferences && (
              <div>
                <h3 className="font-medium mb-1">Preferences</h3>
                <p className="text-sm text-muted-foreground">{trip.preferences}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Itinerary</CardTitle>
            <CardDescription>
              Day-by-day plan for your {trip.duration}-day trip to {trip.destination}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="day-1">
              <TabsList className="mb-4 flex flex-wrap">
                {trip.itinerary.days.map((day, index) => (
                  <TabsTrigger key={index} value={`day-${index + 1}`}>
                    Day {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>

              {trip.itinerary.days.map((day, index) => (
                <TabsContent key={index} value={`day-${index + 1}`} className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl فرایندهای font-semibold">{day.title}</h3>
                    <p className="text-muted-foreground">{day.description}</p>
                  </div>

                  <div className="space-y-4">
                    {day.activities.map((activity, actIndex) => (
                      <Card key={actIndex}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative h-40 md:w-1/3 rounded-md overflow-hidden">
                              <Image
                                src={activity.imageUrl || getStaticImage(trip.destination)}
                                alt={activity.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="md:w-2/3 space-y-2">
                              <h4 className="font-semibold">{activity.name}</h4>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              {activity.time && (
                                <p className="text-sm">
                                  <span className="font-medium">Time:</span> {activity.time}
                                </p>
                              )}
                              {activity.cost && (
                                <p className="text-sm">
                                  <span className="font-medium">Cost:</span> {activity.cost}
                                </p>
                              )}
                              {activity.link && (
                                <Button variant="link" className="p-0 h-auto" asChild>
                                  <a href={activity.link} target="_blank" rel="noopener noreferrer">
                                    More Information
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {day.accommodation && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Accommodation</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative h-40 md:w-1/3 rounded-md overflow-hidden">
                              <Image
                                src={day.accommodation.imageUrl || getStaticImage(trip.destination)}
                                alt={day.accommodation.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="md:w-2/3 space-y-2">
                              <h4 className="font-semibold">{day.accommodation.name}</h4>
                              <p className="text-sm text-muted-foreground">{day.accommodation.description}</p>
                              {day.accommodation.cost && (
                                <p className="text-sm">
                                  <span className="font-medium">Cost:</span> {day.accommodation.cost}
                                </p>
                              )}
                              {day.accommodation.link && (
                                <Button variant="link" className="p-0 h-auto" asChild>
                                  <a href={day.accommodation.link} target="_blank" rel="noopener noreferrer">
                                    Book Now
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {day.transportation && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Transportation</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold">{day.transportation.mode}</h4>
                            <p className="text-sm text-muted-foreground">{day.transportation.description}</p>
                            <p className="text-sm">
                              <span className="font-medium">Cost:</span> {day.transportation.cost}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2">
            <h3 className="font-semibold">Estimated Total Cost</h3>
            <p className="text-muted-foreground">{trip.itinerary.estimatedCost}</p>

            {trip.itinerary.weatherNote && (
              <>
                <h3 className="font-semibold mt-2">Weather Note</h3>
                <p className="text-sm text-muted-foreground">{trip.itinerary.weatherNote}</p>
              </>
            )}

            {trip.itinerary.travelTips && (
              <>
                <h3 className="font-semibold mt-2">Travel Tips</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {trip.itinerary.travelTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}