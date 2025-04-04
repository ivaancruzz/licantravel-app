import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { FunctionsHttpError } from '@supabase/supabase-js';

export interface Preference {
  id: string;
  init_point: string;
}

export interface PreferenceItem {
  id: string;
  quantity: number;
}
export enum PaymentStatus {
  approved = 'approved',
  failure = 'failure',
  pending = 'pending',
}

@Injectable({
  providedIn: 'root',
})
export class PayService {
  constructor(private supabaseService: SupabaseService) {}

  async getPreference(items: PreferenceItem[]): Promise<Preference> {
    const { data, error } =
      await this.supabaseService.clientBrowser.functions.invoke('mercadopago', {
        body: { items },
      });
    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      throw errorMessage;
    }
    return data;
  }

  async getPaymentStatus(
    paymentId: string,
  ): Promise<{ status: PaymentStatus; saleId: string }> {
    const { data, error } =
      await this.supabaseService.clientBrowser.functions.invoke(
        `mercadopago/${paymentId}`,
        {
          method: 'GET',
        },
      );
    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      throw errorMessage;
    }
    return data;
  }
}
