import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { UsdToKhrPipe } from '../pipes/usd-to-khr-pipe';
import jsPDF from 'jspdf';

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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin'], {
        queryParams: { returnUrl: '/download' },
      });
      return;
    }

    const orderId = this.activatedRoute.snapshot.queryParams['orderId'];
    if (orderId) {
      this.authService.getOrderById(orderId).subscribe({
        next: (order) => {
          this.order = order;
        },
        error: (err) => {
          console.error('Error fetching order:', err);
          if (err.status === 401) {
            this.router.navigate(['/signin']);
          } else {
            Swal.fire('Error', 'Failed to load order.', 'error');
            this.router.navigate(['/']);
          }
        },
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  generatePDF(order: any) {
    try {
      const doc = new jsPDF();
      let y = 20;

      // Header
      doc.setFontSize(18);
      doc.text('Baramey SV3 Commerce', 20, y);
      y += 10;
      doc.setFontSize(14);
      doc.text('Invoice', 20, y);
      y += 20;

      // Invoice details
      doc.setFontSize(12);
      doc.text(`Invoice Number: ${order._id}`, 20, y);
      y += 10;
      doc.text(`Date: ${order.date}`, 20, y);
      y += 10;
      doc.text('Payment Method: Credit Card', 20, y);
      y += 20;

      // Customer details
      doc.text('Bill To:', 20, y);
      y += 10;
      doc.text(`Name: ${order.customer.name}`, 20, y);
      y += 10;
      doc.text(`Email: ${order.customer.email}`, 20, y);
      y += 10;
      doc.text(`Address: ${order.customer.address}`, 20, y);
      y += 20;

      // Order table header
      doc.text('Item', 20, y);
      doc.text('Qty', 100, y);
      doc.text('Price', 130, y);
      doc.text('Total', 160, y);
      y += 10;
      doc.line(20, y, 190, y); // line
      y += 5;

      // Items
      order.items.forEach((item: any) => {
        doc.text(item.product.title, 20, y);
        doc.text(item.quantity.toString(), 100, y);
        doc.text(`$${item.product.price.toFixed(2)}`, 130, y);
        doc.text(`$${(item.product.price * item.quantity).toFixed(2)}`, 160, y);
        y += 10;
      });

      y += 10;
      doc.line(20, y, 190, y);
      y += 10;

      // Summary
      doc.text(`Subtotal: $${order.total.toFixed(2)}`, 130, y);
      y += 10;
      doc.text('Tax: $0.00', 130, y);
      y += 10;
      doc.text(`Grand Total: $${order.total.toFixed(2)}`, 130, y);
      y += 10;
      const khrTotal = Math.floor((order.total * 4100) / 100) * 100;
      // doc.text(`Total in KHR: ${khrTotal.toLocaleString('en-US')}៛`, 130, y);
      doc.text(`Total in KHR: ${khrTotal.toLocaleString('en-US')} KHR`, 130, y);

      y += 20;

      // Footer
      doc.text('Thank you for your business!', 20, y);
      y += 10;
      doc.text('Baramey SV3', 20, y);

      doc.save(`invoice-${order._id}.pdf`);
    } catch (e) {
      console.error('Error generating PDF:', e);
      Swal.fire('Error', 'Failed to generate PDF. Please try again.', 'error');
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  downloadPDF() {
    if (this.order) {
      this.generatePDF(this.order);
    }
  }
}
