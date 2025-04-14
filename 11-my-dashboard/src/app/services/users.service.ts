import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { delay, map } from 'rxjs';

//! Con type no realiza ningún tipo de transpilación ni importación
import type {
  User,
  UserResponse,
  UsersResponse,
} from '@interfaces/req-response';

interface State {
  users: User[];
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);

  //! '#' genera una propiedad privada. Aunque funcionaría igual que private, la gran diferencia es que private cuando se transpila a javascript genera una clase "visible" y "modificable" para todos. Pero si se usa el #, ecmaScript sí genera una clase privada, por lo que no se va a poder acceder a ella
  //x Parece que la forma de declarar variables privadas con # ya no funciona con Angular 19+
  //x #state = signal<State>({
  private _state = signal<State>({
    loading: true,
    users: [],
  });

  /*
  ! Como #state es privado, no podré utilizarlo en ningún componente, por lo que no podré acceder a la información de los usuarios.

  ! Para leer esta información crearemos una propiedad que es una señal computada de solo lectura. Entonces, en cualquier momento que necesite esa información, entonces utilizo esta señal y al ser de solo lectura, no existe posibilidad de modificarla
  */
  public users = computed(() => this._state().users);
  public loading = computed(() => this._state().loading);

  constructor() {
    this.http
      .get<UsersResponse>('https://reqres.in/api/users')
      //! Intencionalmente hacemos que la petición demore 1.5 segundos extra.
      .pipe(delay(1500))
      .subscribe((resp) => {
        this._state.set({
          loading: false,
          users: resp.data,
        });
      });
  }

  getUserById(id: string) {
    return this.http
      .get<UserResponse>(`https://reqres.in/api/users/${id}`)
      .pipe(
        delay(1500),
        map((resp) => resp.data)
      );
  }
}
