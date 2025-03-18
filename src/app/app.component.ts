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
  REQUEST_CONTEXT,
} from '@angular/core';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiAlertService, TuiButton, TuiRoot } from '@taiga-ui/core';
import { TUI_CONFIRM, type TuiConfirmData } from '@taiga-ui/kit';
import { switchMap } from 'rxjs';
import { CommonModule, NgClass } from '@angular/common';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SupabaseService } from './services/supabase.service';
import { Role, UserService } from './services/user.service';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import { CaslService } from './services/casl.service';

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
    private userService: UserService,
    private supabaseService: SupabaseService,
    private httpClient: HttpClient,
    private caslService: CaslService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.supabaseService.isServer) return;

    setTimeout(() => {
      const body = document.querySelector('body');

      body?.classList.remove('overflow-hidden');
      this.loading = false;
    }, 200);

    const { data } = this.supabaseService.clientBrowser.auth.onAuthStateChange(
      (event, session) => {
        if (event !== 'PASSWORD_RECOVERY') {
          this.userService._isAuthenticated.set(!!session);
          this.userService._session.set(session);
        }

        if (!session) {
          this.caslService.updateAbility(Role.anon);
        }

        if (event === 'SIGNED_IN') {
          if (!session) return;

          console.log('SIGNED_IN');

          this.setSession(session.access_token, session.refresh_token);
          this.caslService.updateAbility(session.user.role as Role);
        } else if (event === 'SIGNED_OUT') {
          this.httpClient.get('signout').subscribe((res) => {
            this.caslService.removeAbility();
            location.href = '/';
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          // handle password recovery event
        } else if (event === 'TOKEN_REFRESHED') {
          if (!session) return;
          console.log('TOKEN_REFRESHED');
          this.setSession(session.access_token, session.refresh_token);
          this.caslService.updateAbility(session.user.role as Role);
        } else if (event === 'USER_UPDATED') {
          console.log('USER_UPDATED');

          // handle user updated event
        }
      },
    );
  }

  setSession(access_token: string, refresh_token: string) {
    this.httpClient
      .post('/set-session', {
        access_token: access_token,
        refresh_token: refresh_token,
      })
      .subscribe();
  }
}
