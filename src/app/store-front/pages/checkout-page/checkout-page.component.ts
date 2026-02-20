import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@cart/services/cart.service';
import { OrdersService } from '@cart/services/orders.service';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'app-checkout-page',
  imports: [CurrencyPipe, FormsModule, RouterLink, ProductImagePipe],
  templateUrl: './checkout-page.component.html',
  host: { class: 'flex-1 flex flex-col' },
})
export default class CheckoutPageComponent {
  cartService = inject(CartService);
  ordersService = inject(OrdersService);
  router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal('');

  itemsContainer = viewChild<ElementRef<HTMLElement>>('itemsContainer');
  canScrollUp = signal(false);
  canScrollDown = signal(false);
  scrollbarTakesSpace = signal(false);

  shippingAddress = '';
  shippingCity = '';
  shippingPostalCode = '';
  shippingCountry = 'Ecuador';
  shippingPhone = '';

  constructor() {
    effect(() => {
      this.cartService.cartItems();
      requestAnimationFrame(() => this.checkScroll());
    });
  }

  checkScroll() {
    const el = this.itemsContainer()?.nativeElement;
    if (!el) return;

    this.canScrollUp.set(el.scrollTop > 2);
    this.canScrollDown.set(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
    this.scrollbarTakesSpace.set(el.offsetWidth - el.clientWidth > 0);
  }

  get isFormValid(): boolean {
    return !!(
      this.shippingAddress.trim() &&
      this.shippingCity.trim() &&
      this.shippingPostalCode.trim() &&
      this.shippingCountry.trim() &&
      this.shippingPhone.trim()
    );
  }

  placeOrder() {
    if (!this.isFormValid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.ordersService
      .createOrder({
        shippingAddress: this.shippingAddress,
        shippingCity: this.shippingCity,
        shippingPostalCode: this.shippingPostalCode,
        shippingCountry: this.shippingCountry,
        shippingPhone: this.shippingPhone,
      })
      .subscribe({
        next: (response) => {
          // Redirect to PayPhone payment page
          window.location.href = response.payWithCard;
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            err?.error?.message || 'Failed to create order. Please try again.',
          );
        },
      });
  }
}
