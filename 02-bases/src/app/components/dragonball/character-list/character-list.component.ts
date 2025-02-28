import { ChangeDetectionStrategy, Component, input } from '@angular/core';
//! Se recomienda que cuando se importa una interaz se agregue el type (es opcional). Al momento de construir la aplicación lo hace más rápido
import type { Character } from '../../../interfaces/character.interface';

@Component({
  selector: 'dragonball-character-list',
  imports: [],
  templateUrl: './character-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent {
  listName = input.required<string>();
  characters = input.required<Character[]>();
}
