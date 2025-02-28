import { Component, output, signal } from '@angular/core';
import { Character } from '../../../interfaces/character.interface';

@Component({
  selector: 'dragonball-character-add',
  imports: [],
  templateUrl: './character-add.component.html',
})
export class CharacterAddComponent {
  name = signal('');
  power = signal(0);
  newCharacter = output<Character>();

  addCharacter() {
    if (this.name() && this.power() && this.power() >= 0) {
      const newCharacter: Character = {
        id: Math.floor(Math.random() * 1000),
        name: this.name(),
        power: this.power(),
      };
      this.newCharacter.emit(newCharacter);
      this.restFields();
    }
  }

  restFields() {
    this.name.set('');
    this.power.set(0);
  }
}
