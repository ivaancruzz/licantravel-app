import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
import { UserService } from '../../services/user.service';
import { AblePurePipe } from '@casl/angular';
import { AsyncPipe } from '@angular/common';
import { TuiAccordion } from '@taiga-ui/experimental';

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
    AblePurePipe,
    AsyncPipe,
    TuiAppearance,
    TuiIcon,
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

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

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

  async signOut() {
    await this.userService.signOut();
  }
}
