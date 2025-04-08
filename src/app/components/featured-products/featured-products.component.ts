import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  input,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiIcon } from '@taiga-ui/core';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import Autoplay from 'embla-carousel-autoplay';
import { setupTweenParallax } from './emblaCarouselParallax';
import { ProductList, ProductService } from '../../services/product.service';
import { isPlatformBrowser } from '@angular/common';
import { addDotBtnsAndClickHandlers } from './dotButtons';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-featured-products',
  imports: [TuiBadge, TuiIcon, EmblaCarouselDirective],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedProductsComponent {
  products = input.required<ProductList[]>();
  removeTweenParallax!: VoidFunction;

  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;
  @ViewChild('dots') dots!: ElementRef<HTMLElement>;

  private emblaApi?: EmblaCarouselType;
  public options = { loop: true, containScroll: true };
  plugins = [Autoplay({ playOnInit: true, delay: 3000 })];
  constructor(@Inject(PLATFORM_ID) private platformId: string) {
    afterNextRender(() => {
      this.emblaApi = this.emblaRef.emblaApi;

      this.removeTweenParallax = setupTweenParallax(
        this.emblaApi as EmblaCarouselType,
      );
      const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
        this.emblaApi as EmblaCarouselType,
        this.dots.nativeElement,
      );
      this.emblaApi?.on('destroy', this.removeTweenParallax);
      this.emblaApi?.on('destroy', removeDotBtnsAndClickHandlers);
    });
  }

  goToProduct(product: ProductList) {
    location.href = `categoria/${product.categories.slug}/${product.slug}`;
  }
}
