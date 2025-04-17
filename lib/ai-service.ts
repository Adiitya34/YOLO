import * as dotenv from "dotenv";
dotenv.config();

import type { ItineraryParams, Itinerary } from "./types";

// Define a placeholder/loading animation URL (can be a GIF or static image)
const PLACEHOLDER_IMAGE = "https://media.giphy.com/media/3o7 bu3XilJ5BOiSGic/giphy.gif"; // Generic loading animation
// Alternative: Static placeholder
// const PLACEHOLDER_IMAGE = "https://via.placeholder.com/800x400.png?text=Loading+Travel+Destination";

export async function generateItinerary(params: ItineraryParams): Promise<Itinerary> {
  const { destination, duration, budget, travelerType, preferences } = params;

  const prompt = `
    Create a detailed travel itinerary for a ${duration}-day trip to ${destination}, India.
    The itinerary must have exactly ${duration} days, each with a title, description, at least 3 activities, and accommodation.
    Budget level: ${budget}
    Traveler type: ${travelerType}
    Preferences: ${preferences || "No specific preferences"}

    Format the response as a JSON object with the following structure:
    {
      "days": [
        {
          "title": "Day 1: [Specific Title for ${destination}]",
          "description": "Overview of the day including highlights in ${destination}",
          "activities": [
            {
              "name": "Specific activity in ${destination}",
              "description": "Detailed description of the activity",
              "time": "Time of day (e.g., Morning, Afternoon)",
              "cost": "Estimated cost in ₹",
              "imageUrl": "A valid URL for an image of this activity in ${destination}, or leave empty",
              "link": "Optional booking or info URL"
            }
          ],
          "accommodation": {
            "name": "Specific hotel or stay in ${destination}",
            "description": "Brief description of the accommodation",
            "cost": "Cost per night in ₹",
            "imageUrl": "A valid URL for an image of this accommodation in ${destination}, or leave empty",
            "link": "Booking URL"
          }
        }
      ],
      "estimatedCost": "Total estimated cost in ₹ for the entire trip",
      "travelTips": ["Tip 1 specific to ${destination}", "Tip 2", "Tip 3"]
    }

    Ensure that:
    - There are exactly ${duration} days in the itinerary.
    - Each day has at least 3 activities.
    - All fields are populated with realistic data specific to ${destination}.
    - Return only the JSON object.
  `;

  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY environment variable is not set");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    console.log("Raw API Response:", rawText); // Log raw response for debugging

    // Extract JSON more robustly
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    let jsonText = jsonMatch ? jsonMatch[0] : rawText;
    console.log("Extracted JSON Text:", jsonText); // Log extracted JSON

    // Attempt to parse JSON, with fallback fixes
    let itinerary: Itinerary;
    try {
      itinerary = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Initial JSON parsing failed:", parseError);

      // Fix common JSON issues: unquoted keys, trailing commas, incomplete objects
      jsonText = jsonText
        .replace(/(\w+)(?=\s*:)/g, '"$1"') // Quote unquoted keys
        .replace(/,\s*}/g, "}") 
        .replace(/,\s*]/g, "]"); 

      console.log("Fixed JSON Text:", jsonText);

      try {
        itinerary = JSON.parse(jsonText);
      } catch (secondParseError) {
        console.error("Second JSON parsing attempt failed:", secondParseError);
        throw new Error("Unable to parse API response as valid JSON.");
      }
    }

    // Validate the itinerary
    if (itinerary.days.length !== duration) {
      console.warn(`Generated itinerary has ${itinerary.days.length} days instead of ${duration}.`);
    }

    // Ensure placeholder image URLs
    itinerary.days.forEach((day) => {
      day.activities.forEach((activity) => {
        // Use placeholder if imageUrl is missing or invalid
        if (!activity.imageUrl || activity.imageUrl === "" || activity.imageUrl.includes("placeholder")) {
          activity.imageUrl = PLACEHOLDER_IMAGE;
          console.log(`Set placeholder image for activity: ${activity.name}`);
        }
      });
      if (day.accommodation && (!day.accommodation.imageUrl || day.accommodation.imageUrl === "" || day.accommodation.imageUrl.includes("placeholder"))) {
        day.accommodation.imageUrl = PLACEHOLDER_IMAGE;
        console.log(`Set placeholder image for accommodation: ${day.accommodation.name}`);
      }
    });

    return itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}