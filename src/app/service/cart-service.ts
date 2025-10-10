import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';
import { AuthService } from './auth-service';
declare const Swal: any;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  private readonly CART_KEY_PREFIX = 'shopping_cart_';

  constructor(private authService: AuthService) {
    this.loadCartFromStorage();

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.loadCartFromStorage();
      } else {
        this.clearCart();
      }
    });
  }

  private getCartKey(): string {
    const user = this.authService.getCurrentUser();
    return user
      ? `${this.CART_KEY_PREFIX}${user.id}`
      : this.CART_KEY_PREFIX + 'guest';
  }

  private loadCartFromStorage() {
    const storedCart = localStorage.getItem(this.getCartKey());
    if (storedCart) {
      try {
        const items = JSON.parse(storedCart) as CartItem[];

        const validItems = items.filter(
          (item) => item.quantity > 0 && item.product && item.product.id > 0
        );
        this.cartItems.next(validItems);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        this.cartItems.next([]);
      }
    } else {
      this.cartItems.next([]);
    }
  }

  private saveCartToStorage() {
    const validItems = this.cartItems.value.filter(
      (item) => item.quantity > 0 && item.product && item.product.id > 0
    );
    localStorage.setItem(this.getCartKey(), JSON.stringify(validItems));
  }

  addToCart(product: Product, quantity: number = 1) {
    if (!this.authService.isAuthenticated()) {
      window.location.href = '/signup';
      return;
    }

    const validQuantity = Math.floor(Math.max(1, quantity));
    if (quantity !== validQuantity) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity',
        text: 'Quantity must be at least 1. Adding 1 item.',
        timer: 2000,
        showConfirmButton: false,
      });
    }

    const currentItems = this.cartItems.value;
    const existingIndex = currentItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingIndex > -1) {
      Swal.fire({
        icon: 'error',
        title: 'This Product Already Added to Cart',
        text: '',
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    if (validQuantity > product.stock) {
      Swal.fire({
        icon: 'error',
        title: 'Out of Stock',
        text: `Cannot add ${validQuantity} items. Only ${product.stock} items available.`,
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    currentItems.push({ product, quantity: validQuantity });
    this.cartItems.next([...currentItems]);
    this.saveCartToStorage();

    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: `${product.title} has been added to your cart.`,
      timer: 1500,
      showConfirmButton: false,
    });
  }

  /** Remove an item completely from the cart with confirmation */
  removeFromCart(productId: number) {
    const item = this.cartItems.value.find((i) => i.product.id === productId);
    if (!item) return;

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove "${item.product.title}" from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it',
    }).then((result: any) => {
      if (result.isConfirmed) {
        const updatedItems = this.cartItems.value.filter(
          (i) => i.product.id !== productId
        );
        this.cartItems.next(updatedItems);
        this.saveCartToStorage();
      }
    });
  }

  /** Update quantity (and remove item if quantity <= 0) */
  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex((i) => i.product.id === productId);

    if (itemIndex === -1) {
      console.warn(`Item with product ID ${productId} not found in cart.`);
      return;
    }

    const item = currentItems[itemIndex];
    const validQuantity = Math.floor(Math.max(0, quantity));

    if (validQuantity > item.product.stock) {
      Swal.fire({
        icon: 'error',
        title: 'Out of Stock',
        text: `Cannot set quantity to ${validQuantity}. Only ${item.product.stock} items available.`,
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    if (validQuantity <= 0) {
      this.removeFromCart(productId);
    } else {
      if (validQuantity !== item.quantity) {
        currentItems[itemIndex] = { ...item, quantity: validQuantity };
        this.cartItems.next([...currentItems]);
        this.saveCartToStorage();
      }
    }
  }

  /** Get all cart items (filtered for valid ones) */
  getCartItems(): CartItem[] {
    return this.cartItems.value.filter(
      (item) => item.quantity > 0 && item.product && item.product.id > 0
    );
  }

  /** Get total price of cart */
  getTotal(): number {
    return this.getCartItems().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  /** Get total number of items (sum of quantities) */
  getItemCount(): number {
    return this.getCartItems().reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  /** Clear entire cart */
  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem(this.getCartKey());
  }

  /** Check if cart is empty */
  isCartEmpty(): boolean {
    return this.getItemCount() === 0;
  }
}
