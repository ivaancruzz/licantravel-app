import { CurrencyPipe } from '@angular/common';
import { afterNextRender, Component, Input, ViewChild } from '@angular/core';
import { TuiAppearance } from '@taiga-ui/core';
import { TuiTile } from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import Fade from 'embla-carousel-fade';

@Component({
  selector: 'app-shop-item',
  imports: [TuiCardMedium, TuiAppearance, EmblaCarouselDirective, CurrencyPipe],
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss',
})
export class ShopItemComponent {
  @Input() product: any;

  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;

  public options = { loop: true };
  public plugins = [Fade()];
  private emblaApi?: EmblaCarouselType;
  constructor() {
    afterNextRender(() => {
      this.emblaApi = this.emblaRef.emblaApi;
    });
  }
}
