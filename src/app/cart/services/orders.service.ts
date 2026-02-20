import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AdminOrder,
  AdminOrdersResponse,
  CreateOrderResponse,
  Order,
  OrdersResponse,
  OrderStatus,
} from '@cart/interfaces/order.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);

  createOrder(shippingData: {
    shippingAddress: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
    shippingPhone: string;
  }): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(
      `${baseUrl}/orders`,
      shippingData,
    );
  }

  confirmPayment(
    id: number,
    clientTransactionId: string,
  ): Observable<Order> {
    return this.http.post<Order>(`${baseUrl}/orders/confirm`, {
      id,
      clientTransactionId,
    });
  }

  getOrders(
    limit = 10,
    offset = 0,
  ): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${baseUrl}/orders`, {
      params: { limit, offset },
    });
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${baseUrl}/orders/${id}`);
  }

  // Admin endpoints
  getAdminOrders(params: {
    limit?: number;
    offset?: number;
    status?: string;
  } = {}): Observable<AdminOrdersResponse> {
    return this.http.get<AdminOrdersResponse>(`${baseUrl}/orders/admin`, { params });
  }

  getAdminOrder(id: string): Observable<AdminOrder> {
    return this.http.get<AdminOrder>(`${baseUrl}/orders/admin/${id}`);
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<AdminOrder> {
    return this.http.patch<AdminOrder>(`${baseUrl}/orders/admin/${id}/status`, { status });
  }
}
