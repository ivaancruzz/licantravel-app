import { Component, effect, inject } from '@angular/core';
import { UserPanelLayoutComponent } from '../../../layouts/user-panel-layout/user-panel-layout.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { TuiDay, TuiLet } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiTextfield,
  TuiError,
  TuiIcon,
  TuiGroup,
  TuiButton,
  TuiDataList,
  TuiScrollable,
  TuiScrollbar,
  TuiFlagPipe,
  TuiLoader,
  TuiAlertService,
  TuiLink,
  TuiNotification,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipe,
  TuiRadio,
  TuiBlock,
  TuiStepper,
  TuiPassword,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TUI_COUNTRIES,
  TuiFade,
} from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { TuiInputDateModule, TuiComboBoxModule } from '@taiga-ui/legacy';
import { NgxMaskDirective } from 'ngx-mask';
import { Gender, Role, UserService } from '../../../services/user.service';
import { User } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import { CountryInputComponent } from '../../../components/country-input/country-input.component';
import { CountriesService } from '../../../components/country-input/countries.service';

@Component({
  selector: 'app-my-data',
  imports: [
    UserPanelLayoutComponent,
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
    CountryInputComponent,
    TuiLink,
    TuiNotification,
    TuiFade,
  ],
  templateUrl: './my-data.component.html',
  styleUrl: './my-data.component.scss',
})
export class MyDataComponent {
  private readonly alerts = inject(TuiAlertService);

  countries: any[] = [];
  form!: FormGroup;
  Gender = Gender;
  user!: User;
  Role = Role;
  protected breadcrumbs = [
    {
      caption: 'Ajustes',
    },
    {
      caption: 'Mis Datos',
    },
  ];

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

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    public countriesService: CountriesService,
  ) {
    effect(() => {
      const user = this.userService._session()?.user;
      if (user) {
        this.user = user;
        const birthday = dayjs(this.user.user_metadata['birthday']);

        this.form.patchValue({
          email: this.user.email,
          first_name: this.user.user_metadata['first_name'],
          last_name: this.user.user_metadata['last_name'],
          phone: this.user.user_metadata['phone'],
          document: this.user.user_metadata['document'],
          gender: this.user.user_metadata['gender'],
          birthday: new TuiDay(
            birthday.year(),
            birthday.month(),
            birthday.date(),
          ),
          nationality: this.user.user_metadata['nationality'],
        });

        this.form.updateValueAndValidity();
      }
    });
  }

  async ngOnInit() {
    this.buildFormClient();
  }

  async register() {
    try {
      const body = { ...this.form.getRawValue() };
      delete body.email;
      delete body.rut;
      const nationality = this.countriesService.getCodeByCountry(
        this.nationality?.value,
      );

      await this.userService.updateUser({
        ...body,
        nationality: nationality,
      });
    } catch (e: any) {
      console.error(e);
      this.alerts
        .open('Error al actualizar datos' + e?.message, {
          label: 'Error',
          appearance: 'negative',
        })
        .subscribe();
    }
  }

  buildFormClient() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.minLength(10)]],
      document: ['', [Validators.required, Validators.minLength(8)]],
      gender: [Gender.male, [Validators.required]],
      birthday: [undefined, [Validators.required]],
      nationality: ['', [Validators.required]],
    });

    this.email?.disable();
    this.document?.disable();
  }

  getDayName(dayNumber: number): string {
    return dayjs().day(dayNumber).format('dddd');
  }

  get nationality() {
    return this.form.get('nationality');
  }

  get email() {
    return this.form.get('email');
  }

  get document() {
    return this.form.get('document');
  }
}
