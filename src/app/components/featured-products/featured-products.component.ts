import { afterNextRender, Component, ViewChild } from '@angular/core';
import { featured_products } from '../../fakedata';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiIcon } from '@taiga-ui/core';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import { setupTweenParallax } from './emblaCarouselParallax';
@Component({
  selector: 'app-featured-products',
  imports: [TuiBadge, TuiIcon, EmblaCarouselDirective],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss',
})
export class FeaturedProductsComponent {
  products = featured_products;
  removeTweenParallax!: VoidFunction;

  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;

  private emblaApi?: EmblaCarouselType;
  public options = { loop: true, containScroll: true };
  constructor() {
    afterNextRender(() => {
      this.emblaApi = this.emblaRef.emblaApi;
      this.removeTweenParallax = setupTweenParallax(
        this.emblaApi as EmblaCarouselType
      );
      this.emblaApi?.on('destroy', this.removeTweenParallax);
    });
  }
}
