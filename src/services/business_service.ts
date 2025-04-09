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
    async getCurrentUserBusiness(): Promise<Business> {
      const ownerId = localStorage.getItem("userId"); 
      if (!ownerId) {
        throw new Error("User ID not found in local storage.");
      }
      const response = await apiClient.get<Business[]>(`/business?owner=${ownerId}`);
      return response.data[0];
    }  
  };

export default BusinessService;