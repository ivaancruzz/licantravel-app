import { Injectable } from '@angular/core';
import { Tables } from '../lib/database.types';
import { SupabaseService } from './supabase.service';
import { getRange } from '../helpers/paginate';
import { ProductList } from './product.service';
import QRCode from 'qrcode';

export interface TicketList extends Tables<'tickets'> {
  products: ProductList;
  clients: Tables<'clients'>;
  sales: { products: ProductList[] };
}

export interface PagingParams {
  byStatus?: TicketState;
  bySale?: string;
}

export enum TicketState {
  pending = 'pending',
  active = 'active',
  used = 'used',
  expired = 'expired',
  canceled = 'canceled',
}

export const ticketStateNames = {
  [TicketState.pending]: {
    label: 'Pendiente',
    color: 'warning',
    clientMessage: '',
    providerMessage: '',
  },
  [TicketState.active]: {
    label: 'Activo',
    color: 'positive',
    clientMessage:
      'El ticket está activo y puedes usuarlo. Sólo debes acercarte a la atracción y mostrar el código QR.',
    providerMessage: 'El ticket es válido y esta listo para usarse.',
  },
  [TicketState.used]: {
    label: 'Usado',
    color: 'info',
    clientMessage: 'El ticket ya fue usado y no puede reutilizarse.',
    providerMessage: 'El ticket ya fue usado y no puede reutilizarse.',
  },
  [TicketState.expired]: {
    label: 'Expirado',
    color: 'negative',
    clientMessage: '',
    providerMessage: '',
  },
  [TicketState.canceled]: {
    label: 'Cancelado',
    color: 'negative',
    clientMessage: 'El ticket fue cancelado antes de ser usado.',
    providerMessage: 'El ticket fue cancelado por los administradores.',
  },
};
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  readonly pageLimit = 15;
  constructor(private supabaseService: SupabaseService) {}

  async fetchTickets({
    byStatus,
    bySale,
  }: PagingParams): Promise<{ data: TicketList[]; count: any }> {
    const defaultQuery = '*, products(*)';
    const queryBuilder = this.supabaseService.clientBrowser
      .from('tickets')
      .select('*, products(*), sales!inner(products)');

    console.log(bySale);
    if (byStatus) {
      queryBuilder.eq('status', byStatus);
    }
    if (bySale) {
      queryBuilder.eq('sales.sale_code', bySale);
    }

    const { data, error, count } = await queryBuilder;

    if (error) throw error;

    return { data, count };
  }

  async getTicket(by: { code?: string; id?: string }): Promise<TicketList> {
    const queryBuilder = this.supabaseService.clientBrowser
      .from('tickets')
      .select(
        '*, sales(products), clients(first_name, last_name, document, email, phone)',
      );

    if (by.code) {
      queryBuilder.eq('code', by.code);
    } else if (by.id) {
      queryBuilder.eq('id', by.id);
    }

    const { data, error } = await queryBuilder.single();

    if (error) throw error;

    return data;
  }

  async generateQR(ticketId: string): Promise<string> {
    const url = await QRCode.toDataURL(ticketId);

    return url;
  }

  async validateTicket(id: string) {
    const { data, error } = await this.supabaseService.clientBrowser
      .from('tickets')
      .update({ status: TicketState.used })
      .eq('id', id);
    if (error) throw error;
  }
}
