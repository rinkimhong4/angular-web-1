import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartService } from '../service/cart-service';
import { CartItem } from '../models/cart-item';
import { AuthService } from '../service/auth-service';
import { UsdToKhrPipe } from '../pipes/usd-to-khr-pipe';

declare var Swal: any;

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
    private authService: AuthService,
    private http: HttpClient
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

    // Prepare order data for API
    const orderData = {
      customer: {
        name: this.customer.name,
        email: this.customer.email,
        address: this.customer.address,
      },
      items: this.cartItems.map((item) => ({
        product: {
          title: item.product.title,
          price: item.product.price,
        },
        quantity: item.quantity,
      })),
      total: this.total,
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
    };

    // Set headers with authorization
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json',
    });

    // Submit order to API
    this.http
      .post('https://auth-api.rinkimhong.org/api/orders', orderData, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          this.orderId = response._id;
          this.orderPlaced = true;
          this.cartService.clearCart();

          // Keep the order details for invoice display
          this.total = orderTotal;
          this.cartItems = orderItems;

          Swal.fire('Success', 'Order placed successfully!', 'success');
        },
        error: (err) => {
          console.error('Order submission error:', err);
          Swal.fire(
            'Error',
            err.error?.message || 'Failed to place order. Please try again.',
            'error'
          );
        },
      });
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
