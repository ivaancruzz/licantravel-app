import { afterRender, Component, Inject, PLATFORM_ID } from '@angular/core';
import { TuiButton, TuiScrollbar } from '@taiga-ui/core';
import { NavComponent } from './nav/nav.component';
import {
  TuiResponsiveDialog,
  TuiResponsiveDialogOptions,
} from '@taiga-ui/addon-mobile';
import { ItemCartComponent } from '../../components/item-cart/item-cart.component';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Role } from '../../services/user.service';
import { NgxPermissionsDirective, NgxPermissionsModule } from 'ngx-permissions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [NavComponent, AsyncPipe, NgxPermissionsModule, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  standalone: true,
})
export class MainLayoutComponent {
  Role = Role;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
