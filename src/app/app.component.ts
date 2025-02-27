import { RouterLink, RouterOutlet } from '@angular/router';
import {
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
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SupabaseService } from './services/supabase.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayoutComponent, TuiRoot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private userService: UserService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    this.userService.getUser();

    const { data } = this.supabaseService.clientBrowser.auth.onAuthStateChange(
      (event, session) => {
        if (event !== 'PASSWORD_RECOVERY') {
          this.userService._isAuthenticated.set(!!session);
          this.userService._session.set(session);
        }
      }
    );
  }
}
