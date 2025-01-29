import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiIcon,
  TuiLabel,
  TuiOptGroup,
  TuiOption,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper, TuiPagination } from '@taiga-ui/kit';
import { categories } from '../../fakedata';
import { ShopItemComponent } from '../../components/shop-item/shop-item.component';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { NotFoundItemsComponent } from '../../components/not-found-items/not-found-items.component';
import { CategorySliderComponent } from '../../components/category-slider/category-slider.component';

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
  ],
  templateUrl: './explore-layout.component.html',
  styleUrl: './explore-layout.component.scss',
})
export class ExploreLayoutComponent {
  @Input() category: any;
  @Input() items: any[] = [];
  filterCategory = 'Todos';
  protected readonly categories = categories;
}
