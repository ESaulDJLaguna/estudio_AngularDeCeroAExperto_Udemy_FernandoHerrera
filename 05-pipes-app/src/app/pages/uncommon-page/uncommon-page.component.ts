import { Component, signal } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import {
  AsyncPipe,
  I18nPluralPipe,
  I18nSelectPipe,
  JsonPipe,
  KeyValuePipe,
  SlicePipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { interval, map, tap } from 'rxjs';

const client1 = {
  name: 'Fernando',
  gender: 'male',
  age: 39,
  address: 'Ottawa, Canadá',
};

const client2 = {
  name: 'Melissa',
  gender: 'female',
  age: 33,
  address: 'Toronto, Canadá',
};

@Component({
  selector: 'app-uncommon-page',
  imports: [
    AsyncPipe,
    CardComponent,
    I18nPluralPipe,
    I18nSelectPipe,
    JsonPipe,
    KeyValuePipe,
    SlicePipe,
    TitleCasePipe,
    UpperCasePipe,
  ],
  templateUrl: './uncommon-page.component.html',
})
export default class UncommonPageComponent {
  //! I18nSelectPipe: va a permitir cambiar una palabra o palabras acorde a lo que se desee
  client = signal(client1);

  //! El Pipe i18n funciona con un objeto mapa. El objeto va a servir para cambiar de manera dinámica de acuerdoa una condición
  invitationMap = {
    male: 'invitarlo',
    female: 'invitarla',
  };

  //! I18nPluralPipe: funciona cuando se tiene varios datos, es decir, cuando se tienen colecciones o diferentes números de elementos
  clients = signal([
    'Maria',
    'Pedro',
    'Fernando',
    'Melissa',
    'Natalia',
    'Andrea',
    'Juan',
    'Carlos',
  ]);

  //! Se podría hacer de igual forma con un Mapa, pero veremos cómo trabajarlo con una señal
  clientsMap = signal({
    //! Si la cantidad a enviar es 0
    '=0': 'no tenemos ningún cliente esperando',
    '=1': 'tenemos un cliente esperando',
    '=2': 'tenemos dos clientes esperando',
    other: 'tenemos # clientes esperando',
  });

  changeClient() {
    if (this.client() === client1) {
      this.client.set(client2);
      return;
    }

    this.client.set(client1);
  }

  deleteClient() {
    this.clients.update((prev) => prev.slice(1));
  }

  //! KeyValuePipe
  profile = {
    name: 'Fernando',
    age: 39,
    address: 'Ottawa, Canadá',
  };

  //! AsyncPipe: trabaja con promesas y Observables
  promiseValue: Promise<string> = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Tenemos data en la promesa');
      // reject('Tenemos un error en la data');
      //! Este pipe está pensado para mostrar información que se resolvió de forma correcta. Una forma de resolver si hay un reject es que se agregué un @else. Pero en caso de manejar los errores, es preferible hacerlo de manera manual.
      console.log('Promesa finalizada');
    }, 3500);
  });

  //! Cada 2 segundos (2000ms) va a estar emitiendo un valor, interval inicia ese valor emitido en 0. interval sería similar a setInterval de javascript, pero interval se trabaja como un Observable.
  myObservableTimer = interval(2000).pipe(
    map((value) => value + 1),
    tap((value) => console.log('tap: ', value))
  );
  /*
  ! Recordemos que si NO estamos suscritos a un Observable NO va a pasar nada.

  ! Si agregamos .subscribe esto ya NO sería un Observable, sino que pasaría a ser un tipo Subscribe (una subscripción, lo cual son dos cosas diferentes).

  ! Igual que setInterval de javascript, si navegamos a otra pantalla podremos observar que el Obsrvable sigue emitiendo valores, por esa razón hay que tener cuidado con la fuga de memoria. Esto se resuelve, que cuando ya no vamos a utilizar el Observable se tiene que llamar al .unsubscribe() que cancela dicha subscripción.
  */
  // .subscribe().unsubscribe();
}
