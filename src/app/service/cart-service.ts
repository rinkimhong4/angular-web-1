import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  private readonly CART_KEY = 'shopping_cart';

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const storedCart = localStorage.getItem(this.CART_KEY);
    if (storedCart) {
      try {
        const items = JSON.parse(storedCart);
        this.cartItems.next(items);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }

  private saveCartToStorage() {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItems.value));
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItems.next([...currentItems]);
    this.saveCartToStorage();
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value.filter(
      (item) => item.product.id !== productId
    );
    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find((item) => item.product.id === productId);

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cartItems.next([...currentItems]);
        this.saveCartToStorage();
      }
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  getTotal(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  getItemCount(): number {
    return this.cartItems.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }
}
