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
import { validateXSignature } from './app/helpers/validate-x-singature-mp';
import { environment } from './environments/environment';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';
import { Items } from 'mercadopago/dist/clients/commonTypes';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { PaymentStatus } from './app/services/sale.service';
import { getExpirationWindow } from './app/helpers/expiration-window';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
app.use(express.json());
const angularApp = new AngularNodeAppEngine();

const mpclient = new MercadoPagoConfig({
  accessToken: environment.NGX_MP_ACCESS_TOKEN,
});
const payment = new Payment(mpclient);
const clients = new Map();

app.post('/set-session', async (req, res) => {
  const client = supabaseClientServer(req, res);
  const { access_token, refresh_token } = req.body;
  const { data, error } = await client.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) {
    return res.status(error.status || 500).json(error.message);
  }
  return res
    .status(200)
    .json({ message: 'Login SSR success', user: data.user?.email });
});

app.get('/signout', (req, res) => {
  const headers = new Headers();
  const client = supabaseClientServer(req, res);
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

app.get('/mercadopago/sse/:requestId', async (req, res) => {
  const requestId = req.params.requestId;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('\n');

  clients.set(requestId, res);

  res.on('close', () => {
    clients.delete(requestId);
  });

  return;
});

app.post('/mercadopago/webhook', async (req, res) => {
  const body = req.body;
  const header = req.headers;
  const queryUrl = req.query;
  const xSignature = header['x-signature'];
  const xRequestId = header['x-request-id'];

  if (!xSignature || !xRequestId) return res.status(400).end();

  try {
    const isValid = validateXSignature(
      xSignature as string,
      xRequestId as string,
      queryUrl,
    );
    if (!isValid) return res.status(400).end();

    const { data, action } = body;

    const paymentData = await payment.get({ id: data.id });
    const clientSupabase = supabaseClientServer(req, res);

    if (paymentData.status === PaymentStatus.approved) {
      const { error } = await clientSupabase.functions.invoke('payment', {
        method: action === 'payment.created' ? 'POST' : 'PUT',
        body: { paymentId: data.id, user: paymentData.metadata.user },
      });

      if (error && error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        console.log('Function returned an error', errorMessage);
        return res.status(500).send({ error: errorMessage });
      }
    } else {
      console.info(`Pago rechazado: ${paymentData.status}`);
    }

    const client = clients.get(paymentData.metadata.request_id);
    if (client) {
      client.write(`data: ${JSON.stringify(paymentData)}\n\n`);
    }

    return res.status(200).end();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e });
  }
});

app.post('/mercadopago/create-reference', async (req, res) => {
  const client = supabaseClientServer(req, res);

  const { data: resUser, error } = await client.auth.getUser();
  if (error) {
    return res.status(error.status || 500).json(error.message);
  }

  if (!resUser) {
    return res
      .status(400)
      .send({ message: 'No tienes permiso para realizar esta acción' });
  }

  const body = req.body;

  try {
    if (!body.items?.length)
      return res
        .status(400)
        .send({ message: 'No hay productos en el carrito' });
    if (!body.metadata?.request_id)
      return res
        .status(400)
        .send({ message: 'No hay un request asociado a la compra' });

    const ids = body.items.map((item: Items) => item.id);
    const { data: products, error } = await client
      .from('products')
      .select('*')
      .in('id', ids);

    if (error) throw error;

    const form: Items[] = products.map((item) => ({
      id: item.id,
      title: item.name,
      quantity: body.items.find((i: Items) => i.id === item.id).quantity,
      unit_price: item.price_off || item.price,
      picture_url: item.product_multimedia[0].file_url,
    }));

    const { expiration_date_from, expiration_date_to } = getExpirationWindow();

    let _body: PreferenceRequest = {
      items: form,
      back_urls: {
        success: 'http://localhost:4200/carrito',
        failure: 'http://localhost:4200/carrito',
        pending: 'http://localhost:4200/carrito',
      },
      statement_descriptor: 'LicanTravel',
      metadata: {
        request_id: body.metadata.request_id,
        user: resUser.user,
      },
      binary_mode: true,
      expires: true,
      expiration_date_from,
      expiration_date_to,
    };
    const preference = new Preference(mpclient);

    const p = await preference.create({ body: _body });

    return res.status(200).send({ init_point: p.init_point });
  } catch (e: any) {
    console.log(e);
    return res.status(500).send({ message: e?.message });
  }
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
app.use('/**', async (req, res, next) => {
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
