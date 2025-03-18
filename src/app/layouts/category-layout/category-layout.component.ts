import { CommonModule, NgClass } from '@angular/common';
import {
  afterNextRender,
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  IsActiveMatchOptions,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  TuiBreakpointService,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiGroup,
  TuiIcon,
  TuiLabel,
  TuiLink,
  TuiLoader,
  TuiOptGroup,
  TuiOption,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TuiBlock,
  TuiChevron,
  TuiDataListWrapper,
  TuiPagination,
  TuiRadio,
} from '@taiga-ui/kit';
import { categories } from '../../fakedata';
import { ShopItemComponent } from '../../components/shop-item/shop-item.component';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { NotFoundItemsComponent } from '../../components/not-found-items/not-found-items.component';
import { CategorySliderComponent } from '../../components/category-slider/category-slider.component';
import { Tables, TablesInsert, TablesUpdate } from '../../lib/database.types';
import {
  TuiResponsiveDialog,
  TuiResponsiveDialogOptions,
} from '@taiga-ui/addon-mobile';
import { TuiScrollService } from '@taiga-ui/cdk/services';
import { SearchComponent } from '../../components/search/search.component';
export interface CategoryView extends TablesUpdate<'category'> {
  picture: string;
}

export interface FilterProduct {
  label: string;
  value: FilterProductType;
}

export type FilterProductType =
  | 'created'
  | 'high_price'
  | 'low_price'
  | 'off'
  | 'category';

@Component({
  selector: 'app-category-layout',
  imports: [
    CommonModule,
    TuiTextfield,
    TuiLabel,
    TuiChevron,
    TuiDropdown,
    FormsModule,
    TuiButton,
    TuiDataList,
    RouterLinkActive,
    TuiOption,
    RouterLink,
    TuiIcon,
    ShopItemComponent,
    NotFoundItemsComponent,
    TuiPagination,
    CategorySliderComponent,
    TuiLoader,
    TuiResponsiveDialog,
    ReactiveFormsModule,
    TuiBlock,
    TuiGroup,
    TuiRadio,
    TuiLink,
    NgClass,
    SearchComponent,
  ],
  templateUrl: './category-layout.component.html',
  styleUrl: './category-layout.component.scss',
})
export class CategoryLayoutComponent {
  private tuiScrollService = inject(TuiScrollService);
  protected readonly breakpoint$ = inject(TuiBreakpointService);
  pages = input.required<number>();
  currentPage = input.required<number>();
  currentFilter = input.required<FilterProductType>();
  categories = input.required<Tables<'category'>[]>();
  category = input.required<CategoryView | undefined>();
  products = input.required<any[] | null>();

  openFilter = false;
  protected readonly options: Partial<TuiResponsiveDialogOptions> = {
    label: 'Ordenar por',
    size: 's',
  };
  readonly myMatchOptions: IsActiveMatchOptions = {
    queryParams: 'ignored',
    matrixParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };

  filterOptions: FilterProduct[] = [
    { label: 'Últimos publicados', value: 'created' },
    { label: 'Mayor precio', value: 'high_price' },
    { label: 'Menor precio', value: 'low_price' },
    { label: 'Descuentos', value: 'off' },
  ];
  filterSelected: FilterProduct = this.filterOptions[0];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    effect(() => {
      this.filterSelected =
        this.filterOptions.find((f) => f.value === this.currentFilter()) ||
        this.filterOptions[0];
    });
  }

  goToPage(page: number) {
    this.scrollToTop();

    this.router.navigate([this.category()?.slug], {
      queryParams: { page: page + 1, filter: this.filterSelected.value },
    });
  }

  handleFilter(filter: FilterProduct) {
    this.scrollToTop();

    this.openFilter = false;
    this.router.navigate([this.category()?.slug], {
      queryParams: { page: 1, filter: filter.value },
    });
  }

  goToCategory(slug: string) {
    this.scrollToTop();
    this.router
      .navigateByUrl('/explorar', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/categoria', slug], {
          queryParams: { page: 1, filter: this.filterSelected.value },
        });
      });
  }

  categoryIsActive(slug: string) {
    return location.pathname.includes(slug) ? 'is-active' : '';
  }

  scrollToTop() {
    const body = document.querySelector('html') as any;
    this.breakpoint$.subscribe((breakpoint) => {
      if (breakpoint === 'mobile') {
        this.tuiScrollService.scroll$(body, 0, 0).subscribe();
      } else {
        this.tuiScrollService.scroll$(body, 400, 0).subscribe();
      }
    });
  }
}
