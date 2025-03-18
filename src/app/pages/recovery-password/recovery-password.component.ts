import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiIcon,
  TuiLink,
  TuiTextfield,
} from '@taiga-ui/core';
import { UserService } from '../../services/user.service';
import { TuiFieldErrorPipe, TuiLike } from '@taiga-ui/kit';
import { AsyncPipe } from '@angular/common';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recovery-password',
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
    TuiLink,
    RouterLink,
  ],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.scss',
})
export class RecoveryPasswordComponent {
  form!: FormGroup;
  private readonly alerts = inject(TuiAlertService);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
  }

  async recover() {
    try {
      const res = await this.userService.recoveryPassword(
        this.form.value.email,
      );
      this.alerts
        .open(
          `Se ha enviado un correo de recuperacion a ${this.form.value.email}`,
          {
            appearance: 'success',
            autoClose: 0,
          },
        )
        .subscribe();
      this.form.get('email')?.setValue('');
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
}
