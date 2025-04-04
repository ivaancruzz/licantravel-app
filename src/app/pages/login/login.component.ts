import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
import {
  TuiButtonLoading,
  TuiFieldErrorPipe,
  TuiPassword,
} from '@taiga-ui/kit';
import { UserService } from '../../services/user.service';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { RouterLink } from '@angular/router';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { AlertConfirmEmailComponent } from '../../components/alert-confirm-email/alert-confirm-email.component';
import { of, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgxTurnstileModule, NgxTurnstileFormsModule } from 'ngx-turnstile';
import { showErrorMessage } from '../../helpers/build-error-messages';

@Component({
  selector: 'app-login',
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
    TuiPassword,
    NgxTurnstileModule,
    NgxTurnstileFormsModule,
    TuiButtonLoading,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form!: FormGroup;
  supabaseUrl = environment.SUPABASE_URL;
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;
  NGX_TURNSTILE_KEY = environment.NGX_TURNSTILE_KEY;

  private readonly alerts = inject(TuiAlertService);
  private readonly alertConfirmEmail = this.alerts
    .open<boolean>(new PolymorpheusComponent(AlertConfirmEmailComponent), {
      label: 'Tu correo no ha sido confirmado',
      appearance: 'warning',
      autoClose: 0,
    })
    .pipe(
      switchMap(async (response: boolean, index: number) => {
        if (response) {
          try {
            await this.userService.resendEmailConfirmation(
              this.form.value.email,
            );

            return this.alerts.open(
              `Se ha enviado un correo de confirmacion a ${
                this.form.get('email')?.value
              }`,
              {
                appearance: 'success',
                autoClose: 0,
              },
            );
          } catch (e: any) {
            showErrorMessage({
              baseMessage: 'Error al enviar el correo de confirmación',
              alert: this.alerts,
              errorApi: e.message,
            });
          }
        }

        return of(false);
      }),
      takeUntil(inject(Router).events),
    );
  isLoading: boolean = false;

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
      password: ['', [Validators.required, Validators.minLength(8)]],
      tokenControl: ['', [Validators.required]],
    });
  }

  async login() {
    this.isLoading = true;
    try {
      await this.userService.signIn(
        this.form.value.email,
        this.form.value.password,
      );

      await this.sleep(500);
      location.href = '/';
    } catch (e: any) {
      let error = e?.message;
      if (e.code === 'email_not_confirmed') {
        this.alertConfirmEmail.subscribe();
        return;
      } else if (e.code === 'validation_failed') {
        error = 'Debe ingresar un usuario y contraseña';
      } else if (e.code === 'invalid_credentials') {
        error = 'Credenciales incorrectas';
      }

      showErrorMessage({
        baseMessage: 'Error al iniciar sesión',
        alert: this.alerts,
        errorApi: error,
      });
    } finally {
      this.isLoading = false;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
