import {apiClient} from './api-client';

export interface RealEstate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  price: number;
  _id?: string;
}

const RealEstateService = {
  async getAll(): Promise<RealEstate[]> {
    const response = await apiClient.auth.get<RealEstate[]>('/realestate');
    return response.data;
  },
  async create(realEstateData: RealEstate): Promise<RealEstate> {
    const response = await apiClient.auth.post<RealEstate>("/realestate", realEstateData);
    return response.data;
  },
  async update(id: string, realEstateData: RealEstate): Promise<RealEstate> {
  const response = await apiClient.auth.put<RealEstate>(`/realestate/${id}`, realEstateData);
  return response.data;
}
};

export default RealEstateService;
