import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../service/cart-service';
import { CartItem } from '../models/cart-item';
import { AuthService } from '../service/auth-service';
import { UsdToKhrPipe } from '../pipes/usd-to-khr-pipe';

declare var Swal: any;

interface Order {
  id: string;
  customer: any;
  items: CartItem[];
  date: string;
  status: string;
  total: number;
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, UsdToKhrPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  total = 0;
  customer = {
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  };
  orderPlaced = false;
  orderId = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      // Navigate to sign-in with return URL
      this.router.navigate(['/signin'], {
        queryParams: { returnUrl: '/checkout' },
      });
      return;
    }

    this.subscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (
      !this.customer.name ||
      !this.customer.email ||
      !this.customer.address ||
      !this.customer.cardNumber ||
      !this.customer.expiry ||
      !this.customer.cvv
    ) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    // Store the order total and items before clearing cart
    const orderTotal = this.total;
    const orderItems = [...this.cartItems];

    // Simulate order submission
    this.orderId =
      'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create order object
    const order: Order = {
      id: this.orderId,
      customer: { ...this.customer },
      items: [...orderItems],
      date: new Date().toLocaleDateString(),
      status: 'processing',
      total: orderTotal,
    };

    // Save order to user's local storage
    this.saveOrderToUserProfile(order);

    this.orderPlaced = true;
    this.cartService.clearCart();

    // Keep the order details for invoice display
    this.total = orderTotal;
    this.cartItems = orderItems;

    Swal.fire('Success', 'Order placed successfully!', 'success');
  }

  private saveOrderToUserProfile(order: Order) {
    const user = this.authService.getCurrentUser();
    if (user) {
      const ordersKey = `user_orders_${user.id}`;
      const existingOrders = JSON.parse(
        localStorage.getItem(ordersKey) || '[]'
      );
      existingOrders.push(order);
      localStorage.setItem(ordersKey, JSON.stringify(existingOrders));
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  downloadOrder() {
    this.router.navigate(['/download'], {
      queryParams: { orderId: this.orderId },
    });
  }
}
