import { afterNextRender, Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiSurface } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import { categories, productsFilter } from '../../fakedata';
import { ShopItemComponent } from '../shop-item/shop-item.component';

@Component({
  selector: 'app-recommended-products',
  imports: [EmblaCarouselDirective, ShopItemComponent],
  templateUrl: './recommended-products.component.html',
  styleUrl: './recommended-products.component.scss',
})
export class RecommendedProductsComponent {
  products = productsFilter;

  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;

  public options = { loop: false, dragFree: true, align: 'start' };
  private emblaApi?: EmblaCarouselType;
  constructor() {
    afterNextRender(() => {
      this.emblaApi = this.emblaRef.emblaApi;
    });
  }
}
