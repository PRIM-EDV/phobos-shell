import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { AUTHZ_SERVICE_TOKEN, TOKEN_SERVICE_TOKEN } from '@phobos/core';

import { TokenService } from './auth/token.service';
import { AuthzService } from './auth/authz.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideHttpClient(),
    {
      provide: AUTHZ_SERVICE_TOKEN,
      useExisting: AuthzService
    },
    {
      provide: TOKEN_SERVICE_TOKEN,
      useExisting: TokenService
    }
  ]
};
