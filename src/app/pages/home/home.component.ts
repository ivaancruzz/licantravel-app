import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiHint, TuiSurface, TuiTextfield } from '@taiga-ui/core';
import { TuiCardLarge, TuiCell, TuiHeader } from '@taiga-ui/layout';
import { categories, featured_products, productsFilter } from '../../fakedata';
import { RouterLink } from '@angular/router';
import { FeaturedProductsComponent } from '../../components/featured-products/featured-products.component';
import { CategorySliderComponent } from '../../components/category-slider/category-slider.component';
import { ShopItemComponent } from '../../components/shop-item/shop-item.component';
import { TuiBadge, TuiTile } from '@taiga-ui/kit';
@Component({
  selector: 'app-home',
  imports: [
    TuiTextfield,
    FeaturedProductsComponent,
    CategorySliderComponent,
    ShopItemComponent,
    TuiButton,

    TuiBadge,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  categories = categories;
  products = productsFilter;
}
