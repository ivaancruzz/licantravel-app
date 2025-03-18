import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Preference {
  id: string;
  init_point: string;
}

export interface PreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
}

@Injectable({
  providedIn: 'root',
})
export class PayService {
  constructor(private supabaseService: SupabaseService) {}

  async getPreference(items: PreferenceItem[]): Promise<Preference> {
    const { data, error } =
      await this.supabaseService.clientBrowser.functions.invoke(
        'create-preference-mp',
        { body: { items } },
      );
    if (error) throw error;
    return data;
  }
}
