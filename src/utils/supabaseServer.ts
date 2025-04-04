import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { environment } from '../environments/environment';
import { OutgoingHttpHeaders } from 'http';
import { Request, Response } from 'express';

export function supabaseClientServer(request: Request, res: Response) {
  const headers = new Headers();
  const client = createServerClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.header('Cookie') || '';

          return parseCookieHeader(cookieHeader);
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieStr = `${name}=${value}; ${serializeCookieOptions(
              options,
            )}`;
            headers.append('Set-Cookie', cookieStr);
          });
        },
      },
    },
  );

  return {
    client,
    headers,
  };
}

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
