import { Component, DestroyRef, ElementRef, effect, inject, signal, viewChild, afterNextRender } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '@cart/services/cart.service';
import { CartItemCardComponent } from '../cart-item-card/cart-item-card.component';

@Component({
  selector: 'cart-sidebar',
  imports: [CurrencyPipe, RouterLink, CartItemCardComponent],
  templateUrl: './cart-sidebar.component.html',
})
export class CartSidebarComponent {
  cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');
  canScrollUp = signal(false);
  canScrollDown = signal(false);
  scrollbarTakesSpace = signal(false);

  constructor() {
    effect(() => {
      this.cartService.cartItems();
      requestAnimationFrame(() => this.checkScroll());
    });

    afterNextRender(() => {
      const el = this.scrollContainer()?.nativeElement;
      if (!el) return;

      const runCheck = () => requestAnimationFrame(() => this.checkScroll());

      const observer = new ResizeObserver(runCheck);
      observer.observe(el);

      window.addEventListener('resize', runCheck);

      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        window.removeEventListener('resize', runCheck);
      });
    });
  }

  checkScroll() {
    const el = this.scrollContainer()?.nativeElement;
    if (!el) return;

    this.canScrollUp.set(el.scrollTop > 2);
    this.canScrollDown.set(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
    this.scrollbarTakesSpace.set(el.offsetWidth - el.clientWidth > 0);
  }

  onQuantityChange(itemId: string, quantity: number) {
    this.cartService.updateQuantity(itemId, quantity);
  }

  onRemoveItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }

  onClose() {
    this.cartService.closeSidebar();
  }
}
