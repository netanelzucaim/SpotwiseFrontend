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
The user described their business idea as: "${userDream}"

You have real estate listings with locations, nearby points of interest, and a score:
${JSON.stringify(enrichedListings, null, 2)}

Your task:
- Pick the best matching real estate and return its ID.
- Provide a short friendly description for the top match (max 4 sentences).
- Also include another option in 2–3 sentences each.
- When explaining why a location is good, include the specific names of any streets, buildings, stations, or landmarks (in both Hebrew and English if available).
- Output should have only two sections:
  1. description: <the formatted user-friendly content>
  2. id: <the _id of the top recommended real estate>
- Keep formatting clean and minimal, write the full address and do not write the ID in the description, also do not include the word score.

Format:

description:
🏆 Top Match:
<text>

✨ Another Option:
<text>

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
