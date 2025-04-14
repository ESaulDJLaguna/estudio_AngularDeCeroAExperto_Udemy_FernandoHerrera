import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

/*
! Este va a ser un componente BLOQUEANTE (super pesado), por lo que va a tardar mucho en crearse (lo cual NO debe hacerse en la vida real, pero se utilizará por motivos de ejemplo). La idea de este componente BLOQUEANTE es que cuando se llame al constructor haga un proceso que bloquee todo (se bloqueará javaScript)
*/

@Component({
  selector: 'app-heavy-loaders-slow',
  imports: [NgClass],
  template: `
    <section [ngClass]="['w-full h-[800px]', cssClass()]">
      Heavy Loader Slow
    </section>
  `,
  styles: ``,
})
export class HeavyLoadersSlowComponent {
  cssClass = input.required<string>();

  constructor() {
    //! Bloquearemos la aplicación por 3 segundos. No se podrá hacer nada durante ese tiempo.
    const start = Date.now();

    while (Date.now() - start < 3000) {}

    console.log('Cargado');
  }
}
