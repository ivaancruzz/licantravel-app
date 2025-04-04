import {
  Component,
  inject,
  Inject,
  PLATFORM_ID,
  REQUEST,
  signal,
} from '@angular/core';
import { ProductLayoutComponent } from '../../layouts/product-layout/product-layout.component';
import { RecommendedProductsComponent } from '../../components/recommended-products/recommended-products.component';
import { CategorySliderComponent } from '../../components/category-slider/category-slider.component';
import { ProductList, ProductService } from '../../services/product.service';
import { SupabaseService } from '../../services/supabase.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { NotFoundItemsComponent } from '../../components/not-found-items/not-found-items.component';
import { CategoryService } from '../../services/category.service';
import { Tables } from '../../lib/database.types';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-view-product',
  imports: [
    ProductLayoutComponent,
    RecommendedProductsComponent,
    CategorySliderComponent,
    NotFoundItemsComponent,
  ],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
})
export class ViewProductComponent {
  private readonly alerts = inject(TuiAlertService);
  product = signal<ProductList | null>(null);
  recommendedProducts = signal<ProductList[]>([]);
  categories = signal<Tables<'categories'>[]>([]);
  slug = '';

  constructor(
    @Inject(REQUEST) private request: Request,
    private supabaseService: SupabaseService,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: string,
    private categoryService: CategoryService,
    private route: Router,
  ) {}

  async ngOnInit() {
    const [categorySlug, productSlug] =
      this.route.url.split('/categoria/').pop()?.split('/') || [];

    this.getProduct(productSlug);
    this.getRecommendedProducts(categorySlug, productSlug);
    this.getCategories();
  }

  async getProduct(productSlug: string) {
    try {
      const res = await this.productService.getProductBySlug(productSlug);
      this.product.set(res);
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al obtener el producto' + e?.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }

  async getRecommendedProducts(categorySlug: string, productSlug: string) {
    try {
      const res = await this.productService.getTop10ProductsByCategory(
        categorySlug,
        productSlug,
      );

      this.recommendedProducts.set(res);
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al los productos recomendados' + e?.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
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

  get produtModel() {
    return this.product() as ProductList;
  }

  get isBrowserOnly(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
