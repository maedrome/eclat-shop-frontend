import { Component, inject, linkedSignal } from '@angular/core';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrdersService } from '@cart/services/orders.service';
import { OrderStatus } from '@cart/interfaces/order.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { AdminToastService } from '@admin-dashboard/services/admin-toast.service';

@Component({
  selector: 'app-order-admin-page',
  imports: [CurrencyPipe, DatePipe, SlicePipe, RouterLink, ProductImagePipe],
  templateUrl: './order-admin-page.component.html',
})
export class OrderAdminPageComponent {
  ordersService = inject(OrdersService);
  activatedRoute = inject(ActivatedRoute);
  toastService = inject(AdminToastService);

  orderId = linkedSignal(() => this.activatedRoute.snapshot.params['id'] ?? '');

  statuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

  orderResource = rxResource({
    request: () => ({ id: this.orderId() }),
    loader: ({ request }) => this.ordersService.getAdminOrder(request.id),
  });

  onStatusChange(status: string) {
    this.ordersService.updateOrderStatus(this.orderId(), status as OrderStatus).subscribe({
      next: () => {
        this.toastService.show('Order status updated');
        this.orderResource.reload();
      },
      error: () => {
        this.toastService.show('Failed to update status', 'error');
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'paid':      return 'text-success';
      case 'shipped':   return 'text-info';
      case 'delivered': return 'text-accent';
      case 'cancelled': return 'text-error';
      default:          return 'text-warning';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'paid':      return 'text-success bg-success/10';
      case 'shipped':   return 'text-info bg-info/10';
      case 'delivered': return 'text-accent bg-accent/10';
      case 'cancelled': return 'text-error bg-error/10';
      default:          return 'text-warning bg-warning/10';
    }
  }
}
