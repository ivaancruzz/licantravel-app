import { isPlatformServer } from '@angular/common';
import {
  Inject,
  Injectable,
  makeStateKey,
  Optional,
  PLATFORM_ID,
  REQUEST,
  REQUEST_CONTEXT,
  RESPONSE_INIT,
  TransferState,
} from '@angular/core';
import {
  createClient,
  PostgrestSingleResponse,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { platformServer } from '@angular/platform-server';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface FetchParams {
  query?: string;
  order?: { column: string; ascending: boolean };
  is?: { column: string; value: any };
}
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public client!: SupabaseClient;
  public isServer = false;
  clientBrowser!: SupabaseClient;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(REQUEST) request: Request,
    @Inject(RESPONSE_INIT) response: Response,
    @Optional() private transferState?: TransferState,
  ) {
    this.isServer = isPlatformServer(this.platformId);

    if (this.isServer) {
      this.client = createServerClient(
        environment.SUPABASE_URL,
        environment.SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              const cookieHeader = request.headers.get('Cookie') || '';
              return parseCookieHeader(cookieHeader);
            },
            setAll(cookiesToSet) {
              const headers = new Headers(response?.headers);
              cookiesToSet.forEach(({ name, value, options }) => {
                const cookieStr = `${name}=${value}; ${serializeCookieOptions(
                  options,
                )}`;
                headers.append('Set-Cookie', cookieStr);
              });

              function serializeCookieOptions(options: any): string {
                return Object.entries(options)
                  .map(([key, value]) => {
                    if (value === true) return key;
                    if (typeof value === 'string') return `${key}=${value}`;
                    return '';
                  })
                  .filter(Boolean)
                  .join('; ');
              }
            },
          },
          global: {
            fetch: (url, options) => {
              return new Promise((resolve, reject) => {
                this.http
                  .request(options?.method || 'GET', url as string, {
                    body: options?.body,
                    headers: options?.headers as any,
                  })
                  .subscribe(
                    (response: any) =>
                      resolve(new Response(JSON.stringify(response))),
                    (error) => reject(error),
                  );
              });
            },
          },
        },
      );
    } else {
      this.clientBrowser = createClient(
        environment.SUPABASE_URL,
        environment.SUPABASE_ANON_KEY,
      );
    }
  }

  async getData<T>(
    key: string,
    supabaseFetchFn: (client: SupabaseClient) => any,
  ): Promise<{ data: T; error: any; state?: any; count?: any }> {
    const stateKey = makeStateKey<any>(key);

    // Server-side: Fetch and store data
    if (this.isServer) {
      const { data, error, state, count } = await supabaseFetchFn(this.client);

      if (error) {
        console.error(error);
      }

      this.transferState?.set(stateKey, data);

      return { data, error, state, count };
    }

    //Client side: Parse data from server
    if (!this.isServer && this.transferState?.hasKey(stateKey)) {
      const data = this.transferState?.get<any>(stateKey, null as any);
      return { data, error: null };
    }

    //Client side: Fetch data
    const { data, error, state, count } = await supabaseFetchFn(
      this.clientBrowser,
    );

    if (error) {
      console.error(error);
    }

    return { data, error, state, count };
  }
}
