import { Routes } from '@angular/router';
import { ExploreComponent } from './pages/explore/explore.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import path from 'path';
import { ViewProductComponent } from './pages/view-product/view-product.component';
import { UserPanelLayoutComponent } from './layouts/user-panel-layout/user-panel-layout.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { ViewOrderComponent } from './pages/my-orders/view-order/view-order.component';
import { RegisterComponent } from './pages/register/register.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { LoginComponent } from './pages/login/login.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { MyTicketsComponent } from './pages/my-tickets/my-tickets.component';
import { ViewTicketComponent } from './pages/my-tickets/view-ticket/view-ticket.component';
import { AcceptInvitationComponent } from './pages/accept-invitation/accept-invitation.component';
import { authGuard } from './guards/auth.guard';
import { ScanComponent } from './pages/scan/scan.component';
import { MyDataComponent } from './pages/account/my-data/my-data.component';
import { ChangePasswordComponent } from './pages/account/change-password/change-password.component';
import { ViewCategoryComponent } from './pages/view-category/view-category.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'ingresar',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegisterComponent,
  },
  {
    path: 'recuperar',
    component: RecoveryPasswordComponent,
  },
  {
    path: 'cambiar-clave',
    component: ResetPasswordComponent,
  },
  {
    path: 'aceptar-invitacion',
    component: AcceptInvitationComponent,
  },
  {
    path: 'escanear',
    component: ScanComponent,
  },
  {
    path: 'explorar',
    component: ExploreComponent,
  },
  {
    path: 'categoria/:category',
    component: ViewCategoryComponent,
  },
  {
    path: 'categoria/:category/:slug',
    component: ViewProductComponent,
  },
  {
    path: 'carrito',
    component: CheckoutComponent,
  },
  {
    path: 'mis-compras',
    component: MyOrdersComponent,
  },
  {
    path: 'mis-compras/:code',
    component: ViewOrderComponent,
  },
  {
    path: 'mis-tickets',
    component: MyTicketsComponent,
  },
  {
    path: 'mis-tickets/:code',
    component: ViewTicketComponent,
  },
  {
    path: 'ajustes/mis-datos',
    component: MyDataComponent,
  },
  {
    path: 'ajustes/cambiar-clave',
    component: ChangePasswordComponent,
  },
];
