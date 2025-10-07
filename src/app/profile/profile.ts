import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../service/auth-service';
import { CartService } from '../service/cart-service';
import { CartItem } from '../models/cart-item';
import { Subscription } from 'rxjs';

interface Order {
  id: number;
  item: string;
  date: string;
  status: string;
}

interface WishlistItem {
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private subscription: Subscription = new Subscription();
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  user = {
    name: '',
    email: '',
    points: 0,
    orders: [] as Order[],
    wishlist: [] as WishlistItem[],
    address: '',
    phone: '',
    size: '',
    style: '',
    vipEvents: 0,
    profileImage: '',
  };

  activeTab: string = 'orders';

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        // Load fresh user data from API to get real database data
        this.loadUserProfile();
        this.loadUserOrders(user.id);
        this.loadCartItemsAsWishlist();
      } else {
        this.user.orders = [];
        this.user.wishlist = [];
      }
    });
  }

  private loadUserProfile(): void {
    this.authService.getMe().subscribe({
      next: (userData) => {
        // Update with real data from database
        this.user.name = userData.username;
        this.user.email = userData.email;
        this.user.profileImage = userData.profileImage || '';
      },
      error: (error) => {
        console.error('Error loading user profile', error);
      },
    });
  }

  private loadUserOrders(userId: string) {
    const ordersKey = `user_orders_${userId}`;
    const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    this.user.orders = orders;
  }

  private loadCartItemsAsWishlist() {
    const cartItems = this.cartService.getCartItems();
    this.user.wishlist = cartItems.map((item) => ({
      name: item.product.title,
      price: item.product.price,
      image: item.product.thumbnail || item.product.images?.[0] || '',
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  editProfile(): void {
    // Implement edit profile functionality
    console.log('Edit profile clicked');
  }

  saveSettings(): void {
    if (this.currentUser) {
      const formData = new FormData();
      formData.append('username', this.user.name);
      formData.append('email', this.user.email);
      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      } else if (this.user.profileImage) {
        formData.append('profileImage', this.user.profileImage);
      }

      console.log(
        'Saving profile data with file:',
        this.selectedFile ? 'yes' : 'no'
      );
      console.log('Current user ID:', this.currentUser.id);

      this.authService.updateProfile(formData).subscribe({
        next: (updatedUser) => {
          console.log('Profile updated successfully', updatedUser);
          // Reload profile data from API to ensure we have the latest
          this.loadUserProfile();
          this.selectedFile = null;
          this.previewUrl = null;
          alert('Profile updated successfully!');
        },
        error: (error) => {
          console.error('Error updating profile', error);
          console.error('Error details:', error.error);
          alert(
            'Error updating profile: ' + (error.error?.message || error.message)
          );
        },
      });
    }
  }

  removeFromWishlist(item: WishlistItem): void {
    // Implement remove from wishlist functionality
    const index = this.user.wishlist.indexOf(item);
    if (index !== -1) {
      this.user.wishlist.splice(index, 1);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      default:
        return '';
    }
  }
}
