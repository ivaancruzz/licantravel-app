import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AngularAppEngine } from '@angular/ssr';
import { supabaseClientServer } from './utils/supabaseServer';

const angularAppEngine = new AngularAppEngine();

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */
app.use('/set-session', async (req, res) => {
  // const { client, headers } = supabaseClientServer(
  //   req,
  //   res as Response,
  // );
  // const body = await req.body.json();
  //   const { access_token, refresh_token } = body;
  //   const { error } = await client.auth.setSession({
  //     access_token,
  //     refresh_token,
  //   });
  //   if (error) {
  //     return new Response(error.message, {
  //       status: error.status,
  //     });
  //   }
  //   return new Response(res?.body, {
  //     status: res?.status,
  //     statusText: response?.statusText,
  //     headers,
  //   });
});

app.use('/signout', (req, res) => {
  // const { client, headers } = supabaseClientServer(
  //   request,
  //   response as Response,
  // );
  // const cookies = parseCookieHeader(request.headers.get('Cookie') || '');
  // cookies.forEach(({ name, value }) => {
  //   const cookie = `${name}=`;
  //   headers.append('Set-Cookie', cookie);
  // });
  // return new Response(response?.body, {
  //   status: response?.status,
  //   statusText: response?.statusText,
  //   headers,
  // });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
