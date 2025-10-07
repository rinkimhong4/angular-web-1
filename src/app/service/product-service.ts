import { Injectable } from '@angular/core';
import { Product } from '../models/product';

declare var axios: any;
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';
  products: Product[] = [];

  constructor() {
    this.loadProducts();
  }

  private async loadProducts() {
    $.LoadingOverlay('show');
    try {
      const response = await axios.get(this.apiUrl);
      this.products = response.data.products || [];
      console.log('Products loaded:', this.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      $.LoadingOverlay('hide');
    }
  }

  // ✅ This method is missing in your code
  async getProducts(): Promise<Product[]> {
    // If already loaded, just return from cache
    if (this.products.length > 0) {
      return this.products;
    }

    $.LoadingOverlay('show');
    try {
      const response = await axios.get(this.apiUrl);
      this.products = response.data.products || [];
      return this.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    } finally {
      $.LoadingOverlay('hide');
    }
  }

  async getProductById(id: number): Promise<Product> {
    $.LoadingOverlay('show');
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    } finally {
      $.LoadingOverlay('hide');
    }
  }
}
