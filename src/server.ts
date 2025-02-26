import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { environment } from './environments/environment';
import { CommonEngine } from '@angular/ssr/node';
import { render } from '@netlify/angular-runtime/common-engine';
import {
  HttpClient,
  HttpBackend,
  HttpHandler,
  HttpXhrBackend,
} from '@angular/common/http';
import { supabaseClientServer } from './utils/supabaseServer';

const angularAppEngine = new AngularAppEngine();

export async function netlifyAppEngineHandler(
  request: Request
): Promise<Response> {
  let context: any = getContext();

  const url = new URL(request.url);
  const cookiesToHeader: { name: string; value: string; options: any }[] = [];

  // Create Supabase SSR client for each request

  // Handle API routes
  // if (url.pathname.includes('categoria') && request.method === 'GET') {
  //   const segments = url.pathname.split('/').filter(Boolean);
  //   if (segments[1] !== 'aventura') {
  //     return new Response('Not found', { status: 404 });
  //   }
  // }
  const response = await angularAppEngine.handle(request, context);

  if (url.pathname === '/login' && request.method === 'POST') {
    const { client, headers } = supabaseClientServer(
      request,
      response as Response
    );
    const body = await request.json();

    const { error } = await client.auth.signInWithPassword(body);
    if (error) {
      return new Response(error.message, {
        status: error.status,
      });
    }

    return new Response(response?.body, {
      status: response?.status,
      statusText: response?.statusText,
      headers,
    });
  }

  if (url.pathname === '/signout' && request.method === 'GET') {
    const { client, headers } = supabaseClientServer(
      request,
      response as Response
    );
    const cookies = parseCookieHeader(request.headers.get('Cookie') || '');

    cookies.forEach(({ name, value }) => {
      const cookie = `${name}=`;
      headers.append('Set-Cookie', cookie);
    });

    return new Response(response?.body, {
      status: response?.status,
      statusText: response?.statusText,
      headers,
    });
  }

  // return response || new Response('Not found', { status: 404 });
  return response || new Response('Not found', { status: 404 });
}

// Helper to serialize cookie options

export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
