import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';

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
import { isPlatformServer } from '@angular/common';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideHttpClient(),
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
      const platformId = inject(PLATFORM_ID);

      return new Promise((resolve, reject) => {
        ngxPermissionsService.loadPermissions([Role.anon]);
        if (isPlatformServer(platformId)) {
          resolve(true);
          return;
        }

        userService
          .getUser()
          .then(async (data) => {
            ngxPermissionsService.loadPermissions([
              data?.user?.role || Role.anon,
            ]);
            resolve(true);
          })
          .catch(() => resolve(false));
      });
    }),
  ],
};
