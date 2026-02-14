import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

import { appConfig } from './app.config';
import { appRoutes } from './app.routes';

(async () => {
  const routes = await appRoutes();
  
  bootstrapApplication(AppComponent, {...appConfig, providers: [...appConfig.providers, provideRouter(routes)]})
  .catch((err) => console.error(err));
})();

