import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'explorar',
    renderMode: RenderMode.Server,
  },
  {
    path: 'categoria/:category',
    renderMode: RenderMode.Server,
  },
  {
    path: 'categoria/:category/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'mis-compras',
    renderMode: RenderMode.Client,
  },
];
