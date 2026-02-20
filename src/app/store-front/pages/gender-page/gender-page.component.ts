import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { I18nSelectPipe } from '@angular/common';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductFiltersComponent } from '@products/components/product-filters/product-filters.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, I18nSelectPipe, PaginationComponent, ProductFiltersComponent],
  templateUrl: './gender-page.component.html',
  host: { class: 'flex-1 flex flex-col' },
})
export default class GenderPageComponent {
  headerMap = {
    men: 'Bold looks built for every occasion. Explore essentials designed with comfort and attitude.',
    women: 'Express your essence with every outfit. Find pieces that inspire confidence and elegance.',
    kid: 'Playful designs for little adventurers. Styles made for fun, comfort, and endless energy.'
  };
  titleMap = {
    men: 'Men',
    women: 'Women',
    kid: 'Kids'
  }
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);
  paginationService = inject(PaginationService);

  genderParam = this.activatedRoute.params.pipe(map(({ gender }) => gender));
  gender = toSignal(this.genderParam);

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
      gender: this.gender(),
      offset: this.paginationService.pageQueryParam() - 1,
      size: this.sizeFilter(),
      tag: this.tagFilter(),
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        gender: request.gender,
        offset: request.offset,
        size: request.size || undefined,
        tag: request.tag || undefined,
      })
    }
  })
}
