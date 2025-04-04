import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { response } from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AngularAppEngine } from '@angular/ssr';
import { supabaseClientServer } from './utils/supabaseServer';
import { parseCookieHeader } from '@supabase/ssr';

const angularAppEngine = new AngularAppEngine();

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
app.use(express.json());
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
app.post('/set-session', async (req, res) => {
  const { client, headers } = supabaseClientServer(req, res);
  const { access_token, refresh_token } = req.body;
  const { error } = await client.auth.setSession({
    access_token,
    refresh_token,
  });
  console.log(refresh_token);
  if (error) {
    return res.status(error.status || 500).json(error.message);
  }
  return res
    .status(200)
    .setHeaders(headers)
    .json({ message: 'Login SSR success' });
});

app.get('/signout', (req, res) => {
  const { client, headers } = supabaseClientServer(req, res);
  const cookies = parseCookieHeader(req.header('Cookie') || '');
  cookies.forEach(({ name, value }) => {
    const cookie = `${name}=`;
    headers.append('Set-Cookie', cookie);
  });
  return res
    .status(200)
    .setHeaders(headers)
    .send({ message: 'Logout SSR success' });
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
