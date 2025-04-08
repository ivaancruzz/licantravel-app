import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import { environment } from '../environments/environment';
import { OutgoingHttpHeaders } from 'http';
import { Request, Response } from 'express';

export function supabaseClientServer(req: Request, res: Response) {
  return createServerClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.cookie ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.appendHeader(
              'Set-Cookie',
              serializeCookieHeader(name, value, options),
            ),
          );
        },
      },
    },
  );
}
