import { Component, computed, effect, ElementRef, inject, input, OnDestroy, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { FreeMode } from 'swiper/modules';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

@Component({
  selector: 'product-filters',
  standalone: true,
  templateUrl: './product-filters.component.html',
})
export class ProductFiltersComponent implements OnDestroy {
  private router = inject(Router);
  private swiper: Swiper | undefined;

  swiperEl = viewChild<ElementRef>('swiperTags');

  availableTags = input<string[]>([]);
  selectedSizes = input<string[]>([]);
  selectedTags = input<string[]>([]);

  allSizes = ALL_SIZES;

  activeSizeSet = computed(() => new Set(this.selectedSizes()));
  activeTagSet = computed(() => new Set(this.selectedTags()));

  private swiperEffect = effect(() => {
    const el = this.swiperEl()?.nativeElement;
    if (!el || this.swiper) return;

    this.swiper = new Swiper(el, {
      slidesPerView: 'auto',
      freeMode: { enabled: true, sticky: false },
      spaceBetween: 0,
      modules: [FreeMode],
    });
  });

  ngOnDestroy() {
    this.swiper?.destroy(true, true);
  }

  toggleSize(size: string) {
    const current = new Set(this.selectedSizes());
    if (current.has(size)) {
      current.delete(size);
    } else {
      current.add(size);
    }
    this.navigate([...current], this.selectedTags());
  }

  toggleTag(tag: string) {
    const current = new Set(this.selectedTags());
    if (current.has(tag)) {
      current.delete(tag);
    } else {
      current.add(tag);
    }
    this.navigate(this.selectedSizes(), [...current]);
  }

  private navigate(sizes: string[], tags: string[]) {
    const queryParams: Record<string, string | null> = {
      size: sizes.length ? sizes.join(',') : null,
      tag: tags.length ? tags.join(',') : null,
      page: '1',
    };
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
