import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { UsdToKhrPipe } from '../pipes/usd-to-khr-pipe';

declare var Swal: any;

@Component({
  selector: 'app-download',
  imports: [CommonModule, UsdToKhrPipe],
  templateUrl: './download.html',
  styleUrl: './download.css',
})
export class Download implements OnInit {
  order: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const orderId = params['orderId'];
      if (orderId) {
        this.loadOrder(orderId);
      }
    });
  }

  private loadOrder(orderId: string): void {
    this.authService.getOrderById(orderId).subscribe({
      next: (order: any) => {
        this.order = order;
      },
      error: (error: any) => {
        console.error('Error loading order:', error);
        // Handle error, maybe navigate back or show message
      },
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
