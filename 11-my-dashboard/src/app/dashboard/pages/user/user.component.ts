import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '@services/users.service';
import { TitleComponent } from '@shared/title/title.component';
import { switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user',
  imports: [CommonModule, TitleComponent],
  template: `
    <app-title [inputTitle]="titleLabel()" />
    @if (user()) {
    <section>
      <img [srcset]="user()!.avatar" [alt]="user()!.first_name" />

      <div>
        <h3>{{ user()!.first_name }} {{ user()!.last_name }}</h3>
        <p>{{ user()!.email }}</p>
      </div>
    </section>
    } @else {
    <p>Cargando información...</p>
    }
  `,
})
export default class UserComponent {
  /*
  ! Aprenderemos a cómo convertir un observable a una señal. Esto es útil porque Angular internamente utiliza muchos observables. Un ejemplo es que en este componente necesitamos recuperar el id de la url, para esto utilizamos de ActivatedRoute la propiedad 'paramMap', la cual es un observable al cual nos tendríamos que suscribir para recuperar el id, además, tendríamos que llamar al método getUserById() del usersService el cual también devuelve un observable
  */
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);

  // public user = signal<User | undefined>(undefined);
  //! toSignal es una función que toma un observable y lo convierte en una señal.
  public user = toSignal(
    this.route.params.pipe(
      switchMap(({ id }) => this.usersService.getUserById(id))
    )
  );

  public titleLabel = computed<string>(() => {
    if (this.user()) {
      return `Información del usuario: ${this.user()!.first_name} ${
        this.user()!.last_name
      }`;
    }
    return 'Información del usuario:';
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      console.log(params);
    });
  }
}
