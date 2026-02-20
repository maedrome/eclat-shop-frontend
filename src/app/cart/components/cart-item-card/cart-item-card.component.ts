import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '@cart/interfaces/cart.interface';
import { CartService } from '@cart/services/cart.service';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'cart-item-card',
  imports: [CurrencyPipe, ProductImagePipe, RouterLink],
  templateUrl: './cart-item-card.component.html',
  host: { class: 'block' },
})
export class CartItemCardComponent {
  private cartService = inject(CartService);

  item = input.required<CartItem>();
  compact = input(false);

  quantityChange = output<number>();
  remove = output<void>();

  get lineTotal(): number {
    return this.item().product.price * this.item().quantity;
  }

  onNavigate() {
    this.cartService.closeSidebar();
  }

  increment() {
    const current = this.item().quantity;
    if (current < this.item().product.stock) {
      this.quantityChange.emit(current + 1);
    }
  }

  decrement() {
    const current = this.item().quantity;
    if (current > 1) {
      this.quantityChange.emit(current - 1);
    }
  }

  onRemove() {
    this.remove.emit();
  }
}
