import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { Cart, CartItem, LocalCartItem } from '@cart/interfaces/cart.interface';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

const baseUrl = environment.baseUrl;
const GUEST_CART_KEY = 'guest_cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private _cart = signal<Cart>({ items: [] });
  private _isLoading = signal(false);
  private _sidebarOpen = signal(false);

  cart = computed(() => this._cart());
  cartItems = computed(() => this._cart().items);
  cartItemCount = computed(() =>
    this._cart().items.reduce((sum, item) => sum + item.quantity, 0),
  );
  cartTotal = computed(() =>
    this._cart().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
  );
  isLoading = computed(() => this._isLoading());
  sidebarOpen = computed(() => this._sidebarOpen());

  constructor() {
    effect(() => {
      const status = this.authService.authStatus();

      if (status === 'authenticated') {
        this.loadServerCart();
      } else if (status === 'not-authenticated') {
        this.loadGuestCart();
      }
    });
  }

  toggleSidebar() {
    this._sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this._sidebarOpen.set(false);
  }

  async addToCart(item: LocalCartItem) {
    if (this.authService.authStatus() === 'authenticated') {
      this._isLoading.set(true);
      try {
        const cart = await firstValueFrom(
          this.http.post<Cart>(`${baseUrl}/cart/items`, {
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
          }),
        );
        this._cart.set(cart);
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
      this._isLoading.set(false);
    } else {
      this.addToGuestCart(item);
    }
    this._sidebarOpen.set(true);
  }

  async updateQuantity(cartItemId: string, quantity: number) {
    if (this.authService.authStatus() === 'authenticated') {
      this._isLoading.set(true);
      try {
        const cart = await firstValueFrom(
          this.http.patch<Cart>(`${baseUrl}/cart/items/${cartItemId}`, {
            quantity,
          }),
        );
        this._cart.set(cart);
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
      this._isLoading.set(false);
    } else {
      this.updateGuestCartQuantity(cartItemId, quantity);
    }
  }

  async removeItem(cartItemId: string) {
    if (this.authService.authStatus() === 'authenticated') {
      this._isLoading.set(true);
      try {
        const cart = await firstValueFrom(
          this.http.delete<Cart>(`${baseUrl}/cart/items/${cartItemId}`),
        );
        this._cart.set(cart);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
      this._isLoading.set(false);
    } else {
      this.removeGuestCartItem(cartItemId);
    }
  }

  async clearCart() {
    if (this.authService.authStatus() === 'authenticated') {
      this._isLoading.set(true);
      try {
        const cart = await firstValueFrom(
          this.http.delete<Cart>(`${baseUrl}/cart`),
        );
        this._cart.set(cart);
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
      this._isLoading.set(false);
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
      this._cart.set({ items: [] });
    }
  }

  // --- Private methods ---

  private async loadServerCart() {
    this._isLoading.set(true);
    try {
      const guestItems = this.getGuestCartItems();

      if (guestItems.length > 0) {
        const items = guestItems.map(({ productId, quantity, size }) => ({
          productId,
          quantity,
          size,
        }));
        const cart = await firstValueFrom(
          this.http.post<Cart>(`${baseUrl}/cart/merge`, { items }),
        );
        this._cart.set(cart);
        localStorage.removeItem(GUEST_CART_KEY);
      } else {
        const cart = await firstValueFrom(
          this.http.get<Cart>(`${baseUrl}/cart`),
        );
        this._cart.set(cart);
      }
    } catch (error) {
      console.error('Failed to load server cart:', error);
    }
    this._isLoading.set(false);
  }

  private loadGuestCart() {
    const items = this.getGuestCartItems();
    const cartItems: CartItem[] = items.map((item, index) => ({
      id: `guest_${index}`,
      product: item.product || {
        id: item.productId,
        title: '',
        price: 0,
        slug: '',
        stock: 0,
        sizes: [],
        images: [],
      },
      quantity: item.quantity,
      size: item.size,
    }));
    this._cart.set({ items: cartItems });
  }

  private getGuestCartItems(): LocalCartItem[] {
    try {
      const raw = localStorage.getItem(GUEST_CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveGuestCart(items: LocalCartItem[]) {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  }

  private addToGuestCart(item: LocalCartItem) {
    const items = this.getGuestCartItems();
    const existing = items.find(
      (i) => i.productId === item.productId && i.size === item.size,
    );

    if (existing) {
      existing.quantity += item.quantity;
      if (item.product) existing.product = item.product;
    } else {
      items.push(item);
    }

    this.saveGuestCart(items);
    this.loadGuestCart();
  }

  private updateGuestCartQuantity(guestId: string, quantity: number) {
    const index = parseInt(guestId.replace('guest_', ''), 10);
    const items = this.getGuestCartItems();
    if (items[index]) {
      items[index].quantity = quantity;
      this.saveGuestCart(items);
      this.loadGuestCart();
    }
  }

  private removeGuestCartItem(guestId: string) {
    const index = parseInt(guestId.replace('guest_', ''), 10);
    const items = this.getGuestCartItems();
    if (items[index]) {
      items.splice(index, 1);
      this.saveGuestCart(items);
      this.loadGuestCart();
    }
  }
}
