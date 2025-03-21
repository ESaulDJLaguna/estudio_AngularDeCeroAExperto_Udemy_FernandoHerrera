import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.component.html',
})
export class DynamicPageComponent {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array(
      /*
      ! Un array es similar al FormGroup, es decir, requiere de 1 a 3 argumentos:
      ! El primero es el valor inicial el cual es un arreglo, podría ser vacío [] o con valores iniciales (como el ejemplo) y como se observa, cada valor inicial es un arreglo de FormGroup, que de igual manera requiere de 1 a 3 argumentos.
      ! El segundo y tercero son las validaciones síncronas y asíncronas, respectivamente y de igual manera que el FormGroup, podría ser un arreglo de validaciones o si solo se requiere una validación, solo no se requiere el arreglo.
      */
      [
        ['Metal Gear', Validators.required],
        ['Death Stranding', Validators.required],
      ],
      Validators.minLength(2)
    ),
  });

  //! Con cualquiera de las dos formas se puede crear un control, pero se recomienda la primera porque es más claro
  newFavorite = new FormControl('', Validators.required);
  // newFavorite = this.fb.control(['', Validators.required]);

  get favoriteGames() {
    return this.myForm.get('favoriteGames') as FormArray;
  }

  onAddToFavorites() {
    if (this.newFavorite.invalid) return;

    const newGame = this.newFavorite.value;

    //! Cualquiera de las dos formas son válidas, pero se recomendaría el new FormControl, ya que se recomienda tener la misma forma de trabajar y con 'new FormControl' es como se definión 'newFavorite'. Pero se demuestra que también se puede hacer con 'FormBuilder'.
    // this.favoriteGames.push(new FormControl(newGame, Validators.required));
    this.favoriteGames.push(this.fb.control(newGame, Validators.required));

    this.newFavorite.reset();
  }

  onDeleteFavorite(index: number) {
    this.favoriteGames.removeAt(index);
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
  }
}
