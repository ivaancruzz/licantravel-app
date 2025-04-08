import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ProductList } from './product.service';
import { Tables } from '../lib/database.types';
import { getRange } from '../helpers/paginate';

export type SaleList = Tables<'sales'> & {
  sales_products: { products: ProductList; quantity: number }[];
  clients: { email: string };
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
  /**
   * El usuario aún no ha completado el proceso de pago (por ejemplo, después de generar un boleto, el pago se completará cuando el usuario pague en el lugar seleccionado).
   */
  pending = 'pending',
  /**
   * El pago ha sido aprobado y acreditado con éxito.
   */
  approved = 'approved',
  /**
   * El pago ha sido autorizado pero aún no se ha capturado.
   */
  authorized = 'authorized',
  /**
   * El pago está en proceso de revisión.
   */
  in_process = 'in_process',
  /**
   *  El usuario ha iniciado una disputa.
   */
  in_mediation = 'in_mediation',
  /**
   *  El pago fue rechazado (el usuario puede intentar pagar nuevamente).
   */
  rejected = 'rejected',
  /**
   * El pago fue cancelado por alguna de las partes o caducó.
   */
  cancelled = 'cancelled',
  /**
   * El pago fue reembolsado al usuario.
   */
  refunded = 'refunded',
  /**
   * Se realizó un contracargo en la tarjeta de crédito del comprador.
   */
  charged_back = 'charged_back',
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
  [PaymentStatus.in_process]: 'Pendiente',
  [PaymentStatus.pending]: 'Pendiente',
  [PaymentStatus.authorized]: 'Autorizado',
  [PaymentStatus.in_mediation]: 'Mediación',
  [PaymentStatus.cancelled]: 'Cancelado',
  [PaymentStatus.charged_back]: 'Contracargo',
  [PaymentStatus.approved]: 'Aprobado',
  [PaymentStatus.rejected]: 'Rechazado',
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
  readonly pageLimit = 15;
  constructor(private supabaseService: SupabaseService) {}

  async fetchSales(
    { page, filter }: PagingParams = {
      page: 0,
    },
  ): Promise<{ data: SaleList[]; count: any }> {
    const [from, to] = getRange({ page, limit: this.pageLimit });

    const queryBuilder = this.supabaseService.clientBrowser
      .from('sales')
      .select('*,clients(email), sales_products(products(*), quantity)', {
        count: 'exact',
      })
      .order('created_at', { ascending: false })
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
      .from('sales')
      .select('*,clients(email), sales_products(products(*), quantity)')
      .eq('sale_code', code)
      .single();

    if (error) throw error;

    return data;
  }
}
