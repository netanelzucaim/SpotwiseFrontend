import axios from "axios";
import fetchNearbyAmenities from "./location-analytics-service";
import MapService from "./map-service";
import { GEMINI_API_KEY } from "../config";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const GeminiService = {
  async analyzeDream(dream: string, realEstateData: any[]): Promise<{ recommendationText: string; listingId: string | null; prompt: string | null }> {
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is undefined");
      return { recommendationText: "API key missing.", listingId: null };
    }

    try {
      const prompt = await buildPrompt(dream, realEstateData);
      const response = await axios.post(
        `${API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        !response.data.candidates ||
        !response.data.candidates[0] ||
        !response.data.candidates[0].content ||
        !response.data.candidates[0].content.parts ||
        !response.data.candidates[0].content.parts[0]
      ) {
        throw new Error("Unexpected response structure from Gemini API");
      }

      const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const idMatch = rawText.match(/id:\s*(.*)/);
      const descMatch = rawText.match(/description:\s*([\s\S]*?)\nid:/);

      const extractedId = idMatch ? idMatch[1].trim() : null;
      const descriptionText = descMatch ? descMatch[1].trim() : response;

      return {
        recommendationText: descriptionText,
        listingId: extractedId,
        prompt: prompt
      };
    } catch (error: any) {
      return {
        recommendationText: handleGeminiApiError(error),
        listingId: null,
        prompt: null
      };
    }
  },
};

const buildPrompt = async (userDream: string, realEstateData: any[]) => {
  const enrichedListings = await Promise.all(
    realEstateData.map(async (listing) => {
      const coords = await MapService.getLatLonForAddress(
        `${listing.address}, ${listing.city}`
      );
      const amenities = coords
        ? await fetchNearbyAmenities(coords.lat, coords.lon)
        : [];
      return {
        ...listing,
        nearby: amenities.map(a => a.name).join(', '),
        score: amenities.length,
      };
    })
  );

  const prompt = `
The user is looking for a real estate property for their business. Here's what they described:

"${userDream}"

You have a list of real estate listings with the following details:
- Full address and city
- Square meters (area)
- Nearby points of interest (amenities like restaurants, malls, public transport)
- A score based on how relevant those amenities are to the business

Here is the data:
${JSON.stringify(enrichedListings, null, 2)}

Your task:
- Choose the **best matching listing** for the business based on the user's description and available data.
- Explain why this property is a great fit in a clear and friendly tone (no more than 4 sentences).
- Mention any relevant landmarks or POIs (e.g., street names, malls, train stations) — include **both Hebrew and English names** if available.
- Don't mention the ID or internal data in the description. Focus on clarity and persuasion.

Output structure:
1. description: <a short user-friendly explanation>
2. id: <the _id of the top recommended real estate>

Format:

description:
🏆 Top Match:
<your explanation here>

id:
<topRealEstateId>
`;

  return prompt;
};

const handleGeminiApiError = (error: any): string => {
  console.error("Gemini API Error:", error);
  if (error.response) {
    switch (error.response.status) {
      case 400:
        console.error(
          "Bad Request. Please check the request payload and API key."
        );
        return "Bad Request. Please check the request payload and API key.";
      case 429:
        console.error("Rate limit exceeded. Please try again later.");
        return "Rate limit exceeded. Please try again later.";
      case 403:
        console.error("Quota exceeded or insufficient permissions.");
        return "Quota exceeded or insufficient permissions.";
      default:
        console.error(`Unexpected error: ${error.response.status}`);
        return `Unexpected error: ${error.response.status}`;
    }
  } else if (error.message) {
    console.error("Error Message:", error.message);
    return `Error: ${error.message}`;
  } else {
    return "An unknown error occurred while processing your request.";
  }
};

export default GeminiService;
