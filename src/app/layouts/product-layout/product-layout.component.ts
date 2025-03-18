import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  signal,
} from '@angular/core';
import { TuiResponsiveDialog } from '@taiga-ui/addon-mobile';
import { TuiAppearance, TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { ShopImagesSliderComponent } from '../../components/shop-images-slider/shop-images-slider.component';
import { ProductList } from '../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

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
  @Input() product!: ProductList;
  @Input() dialog: any = undefined;
  inCart = signal<boolean>(false);
  constructor(private cartService: CartService) {
    afterNextRender(() => {
      this.inCart.set(this.cartService.exist(this.product.id));
    });
    cartService.onRemove$.subscribe((value) => {
      console.log('aqui');
      if (this.product.id === value) {
        this.inCart.set(false);
      }
    });
  }

  goToProduct() {
    location.href = `categoria/${this.product.category.slug}/${this.product.slug}`;
  }

  addToCart() {
    this.inCart.set(true);
    this.cartService.add({ product: this.product, quantity: 1 });
  }

  removeFromCart() {
    this.cartService.remove(this.product.id);
  }
}
