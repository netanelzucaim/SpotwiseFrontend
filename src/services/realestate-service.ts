import apiClient from './api-client';

export interface RealEstate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  location: string;
  _id?: string;
}

const RealEstateService = {
  async getAll(): Promise<RealEstate[]> {
    const response = await apiClient.get<RealEstate[]>('/realestate');
    return response.data;
  },
  async create(realEstateData: RealEstate): Promise<RealEstate> {
    const response = await apiClient.post<RealEstate>("/realestate", realEstateData);
    return response.data;
  },
};

export default RealEstateService;