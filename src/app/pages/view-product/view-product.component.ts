import { Component } from '@angular/core';
import { productsFilter } from '../../fakedata';
import { ProductLayoutComponent } from '../../layouts/product-layout/product-layout.component';
import { RecommendedProductsComponent } from '../../components/recommended-products/recommended-products.component';
import { CategorySliderComponent } from '../../components/category-slider/category-slider.component';

@Component({
  selector: 'app-view-product',
  imports: [
    ProductLayoutComponent,
    RecommendedProductsComponent,
    CategorySliderComponent,
  ],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
})
export class ViewProductComponent {
  product = productsFilter[0];
}
