import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
  @Output() productClick = new EventEmitter<number>();

  onCardClick() {
    this.productClick.emit(this.product.id);
  }

  getStars(rating: number): number[] {
    const roundedRating = Math.round(rating);
    return Array(5)
      .fill(0)
      .map((_, i) => (i < roundedRating ? 1 : 0));
  }
}
