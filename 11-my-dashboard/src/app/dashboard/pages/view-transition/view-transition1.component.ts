import { Component } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';

/*
! El objetivo es realizar una animación de un elemento entre pantallas. Es decir, si en una pantalla se tiene un elemento y se navega a una segunda y ahí también se tiene el mismo elemento pero en una posición diferente, entonces el navegador web se encargará de hacer esa transición por nosotros.

!> Tengamos presente la compatibilidad con los navegadores: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
*/

@Component({
  selector: 'app-view-transition',
  imports: [TitleComponent],
  template: `
    <app-title inputTitle="View Transition" />

    <section class="flex justify-start">
      <!--! srcset: permite realizar varias optimizaciones de código -->
      <!--! view-transition-name: debe ser un nombre único en la pantalla actual, o no sabrá cuál animar -->
      <img
        srcset="https://picsum.photos/id/237/200/300"
        alt="Picsum"
        width="200"
        height="300"
        style="view-transition-name: hero1;"
      />

      <!--! 'view-transition-name: uniqueName'. El navegador se encarga de 'animar' la transición entre elementos. Es decir, busca el uniqueName de la pantalla actual y realiza una animación de movimiento al uniqueName de la siguiente pantalla. uniqueName no puede repetirse en la misma pantalla o el navegador no sabrá hacia cuál hacer la animiación. Puede haber tantos 'view-transition-name' se requieran en una misma pantalla y ser diferentes en una segunda, es decir, en la pantalla uno podría haber 3 y en una segunda pantalla solo 1 y solo se realizará la transición si es que coincide uno de los nombres de la pantalla 1 a la pantalla 2. Los elementos no tienen por qué ser exactamente iguales podrían ser totalmente diferentes, pero quizá estéticamente no se vería tan bien. -->

      <div
        class="bg-blue-500 w-56 h-56"
        style="view-transition-name: hero2;"
      ></div>
    </section>
  `,
})
export default class ViewTransition1Component {}
