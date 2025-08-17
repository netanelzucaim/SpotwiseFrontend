import { Business } from "./business_service";
import { RealEstate } from "./realestate-service";
import { HUGGING_API_KEY } from "../config";
import MapService from "./map-service";
import BusinessService from "./business_service";
import DemographicsService from "./demographics-service";

export interface EvaluationRequest {
  businessDescription: Business;
  realEstateDetails: RealEstate;
}

export interface EvaluationResponse {
  cleanText: string;
}

export async function evaluateProperty(
  requestData: EvaluationRequest
): Promise<EvaluationResponse> {
  const { businessDescription, realEstateDetails } = requestData;

  try {
    const coords = await MapService.getLatLonForAddress(realEstateDetails.address);
    if (!coords.lat || !coords.lon) {
      throw new Error("Unable to retrieve coordinates for the given address.");
    }

    const nearbyBusinesses = await BusinessService.getNearbyBusinesses(coords.lat, coords.lon);
    if (!nearbyBusinesses || nearbyBusinesses.length === 0) {
      console.warn("No nearby businesses found.");
    }

    const demographics = coords.zip
      ? await DemographicsService.getCensusDemographics(coords.zip)
      : {};
    if (!demographics.population || !demographics.income) {
      console.warn("Demographic data is incomplete or unavailable.");
    }

    const prompt = buildPrompt(businessDescription, realEstateDetails, nearbyBusinesses, demographics);

    const response = await callHuggingFaceAPI(prompt);

    return parseEvaluationResponse(response);
  } catch (error: any) {
    console.error("Evaluation failed:", error.message);
    throw new Error(`Evaluation failed: ${error.message}`);
  }
}

function buildPrompt(
  businessDescription: Business,
  realEstateDetails: RealEstate,
  nearbyBusinesses: string[],
  demographics: { population?: string; income?: string }
): string {
  return `
You are a senior business consultant. You will evaluate the potential success of a business at a given location.

### Instructions:
Use the business info, real estate data, nearby businesses, and demographics to assess viability.

Respond ONLY using the following exact format:
---
Success Rate: <a number between 0 and 100>%
Explanation:
- Reason: <One Short sentence explaining the reason behind the chosen success rate, write it in a professional tone>
- Demographics: <One short sentence>
- Competition: <One short sentence>
- Location: <One short sentence>

### Business:
${JSON.stringify(businessDescription, null, 2)}

### Real Estate:
${JSON.stringify(realEstateDetails, null, 2)}

### Nearby Businesses:
${nearbyBusinesses.slice(0, 10).join(", ") || "None"}

### Demographics:
Population: ${demographics.population || "N/A"}
Median Income: $${demographics.income || "N/A"}

Please provide only the structured answer in the requested format.
`;
}



async function callHuggingFaceAPI(prompt: string): Promise<string> {
  const apiUrl = "https://router.huggingface.co/v1/chat/completions";
  const model = "deepseek-ai/DeepSeek-R1:novita";
  const headers = {
    Authorization: `Bearer ${HUGGING_API_KEY}`,
    "Content-Type": "application/json",
  };
  const payload = {
    messages: [
      {
        role: "user",
        content: prompt, 
      },
    ],
    model,

  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (
      result.choices &&
      result.choices[0] &&
      result.choices[0].message &&
      typeof result.choices[0].message.content === "string"
    ) {
      return result.choices[0].message.content;
    } else {
      throw new Error("No valid response from Hugging Face API.");
    }
  } catch (error: any) {
    console.error("Error calling Hugging Face API:", error.message || error);
    throw new Error("Failed to retrieve response from Hugging Face API.");
  }
}


function parseEvaluationResponse(generatedText: string): EvaluationResponse {

  const structuredStart = generatedText.lastIndexOf("Success Rate:");
  const cleanText = structuredStart !== -1
    ? generatedText.slice(structuredStart)
    : "Could't evaluate success";

  return {cleanText};
}
