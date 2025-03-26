import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.component.html',
  styles: ``,
})
export class NavbarComponent {
  router = inject(Router);

  routes = routes
    .map((route) => ({
      path: route.path,
      title: `${route.title ?? 'Maps en Angular'}`,
    }))
    .filter((route) => route.path !== '**');

  //! El símbolo $ se pone solo para identificar y saber que el objeto definito es un tipo Subscription o un Observable
  pageTitle$ = this.router.events.pipe(
    tap((event) => {
      // console.log(`Before:\n${event}`);
    }),
    //! NavigationEnd nos indica en qué ruta quedó después de todo el proceso de navegación.
    filter((event) => event instanceof NavigationEnd),
    tap((event) => {
      // console.log(`\n\nAfter:\n${event}`);
    }),
    // map((event) => event.url),
    map((event) => {
      let url =
        event.url !== event.urlAfterRedirects
          ? event.urlAfterRedirects
          : event.url;

      return routes.find((route) => `/${route.path}` === url)?.title ?? 'Mapas';
    })
  );

  //! Si quisiéramos trabajar el Observable como una señal
  pageTitle = toSignal(
    this.router.events.pipe(
      tap((event) => {
        // console.log(`Before:\n${event}`);
      }),
      //! NavigationEnd nos indica en qué ruta quedó después de todo el proceso de navegación.
      filter((event) => event instanceof NavigationEnd),
      tap((event) => {
        // console.log(`\n\nAfter:\n${event}`);
      }),
      // map((event) => event.url),
      map((event) => {
        let url =
          event.url !== event.urlAfterRedirects
            ? event.urlAfterRedirects
            : event.url;

        return (
          routes.find((route) => `/${route.path}` === url)?.title ?? 'Mapas'
        );
      })
    )
  );
}
