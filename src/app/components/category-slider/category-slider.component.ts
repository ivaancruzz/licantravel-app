import { isPlatformBrowser, NgFor } from '@angular/common';
import {
  afterNextRender,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { TuiButton } from '@taiga-ui/core/components';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import { categories } from '../../fakedata';
import { TuiSurface } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Tables } from '../../lib/database.types';

@Component({
  selector: 'app-category-slider',
  imports: [TuiCardLarge, TuiSurface, EmblaCarouselDirective, RouterLink],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.scss',
})
export class CategorySliderComponent {
  categories = signal<Tables<'category'>[]>([]);

  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;

  public options = { loop: true, dragFree: true, align: 'start' };
  constructor(private categoryService: CategoryService) {}

  async ngOnInit() {
    const res = await this.categoryService.fetchCategories();
    this.categories.set(res);
  }
}
