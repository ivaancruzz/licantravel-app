import { Component, inject } from '@angular/core';
import { UserPanelLayoutComponent } from '../../../layouts/user-panel-layout/user-panel-layout.component';
import { TuiForm } from '@taiga-ui/layout';
import {
  TuiAlertService,
  TuiButton,
  TuiError,
  TuiIcon,
  TuiNotification,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import { SetPasswordComponent } from '../../../components/set-password/set-password.component';
import { FormsModule } from '@angular/forms';
import { TuiFieldErrorPipe, TuiPassword } from '@taiga-ui/kit';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-change-password',
  imports: [
    UserPanelLayoutComponent,
    TuiButton,

    TuiIcon,
    TuiNotification,
    TuiTitle,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private readonly alerts = inject(TuiAlertService);

  protected breadcrumbs = [
    {
      caption: 'Ajustes',
    },
    {
      caption: 'Cambiar contraseña',
    },
  ];

  constructor(private userService: UserService) {}

  async save() {
    try {
      await this.userService.recoveryPassword(
        this.userService._session()?.user.email as string,
      );
      this.userService.signOut();
    } catch (e: any) {
      console.log(e);
      this.alerts
        .open(e || 'Error al actualizar la contraseña', {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }
}
