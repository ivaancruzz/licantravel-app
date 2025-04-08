import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import {
  afterNextRender,
  afterRender,
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  Optional,
  PLATFORM_ID,
  REQUEST_CONTEXT,
} from '@angular/core';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiAlertService, TuiButton, TuiRoot } from '@taiga-ui/core';
import { TUI_CONFIRM, type TuiConfirmData } from '@taiga-ui/kit';
import { switchMap } from 'rxjs';
import {
  CommonModule,
  isPlatformBrowser,
  isPlatformServer,
  NgClass,
} from '@angular/common';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SupabaseService } from './services/supabase.service';
import { Role, UserService } from './services/user.service';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import {
  NgxPermissionsModule,
  NgxPermissionsService,
  NgxRolesService,
} from 'ngx-permissions';

import Aos from 'aos';
dayjs.locale('es');

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayoutComponent, TuiRoot, NgClass],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  loading = true;
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private userService: UserService,
    private supabaseService: SupabaseService,
    private ngxPermissionsService: NgxPermissionsService,
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) return;
    Aos.init();

    this.supabaseService.clientBrowser.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (!session) return;

          this.ngxPermissionsService.loadPermissions([
            session?.user.role as Role,
          ]);
          this.userService._isAuthenticated.set(!!session);
          this.userService._session.set(session.user);
          await this.setSession(session.access_token, session.refresh_token);
        } else if (event === 'SIGNED_OUT') {
          await fetch('signout', { method: 'GET' });
          location.href = '/';
        }
      },
    );
  }

  async setSession(access_token: string, refresh_token: string) {
    try {
      await fetch('/set-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  }
}
