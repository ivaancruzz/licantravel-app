import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ProductList } from './product.service';
import { Tables } from '../lib/database.types';
import { getRange } from '../helpers/paginate';

export type SaleList = Tables<'sale'> & {
  sale_products: { product: ProductList; quantity: number }[];
  client: { email: string };
};

export interface PagingParams {
  page: number;
  filter?: PaymentStatus;
}

export enum PaymentMethod {
  cash = 'cash',
  credit_card = 'credit_card',
  debit_card = 'debit_card',
  bank_transfer = 'bank_transfer',
}

export enum PaymentStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
  refunded = 'refunded',
}

export enum CreationType {
  manual = 'manual',
  automatic = 'automatic',
}

export const paymentMethodNames = {
  [PaymentMethod.cash]: 'Efectivo',
  [PaymentMethod.credit_card]: 'Tarjeta de Crédito',
  [PaymentMethod.debit_card]: 'Tarjeta de Débito',
  [PaymentMethod.bank_transfer]: 'Transferencia Bancaria',
};

export const paymentStatusNames = {
  [PaymentStatus.pending]: 'Pendiente',
  [PaymentStatus.completed]: 'Completado',
  [PaymentStatus.failed]: 'Fallido',
  [PaymentStatus.refunded]: 'Reembolsado',
};

export const creationTypeNames = {
  [CreationType.manual]: 'Manual',
  [CreationType.automatic]: 'Automatico',
};

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  readonly pageLimit = 2;
  constructor(private supabaseService: SupabaseService) {}

  async fetchSales(
    { page, filter }: PagingParams = {
      page: 0,
    }
  ): Promise<{ data: SaleList[]; count: any }> {
    const [from, to] = getRange({ page, limit: this.pageLimit });

    const queryBuilder = this.supabaseService.clientBrowser
      .from('sale')
      .select('*,client(email), sale_products(product(*), quantity)', {
        count: 'exact',
      })
      .range(from, to);

    if (filter) {
      queryBuilder.eq('payment_status', filter);
    }

    const { data, error, count } = await queryBuilder;

    if (error) throw error;

    return { data, count };
  }

  async getOrder(code: string): Promise<SaleList> {
    const { data, error } = await this.supabaseService.clientBrowser
      .from('sale')
      .select('*,client(email), sale_products(product(*), quantity)')
      .eq('sale_code', code)
      .single();

    if (error) throw error;

    return data;
  }
}
