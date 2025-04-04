import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      /*
      ! Cualquier Guard que regrese false, seguirá permitiendo ejecutar los demás guards, sin embargo, la ruta NO se va a mostrar
      */
      // () => {
      //   console.log('Hola Mundo');

      //   return false;
      // },
      NotAuthenticatedGuard,
    ],
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes'),
  },
];
