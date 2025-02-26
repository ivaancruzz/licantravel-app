import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Tables } from '../lib/database.types';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private supabaseService: SupabaseService) {}

  async fetchCategories(): Promise<Tables<'category'>[]> {
    const { data, error } = await this.supabaseService.getData<
      Tables<'category'>[]
    >('categories', (client) => client.from('category').select('*'));

    if (error) throw error;

    return data || [];
  }
}
