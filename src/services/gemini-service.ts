import axios from 'axios';
import fetchNearbyAmenities from './location-analytics-service';
import MapService from './map-service';
import { GEMINI_API_KEY } from '../config';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const GeminiService = {
  async analyzeDream(dream: string, realEstateData: any[]): Promise<string> {
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is undefined");
      return "API key is missing. Please check your configuration.";
    }

    try {
      const prompt = await buildPrompt(dream, realEstateData)
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
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content || !response.data.candidates[0].content.parts || !response.data.candidates[0].content.parts[0]) {
        throw new Error("Unexpected response structure from Gemini API");
      }

      const text = response.data.candidates[0].content.parts[0].text;
      return text;

    } catch (error: any) {
      return handleGeminiApiError(error);
    }
  },
};

const buildPrompt = async (userDream: string, realEstateData: any[]) =>{
  const enrichedListings = await Promise.all(
    realEstateData.map(async (listing) => {
      const coords = await MapService.getLatLonForAddress(`${listing.address}, ${listing.city}`);
      const amenities = coords ? await fetchNearbyAmenities(coords.lat, coords.lon) : [];
      return {
        ...listing,
        nearby: amenities,
        score: amenities.length,
      };
    })
  );

  const prompt = `
The user described their business idea as: "${userDream}"

You have real estate listings with locations, nearby points of interest, and a score:
${JSON.stringify(enrichedListings, null, 2)}

Your task:
- Recommend one best location, in the location write all the address.
- Describe it in a friendly, short paragraph (max 3 sentences).
- Add two runner-up options, each in 1–2 sentences.
- Avoid any IDs, raw data, or JSON format.
- Keep the writing clean, simple, and readable for a user.

Format your answer like this:

🏆 Top Match:
<short paragraph>

✨ Option 1:
<short paragraph>

✨ Option 2:
<short paragraph>
`;

  return prompt;
}

const handleGeminiApiError = (error: any): string => {
  console.error('Gemini API Error:', error);
  if (error.response) {
    switch (error.response.status) {
      case 400:
        console.error("Bad Request. Please check the request payload and API key.");
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