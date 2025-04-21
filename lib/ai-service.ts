import type { ItineraryParams, Itinerary } from "./types";

const PLACEHOLDER_IMAGE = "/placeholder.jpg";

async function isValidImageUrl(url: string): Promise<boolean> {
  if (!url || url === PLACEHOLDER_IMAGE) return false;
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    return response.ok && !!contentType && contentType.includes("image");
  } catch {
    return false;
  }
}

export async function getUnsplashImage(query: string): Promise<string> {
  const UNSPLASH_API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY || "";
  console.log("UNSPLASH_API_KEY:", UNSPLASH_API_KEY); // Debug
  if (!UNSPLASH_API_KEY) {
    console.warn("Unsplash API key not set, falling back to placeholder.");
    return PLACEHOLDER_IMAGE;
  }
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&client_id=${UNSPLASH_API_KEY}&per_page=1`
    );
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }
    const data = await response.json();
    const imageUrl = data.results[0]?.urls?.regular;
    return (await isValidImageUrl(imageUrl)) ? imageUrl : PLACEHOLDER_IMAGE;
  } catch (error) {
    console.error(`Error fetching Unsplash image for query "${query}":`, error);
    return PLACEHOLDER_IMAGE;
  }
}

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
      "destination": "${destination}",
      "duration": ${duration},
      "budget": "${budget}",
      "travelerType": "${travelerType}",
      "imageUrl": "A valid, publicly accessible URL for a high-quality image of ${destination} from Unsplash or Pexels",
      "days": [
        {
          "dayNumber": 1,
          "title": "Day 1: [Specific Title for ${destination}]",
          "description": "Overview of the day including highlights in ${destination}",
          "activities": [
            {
              "name": "Specific activity in ${destination}",
              "description": "Detailed description of the activity",
              "time": "Time of day (e.g., Morning, Afternoon)",
              "cost": "Estimated cost in ₹",
              "imageUrl": "A valid, publicly accessible URL for a high-quality image of this activity in ${destination} from Unsplash or Pexels",
              "link": "Optional booking or info URL"
            }
          ],
          "accommodation": {
            "name": "Specific hotel or stay in ${destination}",
            "description": "Brief description of the accommodation",
            "cost": "Cost per night in ₹",
            "imageUrl": "A valid, publicly accessible URL for a high-quality image of this accommodation in ${destination} from Unsplash or Pexels",
            "link": "Booking URL"
          }
        }
      ],
      "estimatedCost": "Total estimated cost in ₹ for the entire trip",
      "travelTips": ["Tip 1 specific to ${destination}", "Tip 2", "Tip 3"],
      "weatherNote": "Brief note on expected weather in ${destination} during the trip"
    }

    Ensure that:
    - There are exactly ${duration} days in the itinerary.
    - Each day has at least 3 activities.
    - All fields are populated with realistic data specific to ${destination}.
    - imageUrl fields for destination, activities, and accommodation MUST contain valid, publicly accessible URLs from Unsplash or Pexels that return HTTP 200 status.
    - Do NOT use empty strings ("") for imageUrl fields; provide a valid URL.
    - Do NOT return invalid, broken, or inaccessible image URLs.
    - Return only the JSON object, without additional text, markdown, or code fences.
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
    console.log("Raw API Response:", rawText);

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    let jsonText = jsonMatch ? jsonMatch[0] : rawText;
    console.log("Extracted JSON Text:", jsonText);

    let itinerary: Itinerary;
    try {
      itinerary = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Initial JSON parsing failed:", parseError);
      jsonText = jsonText
        .replace(/(\w+)(?=\s*:)/g, '"$1"')
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

    if (itinerary.days.length !== duration) {
      console.warn(`Generated itinerary has ${itinerary.days.length} days instead of ${duration}.`);
    }

    if (!itinerary.imageUrl || !(await isValidImageUrl(itinerary.imageUrl))) {
      itinerary.imageUrl = await getUnsplashImage(destination);
      console.log(`Set destination image for ${destination}: ${itinerary.imageUrl}`);
    }

    for (const day of itinerary.days) {
      day.dayNumber = day.dayNumber || itinerary.days.indexOf(day) + 1;

      for (const activity of day.activities) {
        if (!activity.imageUrl || !(await isValidImageUrl(activity.imageUrl))) {
          activity.imageUrl = await getUnsplashImage(`${activity.name} ${destination}`);
          console.log(`Set image for activity: ${activity.name}: ${activity.imageUrl}`);
        }
      }

      if (
        day.accommodation &&
        (!day.accommodation.imageUrl || !(await isValidImageUrl(day.accommodation.imageUrl)))
      ) {
        day.accommodation.imageUrl = await getUnsplashImage(`${day.accommodation.name} ${destination}`);
        console.log(`Set image for accommodation: ${day.accommodation.name}: ${day.accommodation.imageUrl}`);
      }
    }

    return itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}