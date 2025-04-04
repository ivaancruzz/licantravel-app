import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
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
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { TuiValidationErrors } from './helpers/tuiErros';
import { TUI_DATE_FORMAT, TUI_DEFAULT_DATE_FORMAT } from '@taiga-ui/core';
import { TUI_LANGUAGE } from '@taiga-ui/i18n';
import { map } from 'rxjs';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { SupabaseService } from './services/supabase.service';
import { Role, UserService } from './services/user.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideEnvironmentNgxMask(),
    importProvidersFrom(NgxPermissionsModule.forRoot()),
    NG_EVENT_PLUGINS,
    TuiValidationErrors,
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
    provideAppInitializer(() => {
      const userService = inject(UserService);
      const ngxPermissionsService = inject(NgxPermissionsService);
      return new Promise((resolve, reject) => {
        ngxPermissionsService.loadPermissions([Role.anon]);

        userService
          .getUser()
          .then((data) => {
            ngxPermissionsService.loadPermissions([data?.role || Role.anon]);
            resolve(true);
          })
          .catch(() => resolve(false));
      });
    }),
  ],
};
