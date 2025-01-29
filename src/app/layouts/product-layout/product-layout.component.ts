import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiResponsiveDialog } from '@taiga-ui/addon-mobile';
import { TuiAppearance, TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { ShopImagesSliderComponent } from '../../components/shop-images-slider/shop-images-slider.component';

@Component({
  selector: 'app-product-layout',
  imports: [
    CommonModule,
    TuiAppearance,
    ShopImagesSliderComponent,
    CurrencyPipe,
    TuiButton,
    TuiIcon,
  ],
  templateUrl: './product-layout.component.html',
  styleUrl: './product-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLayoutComponent {
  @Input() product: any;
  @Input() dialog: any = undefined;
}
