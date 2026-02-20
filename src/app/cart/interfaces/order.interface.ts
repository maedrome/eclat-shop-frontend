export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItemProduct {
  id: string;
  title: string;
  slug: string;
  images: string[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  size: string;
  priceAtPurchase: number;
  product: OrderItemProduct;
}

export interface Order {
  id: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone: string;
  paidAt: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  count: number;
  pages: number;
  orders: Order[];
}

export interface CreateOrderResponse {
  order: Order;
  payWithCard: string;
  payWithPayPhone: string;
}

export interface AdminOrderUser {
  id: string;
  fullName: string;
  email: string;
}

export interface AdminOrder extends Order {
  user: AdminOrderUser;
}

export interface AdminOrdersResponse {
  count: number;
  pages: number;
  orders: AdminOrder[];
}
