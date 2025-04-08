import {
  Component,
  ElementRef,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiAppearance,
  TuiButton,
  TuiHint,
  TuiHintDirective,
  TuiIcon,
  TuiLabel,
  TuiTextfield,
} from '@taiga-ui/core';
import { ProductList, ProductService } from '../../services/product.service';
import { NotFoundItemsComponent } from '../not-found-items/not-found-items.component';
import { RecentSearchService } from '../../services/recent-search.service';
import { ClickOutsideDirective } from '../../directives/outside-click.directive';
import { TuiBadge } from '@taiga-ui/kit';

@Component({
  selector: 'app-search',
  imports: [
    TuiTextfield,
    TuiLabel,
    TuiHint,
    TuiHintDirective,
    FormsModule,
    TuiIcon,
    NotFoundItemsComponent,
    ClickOutsideDirective,
    TuiBadge,
    TuiButton,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @ViewChild('wrapperSearch') wrapperSearch!: ElementRef;
  @ViewChildren('productItem') productItems!: QueryList<ElementRef>;
  products = signal<(ProductList & { recent?: boolean })[]>([]);
  searchValue = '';
  recentSearch = signal<string[]>([]);
  hint = false;

  constructor(private productService: ProductService) {}
  async search() {
    this.hint = true;

    if (!this.searchValue) {
      this.hint = false;
      return;
    }
    try {
      const res = await this.productService.searchProducts(this.searchValue);
      this.products.set(res);
    } catch (e) {
      console.log(e);
    }
  }

  goToProduct(product: ProductList & { recent?: boolean }) {
    location.href = `categoria/${product.categories.slug}/${product.slug}`;
  }

  removeRecent(event: Event, productId: string) {
    event.stopPropagation();
    this.products.update((products) =>
      products.filter((p) => p.id !== productId),
    );
    if (this.products().length === 0) this.hint = false;
  }

  openHint() {
    this.hint = Boolean(this.searchValue);

    if (this.searchValue) {
      this.search();
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.focusNextProduct();
    }
  }

  focusNextProduct() {
    const activeElement = document.activeElement;
    const productItemsArray = this.productItems.toArray();
    const currentIndex = productItemsArray.findIndex(
      (item) => item.nativeElement === activeElement,
    );

    if (currentIndex !== -1 && currentIndex < productItemsArray.length - 1) {
      productItemsArray[currentIndex + 1].nativeElement.focus();
    } else if (currentIndex === -1 && productItemsArray.length > 0) {
      productItemsArray[0].nativeElement.focus();
    }
  }
}
