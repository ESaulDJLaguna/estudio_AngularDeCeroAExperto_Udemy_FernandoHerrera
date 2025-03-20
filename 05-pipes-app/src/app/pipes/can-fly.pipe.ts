import { Pipe, PipeTransform } from '@angular/core';

type canFlyType = 'Puede volar' | 'No puede volar';

@Pipe({
  name: 'canFly',
})
//! El valor de retorno sería recomendable que sea un type, pero también se puede realizar así.
export class CanFlyPipe implements PipeTransform {
  transform(value: boolean): 'Puede volar' | 'No puede volar' {
    return value ? 'Puede volar' : 'No puede volar';
  }
}
