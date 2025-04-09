import { Business } from "./business_service";
import { RealEstate } from "./realestate-service";
import { HUGGING_API_KEY } from '../config';
import axios from 'axios';

export interface EvaluationRequest {
  businessDescription: Business;
  realEstateDetails: RealEstate;
}

export interface EvaluationResponse {
  successRate: number;
  explanation: string;
}

export async function evaluateProperty(
  requestData: EvaluationRequest
): Promise<EvaluationResponse> {
  const prompt = `
You are a senior business consultant.

Given the following:
Business Description:
${JSON.stringify(requestData.businessDescription, null, 2)}

Real Estate Details:
${JSON.stringify(requestData.realEstateDetails, null, 2)}

Evaluate the likelihood of this business succeeding at this location.
Provide your answer in this format:

Success Rate: XX%
Explanation: <Provide a detailed explanation of your reasoning, including any relevant factors or considerations that led to your conclusion.>
`;

  const modelId = 'mistralai/Mistral-7B-Instruct-v0.1';
  const apiUrl = `https://api-inference.huggingface.co/models/${modelId}`;

  try {
    const response = await axios.post(
      apiUrl,
      { inputs: prompt },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HUGGING_API_KEY}`,
        },
      }
    );

    const data = response.data;
    const generatedText: string =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : data.generated_text || '';

    const successRateMatch = generatedText.match(/Success Rate:\s*(\d{1,3})%/i);
    const explanationMatch = generatedText.match(/Explanation:\s*(.+)/i);

    const successRate = successRateMatch ? parseInt(successRateMatch[1], 10) : 0;
    let explanation = explanationMatch ? explanationMatch[1].trim() : "No explanation provided.";

    // Handle cases where the explanation is still the placeholder
    //if (explanation.includes("<Provide a detailed explanation")) {
    //  explanation = "The AI model did not provide a detailed explanation.";
   // }
explanation = generatedText
    return { successRate, explanation };
  } catch (error: any) {
    console.error('Error evaluating property:', error.response?.data || error.message);
    throw new Error(`Error evaluating property: ${error.response?.data?.error || error.message}`);
  }
}