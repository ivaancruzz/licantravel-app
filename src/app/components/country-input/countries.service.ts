import { inject, Injectable, signal } from '@angular/core';
import { TUI_COUNTRIES } from '@taiga-ui/kit';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  protected readonly countriesNames$ = inject(TUI_COUNTRIES);
  countries: { name: string; code: string }[] = [];

  constructor() {
    if (!this.countries.length) {
      this.setCountries();
    }
  }

  private setCountries() {
    this.countriesNames$.subscribe((res) => {
      for (const [key, value] of Object.entries(res)) {
        this.countries.push({ name: value, code: key });
      }
    });
  }

  getCodeByCountry(country: string) {
    return this.countries.find((c) => c.name === country)?.code;
  }

  getNameByCountryCode(code: string) {
    return this.countries.find((c) => c.code === code)?.name;
  }
}
