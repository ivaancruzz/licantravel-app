import {
  Component,
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
import { TuiButton, TuiHint, TuiSurface, TuiTextfield } from '@taiga-ui/core';
import { TuiCardLarge, TuiCell, TuiHeader } from '@taiga-ui/layout';
import { categories, featured_products, productsFilter } from '../../fakedata';
import { RouterLink } from '@angular/router';
import { FeaturedProductsComponent } from '../../components/featured-products/featured-products.component';
import { CategorySliderComponent } from '../../components/category-slider/category-slider.component';
import { ShopItemComponent } from '../../components/shop-item/shop-item.component';
import { TuiBadge, TuiTile } from '@taiga-ui/kit';
import { CategoryService } from '../../services/category.service';
import { isPlatformServer, JsonPipe } from '@angular/common';
import { Tables } from '../../lib/database.types';
import { ProductList, ProductService } from '../../services/product.service';
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  products = signal<ProductList[]>([]);
  isServer = false;

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    try {
      const res = await this.productService.fetchProducts();
      this.products.set(res);
    } catch (e) {
      console.log(e);
    }
  }
}
