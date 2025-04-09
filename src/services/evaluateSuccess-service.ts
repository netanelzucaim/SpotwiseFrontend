import { Business } from "./business_service";
import { RealEstate } from "./realestate-service";
import { HUGGING_API_KEY } from "../config";
import axios from "axios";

export interface EvaluationRequest {
  businessDescription: Business;
  realEstateDetails: RealEstate;
}

export interface EvaluationResponse {
  successRate: number;
  demographicsExplanation: string;
  competitionExplanation: string;
  locationExplanation: string;
}

async function getCoordinates(address: string): Promise<{ lat: number; lon: number; zip?: string }> {
  const response = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: address,
      format: "json",
      addressdetails: 1,
      limit: 1,
    },
  });

  if (response.data && response.data.length > 0) {
    const loc = response.data[0];
    const zip = loc.address?.postcode;
    return {
      lat: parseFloat(loc.lat),
      lon: parseFloat(loc.lon),
      zip,
    };
  }

  throw new Error("Could not get coordinates for address");
}

async function getNearbyBusinesses(lat: number, lon: number): Promise<string[]> {
  const radius = 500;
  const query = `
    [out:json];
    (
      node["shop"](around:${radius},${lat},${lon});
      node["amenity"](around:${radius},${lat},${lon});
    );
    out body;
  `;

  const response = await axios.post(
    "https://overpass-api.de/api/interpreter",
    query,
    { headers: { "Content-Type": "text/plain" } }
  );

  const elements = response.data?.elements || [];
  const businessNames = elements
    .map((el: any) => el.tags?.name)
    .filter((name: string) => name);

  return businessNames;
}

async function getCensusDemographics(zip: string): Promise<{ population?: string; income?: string }> {
  try {
    const response = await axios.get("https://api.census.gov/data/2019/acs/acs5", {
      params: {
        get: "B01003_001E,B19013_001E",
        for: `zip code tabulation area:${zip}`,
      },
    });

    const data = response.data;
    if (data && data.length > 1) {
      const [population, income] = data[1];
      return { population, income };
    }
  } catch (error) {
    console.warn("Census data not available:", error.message);
  }

  return {};
}

export async function evaluateProperty(
  requestData: EvaluationRequest
): Promise<EvaluationResponse> {
  const { businessDescription, realEstateDetails } = requestData;

  try {
    const coords = await getCoordinates(realEstateDetails.address);
    const nearbyBusinesses = await getNearbyBusinesses(coords.lat, coords.lon);
    const demographics = coords.zip ? await getCensusDemographics(coords.zip) : {};

    const prompt = `
    You are a senior business consultant evaluating a business's potential success at a specific real estate location.
    
    Base your evaluation on:
    - The business model
    - Nearby competition and existing businesses
    - Local demographics (population, income)
    
    Return your response using this exact format:
    
    Success Rate: XX%
    Explanation:
    1. Demographics: <One short sentence>
    2. Competition: <One short sentence>
    3. Location: <One short sentence>
    
    Avoid long responses or disclaimers. Be concise and use only one line per explanation point.
    
    ---
    
    Business Description:
    ${JSON.stringify(businessDescription, null, 2)}
    
    Real Estate Details:
    ${JSON.stringify(realEstateDetails, null, 2)}
    
    Nearby Businesses (500m radius):
    ${nearbyBusinesses.slice(0, 10).join(", ") || "None found"}
    
    Demographic Info:
    Population: ${demographics.population || "N/A"}
    Median Household Income: $${demographics.income || "N/A"}
    `;

    const modelId = "mistralai/Mistral-7B-Instruct-v0.1";
    const apiUrl = `https://api-inference.huggingface.co/models/${modelId}`;

    const response = await axios.post(
      apiUrl,
      { inputs: prompt },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUGGING_API_KEY}`,
        },
      }
    );

    const data = response.data;
    const generatedText: string =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : data.generated_text || "";

    const successRateMatch = generatedText.match(/Success Rate:\s*(\d{1,3})%/i);
    const explanationMatch = generatedText.match(/Explanation:\s*(.+)/is);

    const successRate = successRateMatch ? parseInt(successRateMatch[1], 10) : 0;
    const explanation = explanationMatch ? explanationMatch[1].trim() : "";

    let demographicsExplanation = "";
    let competitionExplanation = "";
    let locationExplanation = "";

    const lines = explanation
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => !!line);

    lines.forEach((line) => {
      if (line.toLowerCase().startsWith("1. demographics:")) {
        demographicsExplanation = line.replace(/^1\. Demographics:\s*/i, "");
      }
      if (line.toLowerCase().startsWith("2. competition:")) {
        competitionExplanation = line.replace(/^2\. Competition:\s*/i, "");
      }
      if (line.toLowerCase().startsWith("3. location:")) {
        locationExplanation = line.replace(/^3\. Location:\s*/i, "");
      }
    });

    return {
      successRate,
      demographicsExplanation,
      competitionExplanation,
      locationExplanation,
    };
  } catch (error: any) {
    console.error("Evaluation failed:", error.message);
    throw new Error(`Evaluation failed: ${error.message}`);
  }
}