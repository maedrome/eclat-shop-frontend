import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '@cart/services/cart.service';
import { CartItemCardComponent } from '@cart/components/cart-item-card/cart-item-card.component';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink, CartItemCardComponent],
  templateUrl: './cart-page.component.html',
  host: { class: 'flex-1 flex flex-col' },
})
export default class CartPageComponent {
  cartService = inject(CartService);

  onQuantityChange(itemId: string, quantity: number) {
    this.cartService.updateQuantity(itemId, quantity);
  }

  onRemoveItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }

  onClearCart() {
    this.cartService.clearCart();
  }
}
