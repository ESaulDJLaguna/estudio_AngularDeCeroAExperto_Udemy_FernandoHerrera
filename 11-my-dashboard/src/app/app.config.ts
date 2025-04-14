import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      /*
      ! Configurar el View Transition es muy fácil desde la versión de angular 17+. En las versiones anteriores también es posible pero tiene otra implementación.

      ! Cuando hablamos de View Transition nos referimos a la animación que se muestra cuando navegamos entre las pantallas de la aplicación. Esta opción mejora la forma en que se ve esta navegación
      */
      withViewTransitions({
        //! Al recargar el navegador, la vista actual no se mostrará la animación de la transición
        skipInitialTransition: true,

        /*
        ! Devolverá cierta información sobre la transición, como qué ruta es, en qué ruta se estaba, etc., y es útil si se necesita personalizar de dónde viene, a dónde va, si ya terminó la transición, si está ejecutándose, entre otras cosas.
        */
        // onViewTransitionCreated(transitionInfo) {
        //   console.log({ transitionInfo });
        // },
      })
    ),
    /*
    ! Como ya no existe un app.module que es lo que usualmente usábamos para importar módulos de manera global. Ahora tendremos que hacerlo dentro de importProvidersFrom
    */
    // importProvidersFrom(HttpClientModule),
    //! Forma de utilizar HttpClient en Angular 19+
    provideHttpClient(withFetch()),
  ],
};
