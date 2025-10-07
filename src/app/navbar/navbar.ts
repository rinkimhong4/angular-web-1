import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../service/cart-service';
import { AuthService, User } from '../service/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  isSidebarOpen = false;
  cartItemCount = 0;
  currentUser: User | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subscription = this.cartService.cartItems$.subscribe((items) => {
      // Count unique products, ignore quantity
      this.cartItemCount = items.length;
    });

    this.subscription.add(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleSidebar(event: Event) {
    event.preventDefault();
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeMobileNavbar() {
    // Close navbar collapse on mobile when clicking navigation links
    if (window.innerWidth < 992) {
      // Only on mobile/tablet
      const navbarCollapse = document.querySelector('#navbarNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        // Use Bootstrap's collapse method to close
        // const bsCollapse = (window as any).$ || (window as any).jQuery;
        // if (bsCollapse) {
        //   bsCollapse(navbarCollapse).collapse('hide');
        // } else {
        //   // Fallback: manually remove show class
        //   navbarCollapse.classList.remove('show');
        // }
      }
    }
  }

  logout() {
    this.authService.logout();
    this.closeMobileNavbar();
  }

  // Close navbar collapse when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const navbarCollapse = document.querySelector('#navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Close navbar collapse on mobile when clicking outside
    if (
      navbarCollapse &&
      navbarToggler &&
      window.innerWidth < 992 && // Only on mobile/tablet
      !navbarCollapse.contains(target) &&
      !navbarToggler.contains(target) &&
      (!dropdownMenu || !dropdownMenu.contains(target)) && // Don't close if clicking in dropdown
      navbarCollapse.classList.contains('show') // Only if it's open
    ) {
      // Use Bootstrap's collapse method to close
      const bsCollapse = (window as any).$ || (window as any).jQuery;
      if (bsCollapse) {
        bsCollapse(navbarCollapse).collapse('hide');
      } else {
        // Fallback: manually remove show class
        navbarCollapse.classList.remove('show');
      }
    }
  }
}
