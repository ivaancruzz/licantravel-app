import {
  afterNextRender,
  Component,
  inject,
  Inject,
  makeStateKey,
  Optional,
  PLATFORM_ID,
  REQUEST,
  signal,
  TransferState,
} from '@angular/core';
import {
  CategoryView,
  CategoryLayoutComponent,
  FilterProduct,
  FilterProductType,
} from '../../layouts/category-layout/category-layout.component';
import { categories, productsFilter } from '../../fakedata';
import {
  CommonModule,
  isPlatformBrowser,
  isPlatformServer,
} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Tables, TablesInsert } from '../../lib/database.types';
import { environment } from '../../../environments/environment';
import {
  PagingParams,
  ProductList,
  ProductService,
} from '../../services/product.service';
import { SupabaseService } from '../../services/supabase.service';
import { TuiAlertService } from '@taiga-ui/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { NotFoundItemsComponent } from '../../components/not-found-items/not-found-items.component';

@Component({
  selector: 'app-explore',
  imports: [CommonModule, CategoryLayoutComponent, NotFoundItemsComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss',
})
export class ExploreComponent {
  private readonly alerts = inject(TuiAlertService);

  products = signal<ProductList[] | null>(null);
  categories = signal<Tables<'category'>[]>([]);
  currentPage = signal(0);
  currentFilter = signal<FilterProductType>('created');
  pages = signal(0);
  loading = signal(false);
  category = signal<CategoryView>({
    icon: `${environment.SUPABASE_URL}/storage/v1/object/public/resources/category-icon/explore.png`,
    name: 'Explorar',
    picture: `${environment.SUPABASE_URL}/storage/v1/object/public/resources/category-icon/explore_bg.jpg`,
    slug: '/explorar',
  });

  constructor(
    private productService: ProductService,
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
  ) {}

  async ngOnInit() {
    this.getCategories();
    this.listenQueryParams();
  }

  listenQueryParams() {
    this.route.queryParams.subscribe((params) => {
      const paramsFilter = params['filter'];
      const paramsPage = parseInt(params['page']);
      this.currentPage.set(paramsPage - 1 || 0);
      this.currentFilter.set(paramsFilter);

      this.getProducts();
    });
  }

  async getProducts() {
    this.loading.set(true);
    try {
      const { data, count } = await this.productService.getProductsByCategory({
        page: this.currentPage(),
        filter: {
          by: this.currentFilter(),
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
    try {
      const data = await this.categoryService.fetchCategories();
      this.categories.set(data);
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al obtener las categorías' + e.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }
}
