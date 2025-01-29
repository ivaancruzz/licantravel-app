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
import { TuiTile } from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import Fade from 'embla-carousel-fade';
import { ShopImagesSliderComponent } from '../shop-images-slider/shop-images-slider.component';
import { ProductLayoutComponent } from '../../layouts/product-layout/product-layout.component';

@Component({
  selector: 'app-shop-item',
  imports: [
    TuiCardMedium,
    TuiAppearance,
    ProductLayoutComponent,
    ShopImagesSliderComponent,
    CurrencyPipe,
    TuiResponsiveDialog,
  ],
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopItemComponent {
  @Input() product: any;
  @Input() slider = true;

  protected open = false;
}
