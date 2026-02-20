import { Component, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductsService } from '@products/services/products.service';
import { ProductCarouselComponent } from "../../../products/components/product-carousel/product-carousel.component";
import { CurrencyPipe } from '@angular/common';
import { CartService } from '@cart/services/cart.service';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent, CurrencyPipe ],
  templateUrl: './product-page.component.html',
})
export default class ProductPageComponent {
  productsService = inject(ProductsService);
  cartService = inject(CartService);
  activatedRoute = inject(ActivatedRoute);

  productIdSlug = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['idSlug'] ?? '')),
    { initialValue: '' },
  );

  productResource = rxResource({
    request: () => ({ idSlug: this.productIdSlug() }),
    loader: ({ request }) => {
      return this.productsService.getProduct(request.idSlug);
    },
  });

  selectedSize = signal<string>('');
  quantity = signal(1);

  constructor() {
    // Reset selection when product changes
    effect(() => {
      this.productIdSlug();
      this.selectedSize.set('');
      this.quantity.set(1);
    });
  }

  selectSize(size: string) {
    this.selectedSize.set(size);
  }

  incrementQty() {
    const product = this.productResource.value();
    if (product && this.quantity() < product.stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decrementQty() {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart() {
    const product = this.productResource.value();
    if (!product || !this.selectedSize()) return;

    this.cartService.addToCart({
      productId: product.id,
      quantity: this.quantity(),
      size: this.selectedSize(),
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        slug: product.slug,
        stock: product.stock,
        sizes: product.sizes as string[],
        images: product.images,
      },
    });

    this.selectedSize.set('');
    this.quantity.set(1);
  }
}
