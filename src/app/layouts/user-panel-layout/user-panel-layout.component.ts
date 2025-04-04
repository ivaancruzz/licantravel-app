import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiButton,
  TuiExpand,
  TuiIcon,
  TuiLink,
} from '@taiga-ui/core';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';
import { Role, UserService } from '../../services/user.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { TuiAccordion } from '@taiga-ui/experimental';
import { NAV } from '../main-layout/nav/nav';
import { NgxPermissionsModule } from 'ngx-permissions';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-panel-layout',
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    TuiAccordion,
    TuiButton,
    TuiCell,
    RouterLink,
    AsyncPipe,
    TuiAppearance,
    TuiIcon,
    NgxPermissionsModule,
    RouterLinkActive,
    NgClass,
  ],
  templateUrl: './user-panel-layout.component.html',
  styleUrl: './user-panel-layout.component.scss',
})
export class UserPanelLayoutComponent {
  @Input() breadcrumbs: {
    caption: string;
    routerLink?: string;
    routerLinkActiveOptions?: any;
  }[] = [];

  Role = Role;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  isActive(url: string) {
    return this.router.url.includes(url);
  }

  public toExplore(): void {
    this.router.navigate(['/explorar'], {
      queryParams: { page: 1, filter: 'created' },
    });
  }

  public toCheckout() {
    this.router.navigate(['/carrito']);
  }

  public toRegister(): void {
    this.router.navigate(['/registro']);
  }

  public toLogin(): void {
    this.router.navigate(['/ingresar']);
  }
}
