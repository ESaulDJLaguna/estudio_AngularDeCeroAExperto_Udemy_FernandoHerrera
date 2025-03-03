import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //! Sin el withFetch(), Angular utiliza de fondo las peticiones xhr (las peticiones tradicionales). Para trabajar con el nuevo estardar fetch, utilizamos el withFetch(). Ahora las peticiones siempre pasan por los Observables, pero en el fondo es una petición fetch
    provideHttpClient(withFetch()),
  ],
};
