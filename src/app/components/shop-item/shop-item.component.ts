import { CurrencyPipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {
  TuiResponsiveDialog,
  TuiResponsiveDialogOptions,
} from '@taiga-ui/addon-mobile';
import { TuiAppearance, TuiButton, TuiIcon, TuiSurface } from '@taiga-ui/core';
import { TuiSkeleton, TuiTile } from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import Fade from 'embla-carousel-fade';
import { ShopImagesSliderComponent } from '../shop-images-slider/shop-images-slider.component';
import { ProductLayoutComponent } from '../../layouts/product-layout/product-layout.component';
import { Tables } from '../../lib/database.types';
import { ProductList } from '../../services/product.service';

@Component({
  selector: 'app-shop-item',
  imports: [
    TuiCardMedium,
    TuiAppearance,
    ProductLayoutComponent,
    ShopImagesSliderComponent,
    CurrencyPipe,
    TuiResponsiveDialog,
    TuiSurface,
  ],
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopItemComponent {
  @Input() product!: ProductList;
  @Input() slider = true;

  goToProduct() {
    location.href = `categoria/${this.product.category.slug}/${this.product.slug}`;
  }
}
