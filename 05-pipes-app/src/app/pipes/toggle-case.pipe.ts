import { Pipe, PipeTransform } from '@angular/core';

/*
! Para que una clase se convierte en un pipe NO solo se debe utilizar el decorador @Pipe, sino que también debe implementar la interfaz PipeTransform.

! PipeTransform nos va a permitir ejecutar el método "transform()" cada vez que cambie la data en la cual estamos asociando el Pipe, si por ejemplo, la data fuera una señal y la señal cambiara, automáticamente se va a volver a disparar "transform()" o si es la primera vez que el pipe se ejecuta también se llama a "transform()"
*/
@Pipe({
  name: 'toggleCase',
})
export class ToggleCasePipe implements PipeTransform {
  /*
  ! value: es el argumento que se le envía al pipe cuando se utiliza, es decir, cuando se hace algo como {{'fernando' | toggleCase}}, value sería 'fernando'.
  ! args: es la n cantidad de argumentos que se le envía a un Pipe, por ejemplo, recordemos el currencyPipe:
  !  {{totalSells() | currency: 'CAD' : 'symbol-narrow': '1.4-4' }}
  */
  //? transform(value: any, ...args: any[]): any {}
  transform(value: string, upper: boolean): string {
    return upper ? value.toUpperCase() : value.toLowerCase();
  }
}
