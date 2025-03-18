import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideHttpClient } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { TuiValidationErrors } from './helpers/tuiErros';
import { AblePipe } from '@casl/angular';
import { createMongoAbility, PureAbility } from '@casl/ability';
import { TUI_DATE_FORMAT, TUI_DEFAULT_DATE_FORMAT } from '@taiga-ui/core';
import { TUI_LANGUAGE } from '@taiga-ui/i18n';
import { map } from 'rxjs';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideHttpClient(),
    provideEnvironmentNgxMask(),
    NG_EVENT_PLUGINS,
    TuiValidationErrors,
    { provide: PureAbility, useValue: createMongoAbility() },
    {
      provide: TUI_DATE_FORMAT,
      useFactory: () =>
        inject(TUI_LANGUAGE).pipe(
          map(() => ({
            ...TUI_DEFAULT_DATE_FORMAT,
            mode: 'DMY',
            separator: '/',
          })),
        ),
    },
  ],
};
