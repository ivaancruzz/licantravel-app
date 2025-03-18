import { Component, Input } from '@angular/core';
import { ProductList } from '../../services/product.service';
import { Cart, CartService } from '../../services/cart.service';
import { TuiCardMedium } from '@taiga-ui/layout';
import {
  TuiAppearance,
  tuiAppearance,
  TuiButton,
  TuiIcon,
} from '@taiga-ui/core';
import { ShopImagesSliderComponent } from '../shop-images-slider/shop-images-slider.component';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { TuiTile } from '@taiga-ui/kit';

@Component({
  selector: 'app-item-cart',
  imports: [
    TuiCardMedium,
    TuiAppearance,
    ShopImagesSliderComponent,
    JsonPipe,
    TuiTile,
    CurrencyPipe,
    TuiButton,
    TuiIcon,
  ],
  templateUrl: './item-cart.component.html',
  styleUrl: './item-cart.component.scss',
})
export class ItemCartComponent {
  @Input({ required: true }) item!: Cart;

  constructor(private cartService: CartService) {}

  add() {
    this.cartService.add(this.item);
  }
  decrase() {
    this.cartService.decrase(this.item.product.id);
  }

  remove() {
    this.cartService.remove(this.item.product.id);
  }
}
