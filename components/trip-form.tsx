"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useDestination } from "@/lib/destination-context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Calendar, Wallet, Users } from "lucide-react";
import { generateItinerary } from "@/lib/ai-service";
import { saveTrip } from "@/lib/firebase-service";
import { motion } from "framer-motion";

export default function TripForm() {
  const { user } = useAuth();
  const { destination } = useDestination();
  const { toast } = useToast();
  const router = useRouter();

  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("moderate");
  const [travelerType, setTravelerType] = useState("solo");
  const [preferences, setPreferences] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination) {
      toast({
        title: "Destination required",
        description: "Please select a destination first",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to generate an itinerary",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate itinerary using AI
      const itinerary = await generateItinerary({
        destination,
        duration,
        budget,
        travelerType,
        preferences,
      });

      // Log the trip data before saving
      const tripData = {
        userId: user.uid,
        destination,
        duration,
        budget,
        travelerType,
        preferences,
        itinerary,
      };
      console.log("Trip data to save:", tripData);

      // Save trip to Firebase
      const tripId = await saveTrip(tripData);

      toast({
        title: "Itinerary generated!",
        description: "Your personalized trip plan is ready to view.",
      });

      // Navigate to the trip details page
      router.push(`/trips/${tripId}`);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate your itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="my-8 border-border/50 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50">
          <CardTitle className="text-2xl">Customize Your Trip</CardTitle>
          <CardDescription>
            {destination
              ? `Tell us more about your trip to ${destination}`
              : "First, select a destination above"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Trip Duration (days)
              </Label>
              <Input
                id="duration"
                type="number"
                min={1}
                max={30}
                value={duration}
                onChange={(e) => setDuration(Number.parseInt(e.target.value))}
                disabled={!destination || isGenerating}
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Label className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Budget
              </Label>
              <RadioGroup
                value={budget}
                onValueChange={setBudget}
                className="flex flex-col space-y-1"
                disabled={!destination || isGenerating}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="budget" id="budget" />
                  <Label htmlFor="budget">Budget</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Moderate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="luxury" id="luxury" />
                  <Label htmlFor="luxury">Luxury</Label>
                </div>
              </RadioGroup>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Traveler Type
              </Label>
              <RadioGroup
                value={travelerType}
                onValueChange={setTravelerType}
                className="flex flex-col space-y-1"
                disabled={!destination || isGenerating}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="solo" id="solo" />
                  <Label htmlFor="solo">Solo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="couple" id="couple" />
                  <Label htmlFor="couple">Couple</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="family" id="family" />
                  <Label htmlFor="family">Family</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friends" id="friends" />
                  <Label htmlFor="friends">Friends</Label>
                </div>
              </RadioGroup>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="preferences">Additional Preferences</Label>
              <Textarea
                id="preferences"
                placeholder="Tell us about your interests (e.g., adventure, culture, food, etc.)"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                disabled={!destination || isGenerating}
                className="min-h-[100px]"
              />
            </motion.div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border/50">
            <Button
              type="submit"
              className="w-full"
              disabled={!destination || isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Itinerary...
                </>
              ) : (
                "Generate Itinerary"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}