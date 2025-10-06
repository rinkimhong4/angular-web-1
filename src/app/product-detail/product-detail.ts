import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../service/product-service';
import { CartService } from '../service/cart-service';
import { Product } from '../models/product';

declare var Swal: any;

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      try {
        this.product = await this.productService.getProductById(+id);
      } catch (error) {
        console.error('Error loading product:', error);
        Swal.fire('Error', 'Failed to load product details', 'error');
      } finally {
        this.loading = false;
      }
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
      Swal.fire('Success', 'Product added to cart!', 'success');
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getStars(rating: number): number[] {
    const roundedRating = Math.round(rating);
    return Array(5)
      .fill(0)
      .map((_, i) => (i < roundedRating ? 1 : 0));
  }

  getStockStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'in stock':
        return 'badge-success';
      case 'low stock':
        return 'badge-warning';
      case 'out of stock':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }
}
