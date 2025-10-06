import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../service/cart-service';
import { CartItem } from '../models/cart-item';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  total = 0;
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

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }
}
