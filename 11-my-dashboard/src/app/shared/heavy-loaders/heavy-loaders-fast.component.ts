import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-heavy-loaders-fast',
  imports: [NgClass],
  template: `
    <section [ngClass]="['w-full', cssClass()]">
      <ng-content />
    </section>
  `,
  styles: ``,
})
export class HeavyLoadersFastComponent {
  cssClass = input.required<string>();

  constructor() {
    console.log('HeavyLoadersFastComponent creado');
  }
}
