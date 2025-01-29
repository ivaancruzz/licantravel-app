import { Routes } from '@angular/router';
import { ExploreComponent } from './pages/explore/explore.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import path from 'path';
import { ViewProductComponent } from './pages/view-product/view-product.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'explorar',
    component: ExploreComponent,
  },
  {
    path: 'categoria/:category',
    component: ExploreComponent,
  },
  {
    path: 'categoria/:category/:slug',
    component: ViewProductComponent,
  },
  {
    path: 'mis-compras',
    component: ViewProductComponent,
  },
];
