import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, forwardRef, inject, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiLet } from '@taiga-ui/cdk';
import {
  TuiDataList,
  TuiFlagPipe,
  TuiScrollable,
  TuiScrollbar,
} from '@taiga-ui/core';
import { TUI_COUNTRIES, TuiFilterByInputPipe } from '@taiga-ui/kit';
import { TuiComboBoxComponent, TuiComboBoxModule } from '@taiga-ui/legacy';
import { CountriesService } from './countries.service';

@Component({
  selector: 'app-country-input',
  imports: [
    ReactiveFormsModule,
    TuiComboBoxModule,
    ScrollingModule,
    TuiDataList,
    TuiFilterByInputPipe,
    TuiLet,
    TuiScrollable,
    TuiScrollbar,
    TuiFlagPipe,
  ],
  templateUrl: './country-input.component.html',
  styleUrl: './country-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountryInputComponent),
      multi: true,
    },
  ],
})
export class CountryInputComponent implements ControlValueAccessor {
  value: FormControl = new FormControl('');
  onChange: any = () => {};
  onTouched: any = () => {};

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

  constructor(public countriesService: CountriesService) {}

  writeValue(value: string | null): void {
    const countryName = this.countriesService.getNameByCountryCode(value || '');
    this.value.setValue(countryName);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implementar si es necesario
  }

  onValueChange(value: string) {
    // this.value.setValue(value);
    this.onChange(value);
    this.onTouched();
  }
}
