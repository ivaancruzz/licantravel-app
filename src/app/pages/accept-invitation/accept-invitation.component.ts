import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiIcon,
  TuiLink,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TuiButtonLoading,
  TuiFieldErrorPipe,
  TuiPassword,
} from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { UserService } from '../../services/user.service';
import { SetPasswordComponent } from '../../components/set-password/set-password.component';
import { environment } from '../../../environments/environment';
import { NgxTurnstileFormsModule, NgxTurnstileModule } from 'ngx-turnstile';
import { showErrorMessage } from '../../helpers/build-error-messages';

@Component({
  selector: 'app-accept-invitation',
  imports: [
    ReactiveFormsModule,
    TuiTextfield,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiIcon,
    TuiCardLarge,
    TuiAppearance,
    TuiButton,
    TuiForm,
    RouterLink,
    TuiLink,
    SetPasswordComponent,
    TuiPassword,
    NgxTurnstileModule,
    FormsModule,
    NgxTurnstileFormsModule,
    TuiButtonLoading,
  ],
  templateUrl: './accept-invitation.component.html',
  styleUrl: './accept-invitation.component.scss',
})
export class AcceptInvitationComponent {
  private readonly alerts = inject(TuiAlertService);
  password = '';
  tokenControl = '';
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;
  NGX_TURNSTILE_KEY = environment.NGX_TURNSTILE_KEY;

  loading = false;

  constructor(private userService: UserService) {}

  onChangePassword(password: string) {
    this.password = password;
  }

  async acceptInvitation() {
    this.loading = true;
    try {
      await this.userService.acceptInvitation(this.password);

      location.href = '/registro';
    } catch (e: any) {
      showErrorMessage({
        baseMessage: 'Error al aceptar la invitación, intentalo de nuevo',
        alert: this.alerts,
        errorApi: e?.message,
      });
    } finally {
      this.loading = false;
    }
  }
}
