import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { OrdersService } from '@cart/services/orders.service';
import { Order } from '@cart/interfaces/order.interface';

@Component({
  selector: 'app-payment-result-page',
  imports: [RouterLink, CurrencyPipe, SlicePipe],
  templateUrl: './payment-result-page.component.html',
  host: { class: 'flex-1 flex flex-col' },
})
export default class PaymentResultPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordersService = inject(OrdersService);

  isLoading = signal(true);
  isSuccess = signal(false);
  errorMessage = signal('');
  order = signal<Order | null>(null);

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    const id = params['id'];
    const clientTransactionId = params['clientTransactionId'];

    if (!id || !clientTransactionId) {
      this.isLoading.set(false);
      this.errorMessage.set('Invalid payment response. Missing transaction details.');
      return;
    }

    this.ordersService
      .confirmPayment(Number(id), clientTransactionId)
      .subscribe({
        next: (order) => {
          this.isLoading.set(false);
          this.isSuccess.set(true);
          this.order.set(order);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.isSuccess.set(false);
          this.errorMessage.set(
            err?.error?.message || 'Payment verification failed.',
          );
        },
      });
  }
}
