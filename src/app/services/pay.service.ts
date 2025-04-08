import { Injectable, NgZone } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { FunctionsHttpError, User } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { Items } from 'mercadopago/dist/clients/commonTypes';
import { Database } from '../lib/database.types';
import { PaymentStatus } from './sale.service';

export interface Preference {
  id: string;
  init_point: string;
}

export interface PreferenceItem {
  id: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class PayService {
  constructor(
    private supabaseService: SupabaseService,
    private sseService: SseService,
    private zone: NgZone,
  ) {}

  async getPreference(
    items: Items[],
    metadata: { request_id: string },
  ): Promise<Preference> {
    const res = await fetch('/mercadopago/create-reference', {
      method: 'POST',
      body: JSON.stringify({ items, metadata }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
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

  getServerSentEvent(url: string) {
    return new Observable((observer) => {
      const eventSource = this.sseService.getEventSource(url);

      eventSource.onmessage = (event) => {
        this.zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = (event) => {
        this.zone.run(() => {
          observer.error(event);
        });
      };
    });
  }
}
