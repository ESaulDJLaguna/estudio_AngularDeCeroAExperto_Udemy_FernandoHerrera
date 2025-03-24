import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    //! provideZoneChangeDetection y provideExperimentalZonelessChangeDetection NO pueden estar configurados al mismo tiempo
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //! Activamos GLOBALMENTE el uso de Zoneless
    // provideExperimentalZonelessChangeDetection(),
  ],
};
