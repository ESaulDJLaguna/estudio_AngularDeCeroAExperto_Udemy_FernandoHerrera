import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

interface Character {
  id: number;
  name: string;
  power: number;
}

@Component({
  imports: [NgClass],
  templateUrl: './dragonball-page.component.html',
})
export class DragonballPageComponent {
  name = signal('');
  power = signal(0);

  characters = signal<Character[]>([
    { id: 1, name: 'Goku', power: 9001 },
    // { id: 2, name: 'Vegeta', power: 8000 },
    // { id: 4, name: 'Yamcha', power: 500 },
    // { id: 3, name: 'Piccolo', power: 3000 },
  ]);

  // powerClasses = computed(() => {
  //   return {
  //     'text-danger': true,
  //   };
  // });

  addCharacter() {
    if (this.name() && this.power() && this.power() >= 0) {
      const newCharacter: Character = {
        id: this.characters.length + 1,
        name: this.name(),
        power: this.power(),
      };
      //! No se recomienda realizar un push
      //x this.characters().push(newCharacter);
      //! La mejor forma de agregar un nuevo elemento
      this.characters.update((list) => [...list, newCharacter]);
      this.restFields();
    }
  }

  restFields() {
    this.name.set('');
    this.power.set(0);
  }
}
