import { Component, input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  templateUrl: './title.component.html',
  styles: ``,
})
export class TitleComponent implements OnChanges {
  title = input.required<string>();

  /*
  ! Se ejecuta cada vez que alguna de las propiedades tipo input cambia
  */
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges');

    for (const inputName in changes) {
      const inputValues = changes[inputName];
      console.log(`Previous ${inputName} == ${inputValues.previousValue}`);
      console.log(`Current ${inputName} == ${inputValues.currentValue}`);
      console.log(`Is first ${inputName} change == ${inputValues.firstChange}`);
    }
  }
}
