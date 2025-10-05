import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user = {
    name: 'Emma Johnson',
    email: 'emmaj@example.com',
    points: 1250,
    orders: [
      {
        id: 32456,
        item: 'Summer Floral Dress',
        date: 'Jun 12, 2023',
        status: 'delivered',
      },
      {
        id: 32455,
        item: 'Denim Jacket & Slim Jeans',
        date: 'Jun 5, 2023',
        status: 'shipped',
      },
      {
        id: 32450,
        item: 'Designer Handbag',
        date: 'May 28, 2023',
        status: 'processing',
      },
    ],
    wishlist: [
      {
        name: 'Leather Crossbody Bag',
        price: 129.99,
        image:
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=436&q=80',
      },
      {
        name: 'Silk Blouse',
        price: 89.99,
        image:
          'https://images.unsplash.com/photo-1583744946564-b52ae1c1d5ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=437&q=80',
      },
      {
        name: 'Casual Summer Dress',
        price: 59.99,
        image:
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
      },
    ],
    address: '123 Fashion Street, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    size: 'Medium',
    style: 'Minimalist, Casual, occasionally Bohemian',
    vipEvents: 3,
  };

  activeTab: string = 'orders';

  constructor() {}

  ngOnInit(): void {}

  editProfile(): void {
    // Implement edit profile functionality
    console.log('Edit profile clicked');
  }

  saveSettings(): void {
    // Implement save settings functionality
    console.log('Settings saved', this.user);
  }

  removeFromWishlist(item: any): void {
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
