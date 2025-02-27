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
import { Session, User } from '@supabase/supabase-js';
import { SupabaseService } from '../../../services/supabase.service';

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
  protected readonly isAuthenticated = signal<boolean>(false);
  constructor(
    private router: Router,
    public userService: UserService,
    public supabaseService: SupabaseService
  ) {}

  // async ngOnInit() {
  //   if (!this.supabaseService.isServer) {
  //     this.isAuthenticated.set(this.userService._isAuthenticated.);
  //     console.log(this.userService._isAuthenticated());
  //   }
  // }

  public onClose(): void {
    this.open.set(false);
  }

  public toExplore(): void {
    this.router.navigate(['/explorar']);
  }

  public toRegister(): void {
    this.onClose();
    this.router.navigate(['/registro']);
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
