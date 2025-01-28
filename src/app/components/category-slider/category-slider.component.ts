import { isPlatformBrowser, NgFor } from '@angular/common';
import {
  afterNextRender,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { TuiButton } from '@taiga-ui/core/components';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import { categories } from '../../fakedata';
import { TuiSurface } from '@taiga-ui/core';

@Component({
  selector: 'app-category-slider',
  imports: [TuiCardLarge, TuiSurface, EmblaCarouselDirective],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.scss',
})
export class CategorySliderComponent {
  categories = categories;

  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;

  public options = { loop: true, dragFree: true, align: 'start' };
  private emblaApi?: EmblaCarouselType;
  constructor() {
    afterNextRender(() => {
      this.emblaApi = this.emblaRef.emblaApi;
    });
  }
}
