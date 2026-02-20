import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrdersService } from '@cart/services/orders.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-orders-page',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe, RouterLink, SlicePipe, PaginationComponent],
  templateUrl: './orders-page.component.html',
  host: { class: 'flex-1 flex flex-col' },
})
export default class OrdersPageComponent {
  ordersService = inject(OrdersService);
  paginationService = inject(PaginationService);

  readonly limit = 10;

  ordersResource = rxResource({
    request: () => ({ page: this.paginationService.pageQueryParam() }),
    loader: ({ request }) =>
      this.ordersService.getOrders(this.limit, (request.page - 1) * this.limit),
  });

  getStatusClass(status: string): string {
    switch (status) {
      case 'paid':      return 'text-success';
      case 'shipped':   return 'text-info';
      case 'delivered': return 'text-accent';
      case 'cancelled': return 'text-error';
      default:          return 'text-warning';
    }
  }

}
