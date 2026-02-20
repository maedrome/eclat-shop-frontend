import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrdersService } from '@cart/services/orders.service';
import { OrderStatus } from '@cart/interfaces/order.interface';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-orders-admin-page',
  imports: [CurrencyPipe, DatePipe, SlicePipe, RouterLink, PaginationComponent],
  templateUrl: './orders-admin-page.component.html',
})
export class OrdersAdminPageComponent {
  ordersService = inject(OrdersService);
  paginationService = inject(PaginationService);
  router = inject(Router);

  productsPerPage = linkedSignal(this.paginationService.showPerPage);
  statusFilter = signal<string>('');

  statuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

  ordersResource = rxResource({
    request: () => ({
      page: this.paginationService.pageQueryParam(),
      limit: this.productsPerPage(),
      status: this.statusFilter(),
    }),
    loader: ({ request }) =>
      this.ordersService.getAdminOrders({
        limit: request.limit,
        offset: (request.page - 1) * request.limit,
        status: request.status || undefined,
      }),
  });

  keepPagesNumber = effect(() => {
    if (this.ordersResource.hasValue()) {
      this.paginationService.pages.set(this.ordersResource.value()!.pages);
    }
  });

  onLimitChange(value: number) {
    this.paginationService.showPerPage.set(value);
    this.router.navigate(['/admin/orders'], { queryParams: { page: 1 } });
  }

  onStatusFilter(status: string) {
    this.statusFilter.set(status);
    this.router.navigate(['/admin/orders'], { queryParams: { page: 1 } });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'paid':      return 'text-success bg-success/10';
      case 'shipped':   return 'text-info bg-info/10';
      case 'delivered': return 'text-accent bg-accent/10';
      case 'cancelled': return 'text-error bg-error/10';
      default:          return 'text-warning bg-warning/10';
    }
  }
}
