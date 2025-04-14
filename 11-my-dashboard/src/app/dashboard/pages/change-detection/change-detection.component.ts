import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';

/*
! Angular tiene una librería llamada zone.js que es la que se encarga que el framework pueda estar pendiente a los cambios que suceden en cualquier punto del tiempo y se encarga de mantenerlos en sincronía.

! Angular se está moviendo poco a poco a ser 'zoneless', es decir, que Angular esté menos pendiente de ese estado y la sincronía propiamente y que sean las señales o ciertas etapas del ciclo de vida propiamente de Angular que le digan cuándo tiene que volver a hacer esa verificación, en lugar de estar pendiente en todo momento de que en cualquier lugar venga un cambio.

! Para habilitar este comportamiento, podemos cambiar el ChangeDetectionStrategy que por defecto está como Default (CheckAlways), por OnPush. OnPush está pendiente en menos ciclos de vida o menos puntos de cambio de nuestra aplicación.

! Si habilitamos el OnPush, después de los 3 segundos dentro del setTimeout NO se ejecutará la instrucción:

¡¿  this.frameworkAsProperty.name = 'React'

! Pero, la idea es que nosotros dejemos que las señales, que mejoran enormemente el perfomance de Angular, se encargue de los cambios. Si trabajamos zoneless con señales es mucho más rápico que React en muchos aspectos.

! El beneficio de utilizar OnPush es que Angular está menos pendientes de los cambios y deja que las señales hagan el juego y mejora la velocidad y el performance.
*/

@Component({
  selector: 'app-change-detection',
  imports: [TitleComponent, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-title [inputTitle]="currentFramework()" />

    <pre>{{ frameworkAsSignal() | json }}</pre>
    <pre>{{ frameworkAsProperty | json }}</pre>
  `,
  styles: ``,
})
export default class ChangeDetectionComponent {
  public currentFramework = computed(
    () => `Change detection - ${this.frameworkAsSignal().name}`
  );

  public frameworkAsSignal = signal({
    name: 'Angular',
    releaseYear: 2016,
  });

  public frameworkAsProperty = {
    name: 'Angular',
    releaseYear: 2016,
  };

  constructor() {
    setTimeout(() => {
      //! Si se habilita ChangeDetectionStrategy.OnPush, después de los 3 segundos NO cambiará el valor de la propiedad. Para cambiar el valor de la propiedad, usamos la señal
      // this.frameworkAsProperty.name = 'React';

      //! Hacer este cambio por señales y no de la forma anterior, mejora considerablemente la velocidad de nuestra aplicación.
      this.frameworkAsSignal.update((value) => ({
        ...value,
        name: 'React',
      }));
      //! Otra forma de actualizar un valor de una señal
      this.frameworkAsSignal.update((value) => {
        value.name = 'React';

        return { ...value };
      });
      console.log('Hecho');
    }, 3000);
  }
}
