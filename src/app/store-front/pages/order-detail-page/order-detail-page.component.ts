import { Component, inject, linkedSignal } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe, SlicePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrdersService } from '@cart/services/orders.service';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'app-order-detail-page',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe, SlicePipe, RouterLink, ProductImagePipe],
  templateUrl: './order-detail-page.component.html',
  host: { class: 'flex-1 flex flex-col' },
})
export default class OrderDetailPageComponent {
  ordersService = inject(OrdersService);
  activatedRoute = inject(ActivatedRoute);

  orderId = linkedSignal(() => this.activatedRoute.snapshot.params['id'] ?? '');

  orderResource = rxResource({
    request: () => ({ id: this.orderId() }),
    loader: ({ request }) => this.ordersService.getOrder(request.id),
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
