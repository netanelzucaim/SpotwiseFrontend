import {apiClient} from "./api-client";
import axios from "axios";

export interface Business {
  _id?: string;
  name: string;
  logo: string;
  owner: string;
  siteUrl: string;
  category: string;
  description: string;
}
const BusinessService = {
  async create(businessData: Business): Promise<Business> {
    const response = await apiClient.auth.post<Business>("/business", businessData);
    return response.data;
  },
  async getCurrentUserBusiness(): Promise<Business> {
    const ownerId = localStorage.getItem("userId");
    if (!ownerId) {
      throw new Error("User ID not found in local storage.");
    }
    const response = await apiClient.noauth.get<Business[]>(`/business?owner=${ownerId}`);
    return response.data[0];
  },

  async getNearbyBusinesses(lat: number, lon: number): Promise<string[]> {
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
};

export default BusinessService;