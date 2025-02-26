import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  TuiAlertService,
  TuiButton,
  TuiDialogService,
  TuiIcon,
  TuiLink,
  TuiPopup,
} from '@taiga-ui/core';
import {
  TuiBadge,
  TuiBadgedContent,
  TuiBadgeNotification,
  TuiCompass,
  TuiDrawer,
} from '@taiga-ui/kit';
import { UserService } from '../../../services/user.service';
import { Session } from '@supabase/supabase-js';

@Component({
  selector: 'app-nav',
  imports: [
    TuiButton,
    TuiBadgedContent,
    TuiBadgeNotification,
    TuiDrawer,
    TuiPopup,
    RouterLink,
    TuiLink,
    TuiIcon,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  protected readonly dialogs = inject(TuiDialogService);
  private readonly alerts = inject(TuiAlertService);
  protected readonly open = signal(false);
  protected readonly session = signal<Session | null>(null);
  constructor(private router: Router, private userService: UserService) {}

  async ngOnInit() {
    try {
      const res = await this.userService.getSession();
      console.log(res);
      this.session.set(res);
    } catch (e: any) {
      this.alerts
        .open('Algo salió mal.' + e.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }

  public onClose(): void {
    this.open.set(false);
  }

  public toExplore(): void {
    this.router.navigate(['/explorar']);
  }

  async login() {
    try {
      console.log('acá');
      const res = await this.userService.signIn('test@gmail.com', '123456');
      console.log(res);
    } catch (e: any) {
      this.alerts
        .open('Algo salió mal.' + e.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }

  async signOut() {
    this.userService.signOut();
  }
}
