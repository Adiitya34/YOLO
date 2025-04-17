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
import { Loader2, Calendar, Wallet, Users, X } from "lucide-react";
import { generateItinerary } from "@/lib/ai-service";
import { saveTrip } from "@/lib/firebase-service";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export default function TripForm() {
  const { user } = useAuth();
  const { destination } = useDestination();
  const { toast } = useToast();
  const router = useRouter();

  const [tripName, setTripName] = useState(""); // New: Trip name
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("moderate");
  const [travelerType, setTravelerType] = useState("solo");
  const [preferences, setPreferences] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination) {
      toast({
        title: "Destination Required",
        description: "Please select a destination first.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to generate an itinerary.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const itinerary = await generateItinerary({
        destination,
        duration,
        budget,
        travelerType,
        preferences,
      });

      const tripData = {
        userId: user.uid,
        name: tripName || `${destination} Trip`, // Default name if empty
        destination,
        duration,
        budget,
        travelerType,
        preferences,
        itinerary,
      };

      const tripId = await saveTrip(tripData);

      toast({
        title: "Itinerary Generated!",
        description: `${tripName || destination} trip is ready to view.`,
      });

      router.push(`/trips/${tripId}`);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate your itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setTripName("");
    setDuration(3);
    setBudget("moderate");
    setTravelerType("solo");
    setPreferences("");
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="max-w-2xl mx-auto my-12 relative"
    >
      <Card className="border-border/50 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50 p-6">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-3xl font-semibold text-foreground">
              Plan Your Adventure
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              {destination
                ? `Customize your trip to ${destination}`
                : "Start by selecting a destination"}
            </CardDescription>
          </motion.div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-8">
            {/* Trip Name */}
            <motion.div variants={itemVariants} className="space-y-3">
              <Label htmlFor="tripName" className="text-sm font-medium text-foreground">
                Trip Name
              </Label>
              <Input
                id="tripName"
                placeholder="e.g., My Goa Getaway"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                disabled={!destination || isGenerating}
                className="w-full rounded-md border border-input focus:ring-2 focus:ring-primary"
              />
            </motion.div>

            {/* Duration */}
            <motion.div variants={itemVariants} className="space-y-3">
              <Label
                htmlFor="duration"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <Calendar className="h-4 w-4 text-primary" />
                Trip Duration (days)
              </Label>
              <Input
                id="duration"
                type="number"
                min={1}
                max={30}
                value={duration}
                onChange={(e) => {
                  const value = e.target.value;
                  setDuration(value === "" || isNaN(Number(value)) ? 1 : Number.parseInt(value));
                }}
                disabled={!destination || isGenerating}
                className="w-full max-w-xs rounded-md border border-input focus:ring-2 focus:ring-primary"
                placeholder="e.g., 3"
              />
            </motion.div>

            {/* Budget */}
            <motion.div variants={itemVariants} className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Wallet className="h-4 w-4 text-primary" />
                Budget
              </Label>
              <RadioGroup
                value={budget}
                onValueChange={setBudget}
                disabled={!destination || isGenerating}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {["budget", "moderate", "luxury"].map((option) => (
                  <motion.div
                    key={option}
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="capitalize cursor-pointer">
                      {option}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </motion.div>

            {/* Traveler Type */}
            <motion.div variants={itemVariants} className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="h-4 w-4 text-primary" />
                Traveler Type
              </Label>
              <RadioGroup
                value={travelerType}
                onValueChange={setTravelerType}
                disabled={!destination || isGenerating}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {["solo", "couple", "family", "friends"].map((option) => (
                  <motion.div
                    key={option}
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="capitalize cursor-pointer">
                      {option}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </motion.div>

            {/* Preferences */}
            <motion.div variants={itemVariants} className="space-y-3">
              <Label
                htmlFor="preferences"
                className="text-sm font-medium text-foreground"
              >
                Additional Preferences
              </Label>
              <Textarea
                id="preferences"
                placeholder="e.g., adventure, culture, food, relaxation"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                disabled={!destination || isGenerating}
                className="min-h-[120px] rounded-md border border-input focus:ring-2 focus:ring-primary"
              />
            </motion.div>
          </CardContent>

          <CardFooter className="bg-muted/20 border-t border-border/50 p-6 flex justify-between items-center">
            <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isGenerating}
                className="px-6 py-2 text-sm font-medium rounded-md"
              >
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </motion.div>
            <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
              <Button
                type="submit"
                disabled={!destination || isGenerating}
                className="px-8 py-2 text-lg font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Create Itinerary"
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>

      {/* Progress Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}