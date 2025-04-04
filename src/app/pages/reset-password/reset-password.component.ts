import { Component, inject } from '@angular/core';
import { SetPasswordComponent } from '../../components/set-password/set-password.component';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiAlertService, TuiAppearance, TuiButton } from '@taiga-ui/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { NgxTurnstileFormsModule, NgxTurnstileModule } from 'ngx-turnstile';
import { FormsModule } from '@angular/forms';
import { showErrorMessage } from '../../helpers/build-error-messages';

@Component({
  selector: 'app-reset-password',
  imports: [
    SetPasswordComponent,
    TuiCardLarge,
    TuiAppearance,
    TuiButton,
    NgxTurnstileModule,
    NgxTurnstileFormsModule,
    FormsModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly alerts = inject(TuiAlertService);
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;
  NGX_TURNSTILE_KEY = environment.NGX_TURNSTILE_KEY;

  password = '';
  tokenControl = '';

  constructor(private userService: UserService) {}
  async changePassword() {
    try {
      await this.userService.updatePassoword(this.password);
      this.alerts
        .open('Contraseña actualizada correctamente', {
          label: 'Éxito',
          appearance: 'positive',
          autoClose: 10000,
        })
        .subscribe();
    } catch (e: any) {
      showErrorMessage({
        baseMessage: 'Error al actualizar la contraseñas, intentalo de nuevo',
        alert: this.alerts,
        errorApi: e?.message,
      });
    }
  }

  onChangePassword(password: string) {
    this.password = password;
  }
}
