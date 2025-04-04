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
import { environment } from '../../../environments/environment';
import { NgxTurnstileFormsModule, NgxTurnstileModule } from 'ngx-turnstile';

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
    NgxTurnstileModule,
    NgxTurnstileFormsModule,
  ],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.scss',
})
export class RecoveryPasswordComponent {
  form!: FormGroup;
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;
  NGX_TURNSTILE_KEY = environment.NGX_TURNSTILE_KEY;

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
      tokenControl: ['', [Validators.required]],
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
      this.form.disable();
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
