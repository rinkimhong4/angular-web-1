import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isSidebarOpen = false;

  toggleSidebar(event: Event) {
    event.preventDefault();
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Close sidebar when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const sidebar = document.querySelector('.cover-full');
    const userIcon = document.querySelector('.btn-group .nav-icon');

    if (
      sidebar &&
      userIcon &&
      !sidebar.contains(target) &&
      !userIcon.contains(target)
    ) {
      this.isSidebarOpen = false;
    }
  }
}
