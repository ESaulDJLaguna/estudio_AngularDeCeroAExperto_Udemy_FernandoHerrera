import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  templateUrl: './counter-page.component.html',
  styles: `
  //! Cuando el CSS tiene más de dos clases a las que se le aplica estilos, se recomienda una hoja de estilso por separado
  button {
    padding: 5px;
    margin: 5px 10px;
    width: 75px;
  }
  `,
  /*
    ! Actualmente Angular busca ser Zoneless, es decir, trabajar sin la librería ZoneJS.

    ! ZoneJS es una librería externa a Angular que se encarga del ciclo de detección de cambios. ZoneJS siempre está al pendiente de los cambios que existen, por ejemplo en una propiedad y realiza el cambio. Esto trae mejoras de velocidad en la aplicación.

    ! Para más información: https://angular.dev/guide/experimental/zoneless
  */
  //! "Cambia" a Zoneless un componente (no de manera global)
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterPageComponent {
  counter = 10;
  counterSignal = signal(10);

  // constructor() {
  //   /*
  //   ! Para demostrar cómo funciona ZoneJS (comentar changeDetection) o Zoneless (mantener changeDetection) actualizaremos 'counter' cada 3 segundos. Usando ZoneJS actualizará el HTML. Sin usar ZoneJS (Zoneless) no cambiará su valor
  //   */
  //   setInterval(() => {
  //     //! Si trabajamos con Zoneless, para demostrar que no se actualiza el counter en el HTML, debe comentarse la señal, ya que al actualizar la señal, Angular sabe que ha habido un cambio y sí actualiza el counter, por eso pareciera que "no funciona".
  //     this.counter++;
  //     // this.counterSignal.update((v) => v + 1);
  //     console.log('Tick.');
  //   }, 3000);
  // }

  increaseBy(value: number) {
    this.counter += value;
    //! Cuando queremos actualizar el valor de una señal, pero depende del valor anterior de la señal se recomienda realizar un update
    this.counterSignal.update((current) => current + value);
  }

  resetCounter() {
    this.counter = 0;
    //! Establecemos un nuevo valor a la señal
    this.counterSignal.set(0);
  }
}
