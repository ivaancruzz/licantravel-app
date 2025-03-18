import { Injectable } from '@angular/core';
import { FetchParams, SupabaseService } from './supabase.service';
import { Tables } from '../lib/database.types';
import { getRange } from '../helpers/paginate';
import { FilterProductType } from '../layouts/category-layout/category-layout.component';

export interface ProductList extends Tables<'product'> {
  category: { name: string; icon: string; slug: string };
  provider: Tables<'provider'>;
  product_multimedia: Tables<'product_multimedia'>[];
}

export interface PagingParams {
  page: number;
  filter?: {
    by: FilterProductType;
    category?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly pageLimit = 2;
  readonly defaultQuery =
    '*, category!inner(name, icon, slug), provider(*), product_multimedia(id, *)';
  constructor(private supabaseService: SupabaseService) {}

  async fetchProducts(options: FetchParams = {}) {
    const { order, query, is } = options;

    const { data, error } = await this.supabaseService.getData<ProductList[]>(
      'products',
      (client) => {
        let queryBuilder = client
          .from('product')
          .select(this.defaultQuery + query);
        if (order) {
          queryBuilder = queryBuilder.order(order.column, {
            ascending: order.ascending,
          });
        } else if (is) {
          queryBuilder = queryBuilder.is(is.column, is.value);
        }
        return queryBuilder;
      },
    );

    if (error) throw error;

    return data;
  }

  async getProductsByCategory(
    { page, filter }: PagingParams = {
      page: 0,
      filter: { by: 'created', category: '' },
    },
  ) {
    const [from, to] = getRange({ page, limit: this.pageLimit });

    const { data, error, count } = await this.supabaseService.getData<
      ProductList[]
    >('explore', (client) => {
      const queryBuilder = client
        .from('product')
        .select(this.defaultQuery, { count: 'exact' })
        .range(from, to);
      if (filter?.by === 'created') {
        queryBuilder.order('created_at', { ascending: false });
      } else if (filter?.by === 'high_price' || filter?.by === 'low_price') {
        queryBuilder.order('price', {
          ascending: filter?.by === 'low_price',
        });
      } else if (filter?.by === 'off') {
        queryBuilder.not('price_off', 'is', null);
      }
      if (filter?.category) {
        console.log(filter.category);
        queryBuilder.eq('category_id', filter.category);
      }

      return queryBuilder;
    });
    if (error) throw error;

    return { data, count };
  }

  async getTop10ProductsByCategory(categorySlug: string, productSlug: string) {
    const { data, error } = await this.supabaseService.getData<ProductList[]>(
      `top10_products_by_${categorySlug || 'all'}`,
      (client) => {
        let queryBuilder = client
          .from('product')
          .select(this.defaultQuery)
          .neq('slug', productSlug)
          .eq('category.slug', categorySlug)
          .limit(10);

        return queryBuilder;
      },
    );

    if (error) throw error;

    return data;
  }

  async getTop10Products() {
    const { data, error } = await this.supabaseService.getData<ProductList[]>(
      'top10_products',
      (client) =>
        client
          .from('product')
          .select(this.defaultQuery)
          .limit(10)
          .order('created_at', { ascending: false }),
    );

    if (error) throw error;

    return data;
  }

  async getFeaturedProducts() {
    const { data, error } = await this.supabaseService.getData<ProductList[]>(
      'featured_products',
      (client) =>
        client.from('product').select(this.defaultQuery).is('is_feature', true),
    );

    if (error) throw error;

    return data;
  }

  async getProductBySlug(slug: string) {
    const { data, error } = await this.supabaseService.getData<ProductList[]>(
      slug,
      (client) =>
        client.from('product').select(this.defaultQuery).eq('slug', slug),
    );
    if (error) throw error;

    return data[0] || null;
  }

  async searchProducts(query: string): Promise<ProductList[]> {
    const { data, error } = await this.supabaseService.clientBrowser
      .from('product')
      .select(this.defaultQuery)
      .textSearch('name', `${query}:*`);

    if (error) throw error;

    return data;
  }
}
