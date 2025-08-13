import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import { logginInterceptor } from './shared/interceptors/loggin.interceptors';
import { authInterceptor } from './auth/interceptors/auth.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withFetch(), withInterceptors([
    // logginInterceptor,
    authInterceptor])), ]
};
