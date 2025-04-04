import { Component, HostListener, inject } from '@angular/core';
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
import {
  TuiButtonLoading,
  TuiFieldErrorPipe,
  TuiPassword,
} from '@taiga-ui/kit';
import { UserService } from '../../../services/user.service';
import {
  TuiResponsiveDialog,
  TuiResponsiveDialogOptions,
} from '@taiga-ui/addon-mobile';
import { showErrorMessage } from '../../../helpers/build-error-messages';
import { environment } from '../../../../environments/environment';
import { NgxTurnstileFormsModule, NgxTurnstileModule } from 'ngx-turnstile';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [
    UserPanelLayoutComponent,
    TuiButton,
    TuiResponsiveDialog,
    TuiIcon,
    TuiNotification,
    TuiTitle,
    SetPasswordComponent,
    TuiButtonLoading,
    NgxTurnstileModule,
    FormsModule,
    NgxTurnstileFormsModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  protected readonly options: Partial<TuiResponsiveDialogOptions> = {
    label: 'Cambiar contraseña',
    size: 's',
    dismissible: false,
    closeable: false,
  };
  private readonly alerts = inject(TuiAlertService);

  open = true;
  password = '';
  loading: boolean = false;
  tokenControl = '';
  NGX_TURNSTILE_KEY = environment.NGX_TURNSTILE_KEY;

  protected breadcrumbs = [
    {
      caption: 'Ajustes',
    },
    {
      caption: 'Cambiar contraseña',
    },
  ];

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    const changePassword = localStorage.getItem('changePassword');
    this.open = changePassword === 'true';
  }

  async save() {
    try {
      await this.userService.recoveryPassword(
        this.userService._session()?.email as string,
      );
      localStorage.setItem('changePassword', 'true');
      this.router.navigate(['ingresar']);
      this.alerts
        .open('Se ha enviado un correo de restablecimiento', {
          label: 'Éxito',
          appearance: 'positive',
          autoClose: 10000,
        })
        .subscribe();
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

  async change() {
    this.loading = true;
    localStorage.removeItem('changePassword');
    try {
      await this.userService.updatePassoword(this.password);
      this.open = false;
      this.alerts.open('Contraseña actualizada correctamente', {
        label: 'Éxito',
        appearance: 'positive',
        autoClose: 10000,
      });
    } catch (e: any) {
      showErrorMessage({
        baseMessage: 'Error al actualizar la contraseña, intentalo de nuevo',
        alert: this.alerts,
        errorApi: e?.message,
      });
    } finally {
      this.loading = false;
    }
  }

  cancel() {
    localStorage.removeItem('changePassword');
    this.open = false;
  }

  onChangePassword(password: string) {
    this.password = password;
  }
}
