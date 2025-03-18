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
import { AsyncPipe, JsonPipe } from '@angular/common';
import { TuiComboBoxModule, TuiInputDateModule } from '@taiga-ui/legacy';
import { TuiDay, TuiLet } from '@taiga-ui/cdk';
import { NgxMaskDirective } from 'ngx-mask';
import country from 'country-list-js';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TUI_COUNTRIES } from '@taiga-ui/kit';
import { SetPasswordComponent } from '../../components/set-password/set-password.component';
import { CountryInputComponent } from '../../components/country-input/country-input.component';
import { RouterLink } from '@angular/router';
import { CountriesService } from '../../components/country-input/countries.service';
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
  passwordValidations = {
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  };
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

  confirmAccount: boolean | null = null;
  confirmMessage = 'No pudimos confirmar tu cuenta';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) {}

  async ngOnInit() {
    const user = await this.userService.getUser();
    this.confirmAccount = !!user?.confirmed_at;

    if (user?.confirmed_at) {
      this.activeItemIndex = 2; // confirm
      this.confirmMessage = 'Tu cuenta ha sido confirmada';
      if (this.confirmAccount && user.user_metadata['is_active'] === false) {
        await this.userService.confirmAccount(user.id);
      }
      return;
    }

    this.formFirstStep = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone: ['', [Validators.minLength(10)]],
      document: ['', [Validators.required]],
      gender: [Gender.male, [Validators.required]],
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
    });
  }

  async register() {
    try {
      const nationality = this.countriesService.getCodeByCountry(
        this.nationality?.value,
      );
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
      this.activeItemIndex = 2;
      this.confirmMessage = 'Revisa tu correo para confirmar tu cuenta';
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
    this.password?.setValue(password);
  }

  get password() {
    return this.formSecondStep.get('password');
  }

  get nationality() {
    return this.formFirstStep.get('nationality');
  }
}
