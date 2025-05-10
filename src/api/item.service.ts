import axiosInstance from './axios'

export class ItemService {
  private static readonly ITEM_URL = '/items'
  
  static async getAll(): Promise<any>{
    const response = await axiosInstance.get(this.ITEM_URL)
    return response.data
  }

  static async create(item: any): Promise<any>{
    const response = await axiosInstance.post(this.ITEM_URL, item)
    return response.data
  }
}