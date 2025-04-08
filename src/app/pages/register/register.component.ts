import { Component, inject } from '@angular/core';
import { Gender, Role, UserService } from '../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import {
  TuiAlertService,
  TuiAppearance,
  TuiBreakpointService,
  TuiButton,
  TuiDataList,
  TuiError,
  TuiFlagPipe,
  TuiGroup,
  TuiIcon,
  TuiLink,
  TuiLoader,
  TuiScrollable,
  TuiScrollbar,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TuiBlock,
  TuiButtonLoading,
  TuiConnected,
  TuiDataListWrapper,
  TuiFieldErrorPipe,
  TuiFilterByInputPipe,
  tuiInputDateOptionsProvider,
  TuiPassword,
  TuiRadio,
  TuiStepper,
  TuiStringifyContentPipe,
} from '@taiga-ui/kit';
import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { TuiComboBoxModule, TuiInputDateModule } from '@taiga-ui/legacy';
import { TuiDay, TuiDayRange, TuiLet } from '@taiga-ui/cdk';
import { NgxMaskDirective } from 'ngx-mask';
import country from 'country-list-js';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TUI_COUNTRIES } from '@taiga-ui/kit';
import { SetPasswordComponent } from '../../components/set-password/set-password.component';
import { CountryInputComponent } from '../../components/country-input/country-input.component';
import { RouterLink } from '@angular/router';
import { CountriesService } from '../../components/country-input/countries.service';
import { environment } from '../../../environments/environment';
import { NgxTurnstileModule, NgxTurnstileFormsModule } from 'ngx-turnstile';
import dayjs from 'dayjs';
@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    TuiCardLarge,
    TuiAppearance,
    TuiForm,
    TuiTextfield,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiIcon,
    TuiGroup,
    TuiInputDateModule,
    FormsModule,
    TuiRadio,
    TuiBlock,
    TuiStepper,
    NgxMaskDirective,
    TuiButton,
    TuiPassword,
    TuiComboBoxModule,
    TuiDataListWrapper,
    ScrollingModule,
    TuiComboBoxModule,
    TuiDataList,
    TuiFilterByInputPipe,
    TuiLet,
    TuiScrollable,
    TuiScrollbar,
    JsonPipe,
    TuiFlagPipe,
    TuiLoader,
    SetPasswordComponent,
    TuiConnected,
    CountryInputComponent,
    TuiLink,
    RouterLink,
    NgxTurnstileModule,
    NgxTurnstileFormsModule,
    NgClass,
    TuiButtonLoading,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  protected readonly breakpoint$ = inject(TuiBreakpointService);
  private readonly alerts = inject(TuiAlertService);
  formFirstStep!: FormGroup;
  formSecondStep!: FormGroup;
  Gender = Gender;
  activeItemIndex = 0;

  protected readonly matcherString = (
    country: any,
    search: string,
  ): boolean => {
    return (
      country.name
        .split(' ')
        .pop()
        ?.toLowerCase()
        .startsWith(search.toLowerCase()) ?? false
    );
  };

  accountStatus: 'IN_PROGRESS' | 'PENDING' | 'CONFIRMED' = 'IN_PROGRESS';
  isLoading = false;
  confirmMessage = '';
  NGX_STORAGE_RESOURCES = environment.NGX_STORAGE_RESOURCES;
  NGX_TURNSTILE_KEY = environment.NGX_TURNSTILE_KEY;
  protected max = TuiDay.currentLocal();

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) {}

  async ngOnInit() {
    if (await this.accountIsValid()) return;

    this.formFirstStep = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone: ['', [Validators.minLength(10)]],
      document: ['', [Validators.required]],
      gender: [Gender.female, [Validators.required]],
      birthday: [undefined, [Validators.required]],
      nationality: ['', [Validators.required]],
    });

    this.formSecondStep = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.min(8)]],
      tokenControl: ['', [Validators.required]],
    });
  }

  async accountIsValid() {
    this.isLoading = true;
    try {
      let user;
      user = this.userService._session();

      const isConfirmed = !!user?.confirmed_at;
      if (isConfirmed) {
        this.accountStatus = 'CONFIRMED';
        this.confirmMessage = 'Tu cuenta ha sido confirmada.';

        if (!user?.user_metadata['is_active']) {
          console.log('confirmado');
          await this.userService.confirmAccount(user?.id as string);
        }

        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async register() {
    this.isLoading = true;
    try {
      const nationality = this.countriesService.getCodeByCountry(
        this.nationality?.value,
      );
      console.log(this.nationality?.value);
      const body: SignUpWithPasswordCredentials = {
        email: this.formSecondStep.value.email,
        password: this.formSecondStep.value.password,
        options: {
          data: {
            ...this.formFirstStep.value,
            nationality: nationality,
          },
          emailRedirectTo: `${location.origin}/registro`,
        },
      };

      await this.userService.register(body);
      this.accountStatus = 'PENDING';
      this.confirmMessage =
        'Para continuar, revisa tu correo y confirma tu cuenta.';
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al crear la cuenta' + e?.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    } finally {
      this.isLoading = false;
    }
  }

  onChangePassword(password: string) {
    this.password?.setValue(password);
  }

  get password() {
    return this.formSecondStep.get('password');
  }

  get nationality() {
    return this.formFirstStep.get('nationality');
  }
}
