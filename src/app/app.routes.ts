import { Routes } from '@angular/router';
import { ExploreComponent } from './pages/explore/explore.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import path from 'path';
import { ViewProductComponent } from './pages/view-product/view-product.component';
import { UserPanelLayoutComponent } from './layouts/user-panel-layout/user-panel-layout.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { ViewOrderComponent } from './pages/my-orders/view-order/view-order.component';

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
    component: MyOrdersComponent,
  },
  {
    path: 'mis-compras/:id',
    component: ViewOrderComponent,
  },
];
