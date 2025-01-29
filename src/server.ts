import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context';

const angularAppEngine = new AngularAppEngine();

export async function netlifyAppEngineHandler(
  request: Request
): Promise<Response> {
  const context = getContext();

  // Example API endpoints can be defined here.
  // Uncomment and define endpoints as necessary.
  const url = new URL(request.url);

  if (url.pathname.includes('categoria') && request.method === 'GET') {
    const segments = url.pathname.split('/').filter(Boolean);

    if (segments[1] !== 'aventura') {
      return new Response('Not found', { status: 404 });
    }
  }

  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler);
