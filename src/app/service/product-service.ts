import { Injectable } from '@angular/core';
import { Product } from '../models/product';

declare var axios: any;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  async getProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
}
