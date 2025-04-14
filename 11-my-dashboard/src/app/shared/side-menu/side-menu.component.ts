import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  styles: ``,
})
export class SideMenuComponent {
  public menuItems = routes
    .map((route) => route.children ?? [])
    //! flat(): lo que hace es que si tenemos un arreglo de arreglos, "aplana" dicho valor y lo "convierte" en un arreglo único
    .flat()
    .filter((route) => route && route.path)
    .filter((route) => !route.path!.includes(':'));

  constructor() {
    // const dashboardRoutes = routes
    //   .map((route) => route.children ?? [])
    //   .flat()
    //   .filter((route) => route && route.path)
    //   .filter((route) => !route.path!.includes(':'));
    // console.log(dashboardRoutes);
  }
}
