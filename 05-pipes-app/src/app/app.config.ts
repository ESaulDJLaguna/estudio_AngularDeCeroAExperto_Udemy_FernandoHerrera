import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';

import localEs from '@angular/common/locales/es';
import localFr from '@angular/common/locales/fr';
import { LocaleService } from './services/locale.service';

registerLocaleData(localEs, 'es');
registerLocaleData(localFr, 'fr');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //! Definimos el idioma en que la aplicación va a estar
    {
      provide: LOCALE_ID,
      //! Especificamos qué valor queremos que se utilice cuando se inyecte el LOCALE_ID.
      //! Para que funcione, debemos registrar el local (es). Ese registro debe hacerse en registerLocaleData(). Pueden registrarse tantos locales se necesiten y por defecto ya existe el inglés ('en'). Este cambio se utiliza para afectar cómo se mostrarán los textos de los pipes
      // useValue: 'es', //! Establecemos un valor único de idioma
      deps: [LocaleService], //! Sería similar a una "inyección" de dependencias a este nivel
      //! useFactory es la función que se va a disparar cuando este proveedor se esté inicializando
      useFactory: (localeService: LocaleService) => localeService.getLocale,
    },
  ],
};
