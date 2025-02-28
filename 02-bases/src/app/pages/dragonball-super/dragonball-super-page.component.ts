import { Component, inject, signal } from '@angular/core';
import { CharacterListComponent } from '../../components/dragonball/character-list/character-list.component';
import { CharacterAddComponent } from '../../components/dragonball/character-add/character-add.component';
import { Character } from '../../interfaces/character.interface';
import { DragonballService } from '../../services/dragonball.service';

@Component({
  templateUrl: './dragonball-super-page.component.html',
  selector: 'dragonball-super',
  imports: [CharacterListComponent, CharacterAddComponent],
})
export class DragonballSuperPageComponent {
  public dragonballService = inject(DragonballService);

  // characters = signal<Character[]>([
  //   { id: 1, name: 'Goku', power: 9001 },
  //   { id: 2, name: 'Vegeta', power: 8000 },
  // ]);

  // addCharacter(newCharacter: Character) {
  //   this.characters.update((list) => [...list, newCharacter]);
  // }
}
