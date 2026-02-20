import { AfterViewInit, Component, DestroyRef, ElementRef, inject, input, NgZone, OnChanges, OnInit, SimpleChanges, viewChild } from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles:`
    .swiper-slide-thumb-active {
      border-color: var(--color-base-content) !important;
    }
    .thumb-nav.swiper-button-disabled {
      opacity: 0.15 !important;
      cursor: default !important;
    }
    .thumb-nav.swiper-button-lock {
      display: none !important;
    }
  `
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges, OnInit{
  private ngZone = inject(NgZone);
  private destroyRef = inject(DestroyRef);
  private wasSmUp = window.innerWidth >= 640;

  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiperThumbDiv = viewChild.required<ElementRef>('swiperThumbDiv');
  thumbPrev = viewChild.required<ElementRef>('thumbPrev');
  thumbNext = viewChild.required<ElementRef>('thumbNext');
  swiper : Swiper | undefined = undefined;
  swiperThumb : Swiper | undefined = undefined;

  ngOnInit() {
    const onResize = () => {
      const isSmUp = window.innerWidth >= 640;
      if (isSmUp !== this.wasSmUp) {
        this.wasSmUp = isSmUp;
        this.ngZone.run(() => this.swiperReinit());
      }
    };
    this.ngZone.runOutsideAngular(() => window.addEventListener('resize', onResize));
    this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
  }

  ngAfterViewInit() {
    this.swiperInit();
  }

  swiperInit = () => {
    const element = this.swiperDiv().nativeElement;
    const thumbElement = this.swiperThumbDiv().nativeElement;
    if (!element||!thumbElement) return;
    const isVertical = window.innerWidth >= 640;
    this.swiperThumb = new Swiper(thumbElement, {
      direction: isVertical ? 'vertical' : 'horizontal',
      slidesPerView: 4,
      slidesPerGroup: 4,
      freeMode: true,
      watchOverflow: true,
      navigation: {
        prevEl: this.thumbPrev().nativeElement,
        nextEl: this.thumbNext().nativeElement,
      },
      modules: [Navigation],
    });

    this.swiper = new Swiper(element, {
      direction: 'horizontal',
      loop: false,
      thumbs: {
        swiper: this.swiperThumb
      },
      modules: [Thumbs]
    });
  }

  swiperReinit() {
    const activeIndex = this.swiper?.activeIndex ?? 0;
    this.swiper?.destroy(true, true);
    this.swiperThumb?.destroy(true, true);
    this.swiperInit();
    this.swiper?.slideTo(activeIndex, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['images'].firstChange) return;
    setTimeout(()=>{
      this.swiper?.update();
      this.swiperThumb?.update()
    },100);
  }

}
