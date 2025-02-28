import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    /*
      ! Si usamos component en vez de loadComponent, el componente NO se cargará con lazy loading, por eso es preferible loadComponent.

      ! Si el componente que estamos cargando le agregamos default de la forma:

      !     export default class DashboardPageComponent {}

      ! no es necesario utilizar el then
    // loadComponent: () =>
    //   import('./gifs/pages/dashboard-page/dashboard-page.component').then(
    //     (c) => c.DashboardPageComponent
    //   ),
    */
    loadComponent: () =>
      import('./gifs/pages/dashboard-page/dashboard-page.component'),
    children: [
      {
        path: 'trending',
        loadComponent: () =>
          import('./gifs/pages/trending-page/trending-page.component'),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./gifs/pages/search-page/search-page.component'),
      },
      {
        path: '**',
        redirectTo: 'trending',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
