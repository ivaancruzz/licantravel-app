import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'ingresar',
    renderMode: RenderMode.Client,
  },
  {
    path: 'registro',
    renderMode: RenderMode.Client,
  },
  {
    path: 'recuperar',
    renderMode: RenderMode.Client,
  },
  {
    path: 'cambiar-clave',
    renderMode: RenderMode.Client,
  },
  {
    path: 'aceptar-invitacion',
    renderMode: RenderMode.Client,
  },
  {
    path: 'escanear',
    renderMode: RenderMode.Client,
  },
  {
    path: 'explorar',
    renderMode: RenderMode.Client,
  },
  {
    path: 'categoria/:category',
    renderMode: RenderMode.Client,
  },
  {
    path: 'categoria/:category/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'carrito',
    renderMode: RenderMode.Client,
  },
  {
    path: 'mis-compras',
    renderMode: RenderMode.Client,
  },
  {
    path: 'mis-compras/:code',
    renderMode: RenderMode.Client,
  },
  {
    path: 'mis-tickets',
    renderMode: RenderMode.Client,
  },
  {
    path: 'mis-tickets/:code',
    renderMode: RenderMode.Client,
  },

  {
    path: 'ajustes/**',
    renderMode: RenderMode.Client,
  },
];
