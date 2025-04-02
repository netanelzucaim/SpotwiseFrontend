import apiClient from "./api-client";

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
      const response = await apiClient.post<Business>("/business", businessData);
      return response.data;
    },
  };

export default BusinessService;