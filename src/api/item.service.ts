import axiosInstance from './axios';

export interface ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  attributes: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  attributes: Record<string, string>;
}

export class ItemService {
  private static readonly ITEM_URL = '/items';

  static async getAll(): Promise<ProductResponseDto[]> {
    const response = await axiosInstance.get(this.ITEM_URL);
    return response.data;
  }

  static async create(item: CreateItemRequest): Promise<ProductResponseDto> {
    const response = await axiosInstance.post(this.ITEM_URL, item);
    return response.data;
  }
}
