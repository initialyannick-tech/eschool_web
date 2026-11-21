import {
  ApplicationConfig,
  LOCALE_ID,
  importProvidersFrom,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {HttpHandlerFn, HttpRequest, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {AuthService} from './core/services/auth.service';
import {environment} from '../environments/environment';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';
import {NgxPermissionsModule} from 'ngx-permissions';

registerLocaleData(localeFr, 'fr-FR');


// INTERCEPTOR TOKEN
function tokenInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
  let authService = inject(AuthService)
  const token = authService.getToken();
  const isAuth = authService.isAuthenticate()
  const apiRegex = new RegExp(`^${environment.apiUrl}`)
  if (apiRegex.test(environment.apiUrl)) {
    if (isAuth) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(authReq);
    }
  }
  return next(request);
}





export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])),
    provideAnimations(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    provideClientHydration(),
    importProvidersFrom(NgxPermissionsModule.forRoot()),
  ]
};
