import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    /*
    ! Es una estrategia para la detección de cambios de Angular. Actualmente "hay dos maneras de trabajar":
      ! 1. Utilizando properties. Declara una propiedad en el ts y se utiliza en el html
      ! 2. Utilizando señales.
    ! Con provideZoneChangeDetection(), podemos cambiar cómo queremos que Angular trabaje en cuanto al manejo de su estado.
    ! Por lo tanto, esta función le sirve a Angular para saber cómo queremos que funcione internamente la aplicación.
    */
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    /*
      ! HashStrategy. Agrega # entre las rutas: dominio.com/#/

      ! El # es en pocas palabras como un indicador que no hace que el navegador web redireccione a esa carpeta, simplemente estamos SIEMPRE en el root, pero se añade #/ruta y Angular sabe qué hacer.

      !> Hay que tener en cuenta que hacer esto NO es SEO frendly. Solo se indexaría la página principal.
    */
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
};
