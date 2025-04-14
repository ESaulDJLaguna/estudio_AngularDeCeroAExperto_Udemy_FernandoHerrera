import { booleanAttribute, Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  template: ` <h1 class="text-3xl mb-5">{{ title }}</h1> `,
  styles: ``,
})
export class TitleComponent {
  //! alias: es el nombre de la propiedad que se tiene que mandar en el componete
  @Input({ required: true, alias: 'inputTitle' }) title!: string;
  /*
  ! Con 'transform' tenemos una forma de cambiar atributos, una de ellas es: booleanAttribute.
  ! Cuando tenemos un Input, al utilizar el componente requiere un valor de entrada. Por ejemplo:
  ¡¿   <my-component [input]="value" />
  ! Pero con '{ transform: booleanAttribute }' nos permite definir un input "de tipo atributo", es decir, si existe en el componete, sestablece como un true, si no existe, se establece como un false. Es decir, gracias a esto ya no se requiere hacer lo siguiente:
  ¡¿   <app-title myTitle="Control Flow" [withShadow]=true /> o <app-title myTitle="Control Flow" [withShadow]=false />
  ! Sino que con solo agregar la propiedad, se le establecería un true, en caso de que no exista, se le establecería un false
  ¡¿   <app-title myTitle="Control Flow" withShadow /> <!-- withShadow es un true -->
  ¡¿   <app-title myTitle="Control Flow" /> <!-- withShadow es un false -->
  */
  @Input({ transform: booleanAttribute }) withShadow: boolean = false;

  /*
  ! En caso de utilizar el required, transform o alias con los nuevos input signal, se haría de la siguiente forma:
  ¡¿  required: myInputSignal = input.required<type>();
  ¡¿  transform: myInputSignal = input(false, { transform: booleanAttribute });
  ! > En vez de booleanAttribute puede ser una función, para más información visitar: https://angular.dev/guide/components/inputs#input-transforms
  ¡¿  alias: myInputSignal = input<type>('initialValue', { alias: 'myAlias' });
  */
  myInputSignal = input(false, {
    alias: 'myInput',
    transform: booleanAttribute,
  });
}
