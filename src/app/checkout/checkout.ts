import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../service/cart-service';
import { CartItem } from '../models/cart-item';

declare var Swal: any;

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
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

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
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
    this.orderPlaced = true;
    this.cartService.clearCart();

    // Keep the order details for invoice display
    this.total = orderTotal;
    this.cartItems = orderItems;

    Swal.fire('Success', 'Order placed successfully!', 'success');
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
