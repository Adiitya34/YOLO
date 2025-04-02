import * as dotenv from "dotenv";
dotenv.config();

import type { ItineraryParams, Itinerary } from "./types";

export async function generateItinerary(params: ItineraryParams): Promise<Itinerary> {
  const { destination, duration, budget, travelerType, preferences } = params;

  // Create a detailed prompt for the AI
  const prompt = `
    Create a detailed ${duration}-day travel itinerary for a trip to ${destination}, India.
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
              "imageUrl": "A valid Unsplash URL (e.g., https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80) specifically matching this activity in ${destination}—do not use placeholders like 'URL to an image'",
              "link": "Optional booking or info URL"
            }
          ],
          "accommodation": {
            "name": "Specific hotel or stay in ${destination}",
            "description": "Brief description of the accommodation",
            "cost": "Cost per night in ₹",
            "imageUrl": "A valid Unsplash URL (e.g., https://images.unsplash.com/photo-1519999482648-250c296e18c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80) specifically matching this accommodation in ${destination}—do not use placeholders like 'URL to an image'",
            "link": "Booking URL"
          }
        }
      ],
      "estimatedCost": "Total estimated cost in ₹ for the trip",
      "travelTips": ["Tip 1 specific to ${destination}", "Tip 2", "Tip 3"]
    }
    
    Include authentic Indian experiences, local cuisine, cultural activities, and practical information specific to ${destination}. For each activity and accommodation, provide realistic names, descriptions, and approximate costs in Indian Rupees (₹). For "imageUrl" fields, include specific Unsplash URLs that visually represent the activity or accommodation in ${destination} (e.g., search Unsplash for "${destination} culture", "${destination} landmark", or "${destination} hotel" and use the exact URL). All fields are required except "time", "cost", and "link" in activities, and "cost" and "link" in accommodation, which are optional. Return only the JSON object, with no additional text, comments, or markdown.
  `;

  try {
    // Get the API key from environment variables
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    console.log("API Key loaded:", apiKey ? "Yes" : "No"); // Debug log

    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY environment variable is not set");
    }

    // Call the Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const data = await response.json();

    // Extract the text from the response
    const text = data.candidates[0].content.parts[0].text;
    console.log("Raw API response text:", text); // Log raw response for debugging

    // Attempt to find and extract valid JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;
    console.log("Extracted JSON text:", jsonText); // Log extracted JSON

    // Parse the JSON response
    let itinerary: Itinerary;
    try {
      itinerary = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON parsing failed. Attempting to fix unquoted keys:", parseError);
      const fixedJsonText = jsonText.replace(/(\w+)(?=\s*:)/g, '"$1"');
      console.log("Fixed JSON text:", fixedJsonText);
      itinerary = JSON.parse(fixedJsonText);
    }

    // Post-process to ensure valid image URLs
    itinerary.days.forEach((day) => {
      day.activities.forEach((activity) => {
        if (!activity.imageUrl || activity.imageUrl === "URL to an image") {
          activity.imageUrl = `https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
          console.log(`Replaced activity imageUrl for ${activity.name} with fallback`);
        }
      });

      if (day.accommodation && (!day.accommodation.imageUrl || day.accommodation.imageUrl === "URL to an image")) {
        day.accommodation.imageUrl = `https://images.unsplash.com/photo-1519999482648-250c296e18c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
        console.log(`Replaced accommodation imageUrl for ${day.accommodation.name} with fallback`);
      }
    });

    return itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}