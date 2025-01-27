import { isPlatformBrowser, NgFor } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { TuiButton } from '@taiga-ui/core/components';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-category-slider',
  imports: [TuiCarousel, TuiPagination, TuiCardLarge],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.scss',
})
export class CategorySliderComponent {
  protected duration = isPlatformBrowser(inject(PLATFORM_ID)) ? 3_000 : 0;
  protected index = 0;
}
