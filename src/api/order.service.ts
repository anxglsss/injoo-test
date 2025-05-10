import axiosInstance from './axios';

export interface CreateOrderRequest {
  phoneNumber: string;
  productId: number;
  quantity: number;
  selectedAttributes: Record<string, any>;
  price: number;
}

export class OrderService {
  private static readonly ORDER_URL = '/orders';

  static async createOrder(orderData: CreateOrderRequest) {
    const response = await axiosInstance.post(this.ORDER_URL, orderData);
    return response.data;
  }

  static async getAllOrders() {
    const response = await axiosInstance.get(this.ORDER_URL);
    return response.data;
  }
}
