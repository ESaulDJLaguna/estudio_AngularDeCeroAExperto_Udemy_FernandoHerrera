import { effect, Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/character.interface';

/*
  ! Los servicios no son más que una simple clase, pero como van a trabajar con Dependency Injection (DI), el servicio va a trabajar como un Singleton (siempre la misma instancia).

  ! La idea de este servicio es que sirva como lugar centralizado de información. De esta forma, cuando se cambie de una ruta a otra, el servicio no se va a destruir y la información y el estado del mismo se va a preservar.
*/

const loadFromLocalStorage = (): Character[] => {
  const characters = localStorage.getItem('characters');
  return characters ? JSON.parse(characters) : [];
};

@Injectable({ providedIn: 'root' })
export class DragonballService {
  characters = signal<Character[]>(
    loadFromLocalStorage()
    // [
    //   { id: 1, name: 'Goku', power: 9001 },
    //   { id: 2, name: 'Vegeta', power: 8000 },
    // ]
  );

  /*
    ! Los efectos nos van a servir para poder ejecutar o disparar una acción secundaria.

    ! El efecto NO es más que una función que recibe un callback (otra función) que vamos a querer disparar cada vez algo suceda.

    ! Lo que haremos es disparar un efecto que cada vez que nuestros personajes cambien grabe en el local storage.

    ! El efecto puede crearse dentro del constructor, pero lo más común es como se muestra a continuación.

    !> Es buena práctica que los efectos solo realicen una tarea
  */
  saveToLocalStorage = effect(() => {
    localStorage.setItem('characters', JSON.stringify(this.characters()));
  });

  addCharacter(newCharacter: Character) {
    this.characters.update((list) => [...list, newCharacter]);
  }
}
