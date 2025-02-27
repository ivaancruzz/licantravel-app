import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Tables } from '../lib/database.types';

export interface ProductList extends Tables<'product'> {
  category: { name: string; icon: string };
  provider: { display_name: string };
  product_multimedia: Tables<'product_multimedia'>[];
}
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private supabaseService: SupabaseService) {}

  async fetchProducts(
    query: string = '*, category(name, icon), provider(display_name), product_multimedia(id, *)'
  ) {
    const { data, error } = await this.supabaseService.getData<ProductList[]>(
      'products',
      (client) => client.from('product').select(query)
    );

    if (error) throw error;

    return data;
  }
}
