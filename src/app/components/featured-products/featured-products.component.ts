import {
  afterNextRender,
  Component,
  Inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { featured_products } from '../../fakedata';
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
@Component({
  selector: 'app-featured-products',
  imports: [TuiBadge, TuiIcon, EmblaCarouselDirective],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss',
})
export class FeaturedProductsComponent {
  products = signal<ProductList[]>([]);
  removeTweenParallax!: VoidFunction;

  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;

  private emblaApi?: EmblaCarouselType;
  public options = { loop: true, containScroll: true };
  plugins = [Autoplay({ playOnInit: true, delay: 3000 })];
  constructor(
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    afterNextRender(() => {
      this.emblaApi = this.emblaRef.emblaApi;

      this.removeTweenParallax = setupTweenParallax(
        this.emblaApi as EmblaCarouselType,
      );
      this.emblaApi?.on('destroy', this.removeTweenParallax);
    });
  }

  async ngOnInit() {
    try {
      const res = await this.productService.getFeaturedProducts();
      this.products.set(res);
    } catch (e) {
      console.log(e);
    }
  }

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
