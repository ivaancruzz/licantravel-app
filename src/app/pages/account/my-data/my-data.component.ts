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
  TuiButtonLoading,
} from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { TuiInputDateModule, TuiComboBoxModule } from '@taiga-ui/legacy';
import { NgxMaskDirective } from 'ngx-mask';
import { Gender, Role, UserService } from '../../../services/user.service';
import { User } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import { CountryInputComponent } from '../../../components/country-input/country-input.component';
import { CountriesService } from '../../../components/country-input/countries.service';
import { showErrorMessage } from '../../../helpers/build-error-messages';
import { Tables } from '../../../lib/database.types';

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
    TuiButtonLoading,
  ],
  templateUrl: './my-data.component.html',
  styleUrl: './my-data.component.scss',
})
export class MyDataComponent {
  private readonly alerts = inject(TuiAlertService);

  countries: any[] = [];
  form!: FormGroup;
  Gender = Gender;
  user!: Tables<'clients'>;
  clientProfile: Tables<'clients'> | null = null;
  Role = Role;
  loading = false;
  protected max = TuiDay.currentLocal();
  protected breadcrumbs = [
    {
      caption: 'Ajustes',
    },
    {
      caption: 'Mis Datos',
    },
  ];

  constructor(
    public userService: UserService,
    private fb: FormBuilder,
    public countriesService: CountriesService,
  ) {}

  async ngOnInit() {
    this.buildFormClient();

    if (this.userService._session()?.role === Role.client) {
      this.clientProfile = await this.userService.getClientProfile();

      this.form.patchValue({
        ...this.clientProfile,
        birthday: new TuiDay(
          dayjs(this.clientProfile?.birthday).year(),
          dayjs(this.clientProfile?.birthday).month(),
          dayjs(this.clientProfile?.birthday).date(),
        ),
      });
    }
  }

  async save() {
    this.loading = true;
    try {
      const body = { ...this.form.getRawValue() };
      delete body.email;
      delete body.document;

      let nationality = this.clientProfile?.nationality;

      // Si la nacionalidad ha cambiado, obtenemos el código de la nueva nacionalidad (ya que el value es el nombre de la nacionalidad)
      // Si no lo ha cambiado usamos el codigo que tenia
      if (this.clientProfile?.nationality !== this.nationality?.value) {
        nationality = this.countriesService.getCodeByCountry(
          this.nationality?.value,
        );
      }

      await this.userService.updateProfile({
        ...body,
        nationality: nationality,
      });

      this.alerts
        .open('Datos actualizados correctamente', {
          label: 'Éxito',
          appearance: 'positive',
          autoClose: 10000,
        })
        .subscribe();
    } catch (e: any) {
      showErrorMessage({
        baseMessage: 'Error al actualizar los datos',
        alert: this.alerts,
        errorApi: e?.message,
      });
    } finally {
      this.loading = false;
    }
  }

  buildFormClient() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.minLength(10)]],
      document: ['', [Validators.required, Validators.minLength(8)]],
      gender: [Gender.female, [Validators.required]],
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
