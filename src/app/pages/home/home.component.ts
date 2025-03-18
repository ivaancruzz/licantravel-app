import {
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
  TuiButton,
  TuiHint,
  TuiSurface,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiCell, TuiHeader } from '@taiga-ui/layout';
import { categories, featured_products, productsFilter } from '../../fakedata';
import { RouterLink } from '@angular/router';
import { FeaturedProductsComponent } from '../../components/featured-products/featured-products.component';
import { CategorySliderComponent } from '../../components/category-slider/category-slider.component';
import { ShopItemComponent } from '../../components/shop-item/shop-item.component';
import { TuiBadge, TuiTile } from '@taiga-ui/kit';
import { CategoryService } from '../../services/category.service';
import { isPlatformBrowser, isPlatformServer, JsonPipe } from '@angular/common';
import { Tables } from '../../lib/database.types';
import { ProductList, ProductService } from '../../services/product.service';
import { SearchComponent } from '../../components/search/search.component';
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
    SearchComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly alerts = inject(TuiAlertService);
  products = signal<ProductList[]>([]);
  categories = signal<Tables<'category'>[]>([]);
  isServer = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  async ngOnInit() {
    this.getCategories();
    this.getProdcuts();
  }

  async getProdcuts() {
    try {
      const res = await this.productService.getTop10Products();
      this.products.set(res);
    } catch (e) {
      console.log(e);
    }
  }

  async getCategories() {
    try {
      const data = await this.categoryService.fetchCategories();
      this.categories.set(data);
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al obtener las categorías' + e.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
