import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';

import { environment } from '../../../environments/environment';
import {
  CategoryView,
  FilterProductType,
  CategoryLayoutComponent,
} from '../../layouts/category-layout/category-layout.component';
import { Tables } from '../../lib/database.types';
import { CategoryService } from '../../services/category.service';
import { ProductList, ProductService } from '../../services/product.service';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-category',
  imports: [CommonModule, CategoryLayoutComponent],
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.scss',
})
export class ViewCategoryComponent {
  private readonly alerts = inject(TuiAlertService);

  products = signal<ProductList[] | null>(null);
  categories = signal<Tables<'category'>[]>([]);
  currentPage = signal(0);
  currentFilter = signal<FilterProductType>('created');
  pages = signal(0);
  loading = signal(false);
  category = signal<CategoryView | undefined>(undefined);
  loadingCategory = signal(false);

  constructor(
    private productService: ProductService,
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
  ) {}

  async ngOnInit() {
    await this.getCategories();
    this.listenQueryParams();
  }

  listenQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.getCategory();

      const paramsFilter = params['filter'];
      const paramsPage = parseInt(params['page']);
      this.currentPage.set(paramsPage - 1 || 0);
      this.currentFilter.set(paramsFilter);
      console.log(paramsFilter);

      this.getProducts();
    });
  }

  getCategory() {
    const matchCategory = this.categories().find(
      (c) => c.slug === location.pathname.split('/categoria/').pop(),
    );

    if (matchCategory) {
      this.category.set({
        id: matchCategory.id,
        icon: matchCategory.icon as string,
        name: matchCategory.name,
        picture: `${environment.SUPABASE_URL}/storage/v1/object/public/resources/category-icon/explore_bg.jpg`,
        slug: `/categoria/${matchCategory.slug}`,
      });
    } else {
      this.router.navigate(['/explorar'], {
        queryParams: { page: 1, filter: 'created' },
      });
    }
  }

  async getProducts() {
    this.loading.set(true);
    try {
      const { data, count } = await this.productService.getProductsByCategory({
        page: this.currentPage(),
        filter: {
          by: this.currentFilter(),
          category: this.category()?.id,
        },
      });
      this.products.set(data);
      this.pages.set(Math.ceil(count / this.productService.pageLimit));
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al obtener los productos' + e.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    } finally {
      this.loading.set(false);
    }
  }

  async getCategories() {
    this.loadingCategory.set(true);
    try {
      let data = await this.categoryService.fetchCategories();

      this.categories.set(data);
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al obtener las categorías' + e.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    } finally {
      this.loadingCategory.set(false);
    }
  }
}
