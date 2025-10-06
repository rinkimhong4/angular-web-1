import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeroSection } from '../hero-section/hero-section';
import { ProductCard } from '../product-card/product-card';
import { DiscoundSlider } from '../discound-slider/discound-slider';
import { ProductService } from '../service/product-service';
import { Product } from '../models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [
    CommonModule,
    FormsModule,
    HeroSection,
    ProductCard,
    DiscoundSlider,
  ],
})
export class Home implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';
  priceRange: { min: number; max: number } = { min: 0, max: 10000 };
  showAllProducts = false;
  initialDisplayCount = 8;

  constructor(private productService: ProductService, private router: Router) {}

  async ngOnInit() {
    try {
      this.products = await this.productService.getProducts();
      this.filteredProducts = [...this.products];
      this.extractCategories();
      this.updateDisplayedProducts();
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  extractCategories() {
    const categorySet = new Set(
      this.products.map((p) => p.category).filter((c) => c)
    );
    this.categories = Array.from(categorySet) as string[];
  }

  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      const matchesCategory =
        !this.selectedCategory || product.category === this.selectedCategory;
      const matchesSearch =
        !this.searchTerm ||
        product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      const matchesPrice =
        product.price >= this.priceRange.min &&
        product.price <= this.priceRange.max;

      return matchesCategory && matchesSearch && matchesPrice;
    });
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts() {
    if (this.showAllProducts) {
      this.displayedProducts = [...this.filteredProducts];
    } else {
      this.displayedProducts = this.filteredProducts.slice(
        0,
        this.initialDisplayCount
      );
    }
  }

  showMoreProducts() {
    this.showAllProducts = true;
    this.updateDisplayedProducts();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  onPriceChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.priceRange = { min: 0, max: 10000 };
    this.showAllProducts = false;
    this.filteredProducts = [...this.products];
    this.updateDisplayedProducts();
  }

  viewProduct(id: number) {
    this.router.navigate(['/product', id]);
  }
}
