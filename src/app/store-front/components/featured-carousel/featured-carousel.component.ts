import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';

@Component({
  selector: 'featured-carousel',
  imports: [RouterLink, ProductImagePipe],
  templateUrl: './featured-carousel.component.html',
  styles: `
    :host ::ng-deep .swiper-wrapper {
      transition-property: transform, height;
    }
  `,
})
export class FeaturedCarouselComponent implements AfterViewInit {
  products = input.required<Product[]>();
  swiperEl = viewChild.required<ElementRef>('swiperFeatured');
  swiper: Swiper | undefined;

  ngAfterViewInit() {
    const el = this.swiperEl().nativeElement;
    if (!el) return;

    this.swiper = new Swiper(el, {
      slidesPerView: 1,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoHeight: true,
      loop: true,
      speed: 800,
      breakpoints: {
        1024: { allowTouchMove: false },
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },
      navigation: {
        prevEl: '.featured-prev',
        nextEl: '.featured-next',
      },
      modules: [Navigation, Autoplay, EffectFade],
      on: {
        slideChange: (swiper) => {
          const counter = el.closest('section')?.querySelector('.featured-current');
          if (counter) counter.textContent = String(swiper.realIndex + 1);
        },
      },
    });
  }
}
