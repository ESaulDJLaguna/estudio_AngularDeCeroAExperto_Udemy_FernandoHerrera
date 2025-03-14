import {
  Component,
  effect,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  placeholder = input<string>('Buscar');
  debounceTime = input(300);
  initialValue = input<string>();

  value = output<string>();

  //! Si el tipo fuera un signal() NO se va a establecer el valor en el value el input.
  //! linkedSignal nos va a permitir a nosotros inicializar una señal con algún tipo de proceso y después de realizar ese proceso, se podrá trabajar como cualquier otra señal. La diferencia es que este linkedSignal nos va a permitir inicializarla con algún proceso computacional.
  //! CUANDO TENEMOS UNA SEÑAL QUE NECESITA SER INICIALIZADA, DEBE USARSE linkedSignal
  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

  //! Los efectos tienen una función de limpieza (onCleanup: EffectCleanupRegisterFn). Esta es una función que se va a disparar cada vez que el efecto se va a limpiar. Hay varios puntos en los cuales estas limpiezas se van a disparar, por ejemplo: cuando se destruye el componente, cuando la señal o el efecto se vuelve a disparar
  debounceEffect = effect((onCleanup) => {
    //! Cada vez que Angular detecta que hay una señal dentro de un efecto y la señal cambia, se dispara el efecto
    const value = this.inputValue();

    const timeout = setTimeout(
      () => this.value.emit(value),
      this.debounceTime()
    );

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
