import { isPlatformBrowser, NgFor, NgStyle } from '@angular/common';
import {
  afterNextRender,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core/components';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
} from 'embla-carousel-angular';
import { categories } from '../../fakedata';
import { TuiSurface } from '@taiga-ui/core';
import {
  ActivatedRoute,
  IsActiveMatchOptions,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Tables } from '../../lib/database.types';
import {
  FilterProduct,
  FilterProductType,
} from '../../layouts/category-layout/category-layout.component';

@Component({
  selector: 'app-category-slider',
  imports: [
    TuiCardLarge,
    TuiSurface,
    EmblaCarouselDirective,
    RouterLink,
    TuiIcon,
    RouterLinkActive,
    NgStyle,
  ],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.scss',
})
export class CategorySliderComponent {
  @Input({ required: true }) categories: Tables<'category'>[] = [];

  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;

  public options = { loop: true, dragFree: true, align: 'start' };
  constructor(private router: Router) {}
  goToCategory(slug: string) {
    this.router
      .navigateByUrl('/explorar', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/categoria', slug], {
          queryParams: { page: 1, filter: 'created' },
        });
      });
  }
  get currentCategory() {
    return location.pathname.split('/categoria/').pop();
  }
}
