import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { TuiFieldErrorPipe, TuiPassword } from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { UserService } from '../../services/user.service';
import { SetPasswordComponent } from '../../components/set-password/set-password.component';

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
  ],
  templateUrl: './accept-invitation.component.html',
  styleUrl: './accept-invitation.component.scss',
})
export class AcceptInvitationComponent {
  private readonly alerts = inject(TuiAlertService);
  password = '';

  constructor(private userService: UserService) {}

  onChangePassword(password: string) {
    this.password = password;
  }

  async acceptInvitation() {
    try {
      await this.userService.acceptInvitation(this.password);

      // location.href = '/';
    } catch (e: any) {
      console.error(e);
    }
  }
}
