import {
  afterNextRender,
  Component,
  inject,
  Inject,
  makeStateKey,
  Optional,
  PLATFORM_ID,
  REQUEST,
  REQUEST_CONTEXT,
  signal,
  TransferState,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TuiAlertService,
  TuiBreakpointService,
  TuiButton,
  TuiHint,
  TuiSurface,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiCell, TuiHeader } from '@taiga-ui/layout';
import { RouterLink } from '@angular/router';
import { FeaturedProductsComponent } from '../../components/featured-products/featured-products.component';
import { CategorySliderComponent } from '../../components/category-slider/category-slider.component';
import { ShopItemComponent } from '../../components/shop-item/shop-item.component';
import { TuiBadge, TuiTile } from '@taiga-ui/kit';
import { CategoryService } from '../../services/category.service';
import {
  AsyncPipe,
  isPlatformBrowser,
  isPlatformServer,
  JsonPipe,
} from '@angular/common';
import { Tables } from '../../lib/database.types';
import { ProductList, ProductService } from '../../services/product.service';
import { SearchComponent } from '../../components/search/search.component';
import { environment } from '../../../environments/environment';
import { init } from 'aos';
import { after } from 'node:test';
import { Meta, Title } from '@angular/platform-browser';
import { SplashScreenComponent } from '../../components/splash-screen/splash-screen.component';
@Component({
  selector: 'app-home',
  imports: [
    TuiTextfield,
    FeaturedProductsComponent,
    CategorySliderComponent,
    ShopItemComponent,
    TuiButton,
    JsonPipe,
    TuiBadge,
    RouterLink,
    SearchComponent,
    AsyncPipe,
    SplashScreenComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  protected readonly breakpoint$ = inject(TuiBreakpointService);
  private readonly alerts = inject(TuiAlertService);
  products = signal<ProductList[]>([]);
  categories = signal<Tables<'categories'>[]>([]);
  featuredProducts = signal<ProductList[]>([]);

  isServer = false;
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;
  showSplash = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private productService: ProductService,
  ) {
    afterNextRender(() => {
      this.showSplash = false;
    });
  }

  async ngOnInit() {
    this.getProdcuts();
    this.getFeaturedProducts();
  }

  async getProdcuts() {
    try {
      const res = await this.productService.getTop10Products();
      this.products.set(res);
    } catch (e) {
      console.log(e);
    }
  }

  async getFeaturedProducts() {
    try {
      const res = await this.productService.getFeaturedProducts();
      this.featuredProducts.set(res);
    } catch (e) {
      console.log(e);
    }
  }

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
