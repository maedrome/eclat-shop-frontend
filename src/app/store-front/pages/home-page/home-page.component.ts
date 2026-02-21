import { afterNextRender, Component, computed, effect, ElementRef, inject, Injector, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductFiltersComponent } from '@products/components/product-filters/product-filters.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { FeaturedCarouselComponent } from '../../components/featured-carousel/featured-carousel.component';
import { Product } from '@products/interfaces/product.interface';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent, FeaturedCarouselComponent, ProductFiltersComponent],
  templateUrl: './home-page.component.html',
  host: { class: 'flex-1 flex flex-col' },
})
export default class HomePageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  private activatedRoute = inject(ActivatedRoute);
  private injector = inject(Injector);

  private filtersRef = viewChild<ProductFiltersComponent, ElementRef<HTMLElement>>(
    'filtersRef', { read: ElementRef }
  );

  private isFirstLoad = true;

  private scrollOnPageChange = effect(() => {
    this.paginationService.pageQueryParam();
    const el = this.filtersRef()?.nativeElement;

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }

    if (el) {
      afterNextRender(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, { injector: this.injector });
    }
  });

  private queryParams = toSignal(this.activatedRoute.queryParams, { initialValue: {} as Record<string, string> });

  sizeFilter = computed(() => (this.queryParams()['size'] as string) ?? '');
  tagFilter = computed(() => (this.queryParams()['tag'] as string) ?? '');
  selectedSizes = computed(() => this.sizeFilter() ? this.sizeFilter().split(',') : []);
  selectedTags = computed(() => this.tagFilter() ? this.tagFilter().split(',') : []);

  tagsResource = rxResource({
    loader: () => this.productsService.getAvailableTags()
  });

  availableTags = computed(() => this.tagsResource.value() ?? []);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.pageQueryParam(),
      size: this.sizeFilter(),
      tag: this.tagFilter(),
    }),
    loader: ({request}) => {
      return this.productsService.getProducts({
        offset: request.page - 1,
        size: request.size || undefined,
        tag: request.tag || undefined,
      })
    }
  })

  featuredResource = rxResource({
    loader: () => this.productsService.getProducts({ limit: 30 }).pipe(
      map(resp => this.shuffleArray([...resp.products]).slice(0, 8))
    )
  })

  featuredProducts = computed(() => this.featuredResource.value() ?? []);

  private shuffleArray(arr: Product[]): Product[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
