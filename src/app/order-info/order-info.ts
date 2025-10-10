// }import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from '../service/auth-service';
// import { UsdToKhrPipe } from '../pipes/usd-to-khr-pipe';

// @Component({
//   selector: 'app-order-info',
//   imports: [CommonModule, UsdToKhrPipe],
//   templateUrl: './order-info.html',
//   styleUrl: './order-info.css',
// })
// export class OrderInfo implements OnInit {
//   order: any = null;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       const orderId = params['orderId'];
//       if (orderId) {
//         this.loadOrder(orderId);
//       }
//     });
//   }}
