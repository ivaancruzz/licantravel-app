import { Injectable } from '@angular/core';
import { Tables } from '../lib/database.types';
import { SupabaseService } from './supabase.service';
import { getRange } from '../helpers/paginate';
import { ProductList } from './product.service';
import QRCode from 'qrcode';

export interface TicketList extends Tables<'ticket'> {
  product: ProductList;
  client: Tables<'client'>;
}

export interface PagingParams {
  page: number;
  filter?: TicketState;
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
  },
  [TicketState.active]: {
    label: 'Activo',
    color: 'positive',
  },
  [TicketState.used]: {
    label: 'Usado',
    color: 'info',
  },
  [TicketState.expired]: {
    label: 'Expirado',
    color: 'negative',
  },
  [TicketState.canceled]: {
    label: 'Cancelado',
    color: 'negative',
  },
};
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  readonly pageLimit = 2;
  constructor(private supabaseService: SupabaseService) {}

  async fetchTickets(
    { page, filter }: PagingParams = {
      page: 0,
    },
  ): Promise<{ data: TicketList[]; count: any }> {
    const [from, to] = getRange({ page, limit: this.pageLimit });

    const queryBuilder = this.supabaseService.clientBrowser
      .from('ticket')
      .select('*, product(*, product_multimedia(*))', {
        count: 'exact',
      })
      .range(from, to);

    if (filter) {
      queryBuilder.eq('status', filter);
    }

    const { data, error, count } = await queryBuilder;

    if (error) throw error;

    return { data, count };
  }

  async fetchActiveTickets(): Promise<TicketList[]> {
    const { data, error } = await this.supabaseService.clientBrowser
      .from('ticket')
      .select('*, product(*, product_multimedia(*))')
      .eq('status', TicketState.active);

    if (error) throw error;

    return data;
  }

  async getTicket(by: { code?: string; id?: string }): Promise<TicketList> {
    const queryBuilder = this.supabaseService.clientBrowser
      .from('ticket')
      .select(
        '*, product(*, product_multimedia(*), provider(commune, google_maps_link, open_days)), client(*)',
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
      .from('ticket')
      .update({ status: TicketState.used })
      .eq('id', id);
    if (error) throw error;
  }
}
