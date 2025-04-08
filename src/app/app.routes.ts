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
import { AuthGuard } from './guards/auth.guard';
import { ScanComponent } from './pages/scan/scan.component';
import { MyDataComponent } from './pages/account/my-data/my-data.component';
import { ChangePasswordComponent } from './pages/account/change-password/change-password.component';
import { ViewCategoryComponent } from './pages/view-category/view-category.component';
import { LoggedGuard } from './guards/logged.guard';
import { NgxPermissionsGuard, ngxPermissionsGuard } from 'ngx-permissions';
import { permission } from 'process';
import { Role } from './services/user.service';
import { on } from 'events';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        except: [Role.provider],
        redirectTo: '/escanear',
      },
    },
  },
  {
    path: 'ingresar',
    component: LoginComponent,
    canActivate: [LoggedGuard],
  },
  {
    path: 'registro',
    component: RegisterComponent,
    canActivate: [LoggedGuard],
  },
  {
    path: 'recuperar',
    component: RecoveryPasswordComponent,
    canActivate: [LoggedGuard],
  },
  {
    path: 'aceptar-invitacion', // ‼️Importante: Esta ruta es una ruta de redireccion utilizada en supabase functions
    component: AcceptInvitationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'escanear',
    component: ScanComponent,
    canActivate: [AuthGuard, ngxPermissionsGuard],
    data: {
      permissions: {
        only: [Role.provider],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'explorar',
    component: ExploreComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        except: [Role.provider],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'categoria/:category',
    component: ViewCategoryComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        except: [Role.provider],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'categoria/:category/:slug',
    component: ViewProductComponent,
    canActivate: [ngxPermissionsGuard],
    data: {
      permissions: {
        except: [Role.provider],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'carrito',
    component: CheckoutComponent,
    canActivate: [AuthGuard, ngxPermissionsGuard],
    data: {
      permissions: {
        only: [Role.client],
        redirectTo: '/ingresar',
      },
    },
  },
  {
    path: 'mis-compras',
    component: MyOrdersComponent,
    canActivate: [AuthGuard, ngxPermissionsGuard],
    data: {
      permissions: {
        only: [Role.client],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'mis-compras/:code',
    component: ViewOrderComponent,
    canActivate: [AuthGuard, ngxPermissionsGuard],
    data: {
      permissions: {
        only: [Role.client],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'mis-tickets',
    component: MyTicketsComponent,
    canActivate: [AuthGuard, ngxPermissionsGuard],
    data: {
      permissions: {
        only: [Role.client],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'mis-tickets/:code',
    component: ViewTicketComponent,
    canActivate: [AuthGuard, ngxPermissionsGuard],
    data: {
      permissions: {
        only: [Role.client],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'ajustes/mis-datos',
    component: MyDataComponent,
    canActivate: [AuthGuard, ngxPermissionsGuard],
    data: {
      permissions: {
        only: [Role.client, Role.provider],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'ajustes/cambiar-clave',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard, ngxPermissionsGuard],
    data: {
      permissions: {
        only: [Role.client, Role.provider],
        redirectTo: '/',
      },
    },
  },
];
