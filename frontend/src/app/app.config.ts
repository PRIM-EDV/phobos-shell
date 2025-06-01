import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';


import { routes } from './app.routes';
import { TokenService } from './auth/token.service';
import { TOKEN_SERVICE_TOKEN } from '@phobos/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: TOKEN_SERVICE_TOKEN,
      useExisting: TokenService // Replace with your actual API base URL
    }
  ]
};
