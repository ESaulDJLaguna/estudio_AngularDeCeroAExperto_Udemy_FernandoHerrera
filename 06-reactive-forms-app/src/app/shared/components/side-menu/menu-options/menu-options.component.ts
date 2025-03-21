import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { MenuItem } from '../../../interfaces/menu-item.interface';

@Component({
  selector: 'menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-options.component.html',
  styles: `li {cursor: pointer;}`,
})
export class MenuOptionsComponent {
  title = input.required<string>();
  menuOptions = input.required<MenuItem[]>();
}
