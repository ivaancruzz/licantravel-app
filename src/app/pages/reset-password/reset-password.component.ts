import { Component, inject } from '@angular/core';
import { SetPasswordComponent } from '../../components/set-password/set-password.component';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiAlertService, TuiAppearance, TuiButton } from '@taiga-ui/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  imports: [SetPasswordComponent, TuiCardLarge, TuiAppearance, TuiButton],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly alerts = inject(TuiAlertService);
  password = '';

  constructor(private userService: UserService) {}
  async changePassword() {
    try {
      await this.userService.updatePassoword(this.password);
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al crear la cuenta' + e?.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }

  onChangePassword(password: string) {
    this.password = password;
  }
}
