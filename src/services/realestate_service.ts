import apiClient from './api-client';

interface RealEstate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  location: string;
  _id: string;
}

const RealEstateService = {
  async getAll(): Promise<RealEstate[]> {
    const response = await apiClient.get<RealEstate[]>('/realestate');
    return response.data;
  },
};

export default RealEstateService;