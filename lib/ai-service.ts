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
          "title": "Day 1: [Title]",
          "description": "Overview of the day",
          "activities": [
            {
              "name": "Activity name",
              "description": "Activity description",
              "time": "Time of day",
              "cost": "Estimated cost",
              "imageUrl": "URL to an image",
              "link": "Optional booking or information link"
            }
          ],
          "accommodation": {
            "name": "Hotel or accommodation name",
            "description": "Brief description",
            "cost": "Cost per night",
            "imageUrl": "URL to an image",
            "link": "Booking link"
          }
        }
      ],
      "estimatedCost": "Total estimated cost for the trip",
      "travelTips": ["Tip 1", "Tip 2", "Tip 3"]
    }
    
    Include authentic Indian experiences, local cuisine, cultural activities, and practical information. For each activity and accommodation, provide realistic names, descriptions, and approximate costs in Indian Rupees (₹). Return only the JSON object, with no additional text, comments, or markdown.
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
      // Attempt to fix unquoted property names (e.g., days: -> "days":)
      const fixedJsonText = jsonText.replace(/(\w+)(?=\s*:)/g, '"$1"');
      console.log("Fixed JSON text:", fixedJsonText);
      itinerary = JSON.parse(fixedJsonText);
    }

    return itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}