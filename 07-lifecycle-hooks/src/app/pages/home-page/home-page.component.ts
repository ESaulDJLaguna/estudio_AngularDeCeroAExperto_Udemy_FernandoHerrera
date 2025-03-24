import {
  afterNextRender,
  afterRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  OnInit,
  signal,
} from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';

const log = (...messages: string[]) => {
  //! Con %c se le aplica algún estilo a la consola
  console.log(
    `%c${messages[0]}\n\t%c${messages.slice(1).join(', ')}`,
    'font-weight: bold; font-size: 16px; color: #c32',
    'color: #bada55; font-size: 14px'
  );
};

@Component({
  selector: 'app-home-page',
  imports: [TitleComponent],
  templateUrl: './home-page.component.html',
  //! Configuramos Zoneless solo en este componente. Para hacerlo de manera global se realiza en el app.config.ts
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/*
  ! Cuando se requiere un ciclo de vida NO es necesario realizar el "implements", con el simple hecho de utilizar el método con el nombre del ciclo de vida va a llamar a ese ciclo de vida. Es decir, los componentes de Angular, tan pronto ejecuten ese paso de ciclo de vida va a buscar si existe un método con ese nombre y sí existe lo manda a llamar.

  ! Utilizar "implements" es conveniente cuando se quiere FORZAR o se quiere estar totalmente seguro de que este componente tiene unmétodo de ciclo de vida, porque si nos equivocamos de nombre, nos va a marcar un error diciendo que el método del ciclo de vida no está siendo implementado.
*/
export class HomePageComponent implements OnInit {
  traditionalProperty = 'Erik';
  signalProperty = signal('Erik');

  changeTraditional() {
    //! Este cambio SÍ es posible con Zoneless porque no es un cambio "inesperado" sino que hay un evento que está cambiando la propiedad tradicional y aún así sigue ejecutando los ciclos de vida que se tienen que ejecutar.
    this.traditionalProperty = 'Erik Saúl';
  }

  changeSignal() {
    this.signalProperty.set('Erik Saúl');
  }

  //! El constructor es parte del ciclo de vida del componente y es llamado cuando se crea una instancia del componente
  //! Antes de tener algo en pantalla se dispara el contructor.
  //! Siempre que se sale de una pantalla y se regresa el componente vuelve a crearse
  constructor() {
    //! Se crea la instancia del componente
    log('Constructor llamado');
    /*
      ! Si trabajamos con ZoneJs (quitando ChangeDetectionStrategy.OnPush), veremos que una vez pasan los 2 segundos la propiedad traditionalProperty cambia en el html y se ejecutan los ciclos de vida: DoCheck, AfterContentChecked, AfterViewChecked y afterRender.

      ! Si trabajamos Zoneless (agregando ChangeDetectionStrategy.OnPush o configurándolo GLOBALMENTE) y solo cambiamos la propiedad (NO la señal -comentar la señal-) veremos que el html NO cambia porque Angular ya no está tan pendiente a los cambios. Pero si hacemos la modificación de la seña sí cambia (tanto con ZoneJs o con Zoneless). Pero con Zoneles veremos que solo se ejecuta el afterRender. Al hacer que Angular ya no esté al pendiente de los cambios y cada cambio "inesperado" (por algún efecto secundario, en este caso por un timeout, que no se ejecuta al realizar algún evento o algún ejecutar algún ciclo de vida) se trabaje con señales hará que la aplicación sea más rápida.

      ! Si se trabaja Zoneless y se modifica la 'traditionalProperty' y también 'signalProperty', veremos que ambos cambian, nos dará un "falso negativo", creyendo que NO hay diferencia entre Zoneless y ZoneJs. Pero NO SE RECOMIENDA intentar "forzar" este cambio de propiedades tradicionales al hacer un cambio en una señal porque podría llevar a cambios extraños y cuando Angular se haga totalmente Zoneless el cambio ya no será tan fácil y transparente.

      ! Se recomienda trabajar con señales lo máximo que se pueda. Quizá una razón para utilizar propiedades tradicionales es si se va a inicializar una sola vez dicha propiedad y en el futuro ya no va a volver a cambiar. Por ejemplo, si creamos una propiedad con los archivos de rutas para definir un menú y esas rutas no cambian dinámicamente, ahí estaría bien utilizar una propiedad tradicional.
      */
    //   setTimeout(() => {
    //     // this.traditionalProperty = 'Juan Carlos';
    //     this.signalProperty.set('Juan Carlos');

    //     console.log('Hecho');
    //   }, 2000);
  }

  //! Se dispara tan pronto el componente ha sido inicializado.
  //! Puede utilizarse este efecto para unas tareas específicas. NO se aconseja disparar peticiones HTTP en los efectos ya que sería muy volatil (para eso existe resource o RxResource)
  basicEffect = effect((onCleanup) => {
    log('effect', 'Disparar efectos secundarios');

    //! Es una función que nosotros vamos a registrar y que se dispara de forma muy similar al OnDestroy
    onCleanup(() => {
      log('onCleanup', 'Se ejecuta cuando el efecto se va a destruir');
    });
  });

  ngOnInit() {
    //! Tradicionalmente es utilizado cuando se quiern hacer peticiones HTTP inmediatamente, porque aquí el componente ya está listo para empezarse a utilizar
    log(
      'ngOnInit',
      "Runs once after Angular has initialized all the component's inputs."
    );
  }

  ngDoCheck() {
    //! Se ejecuta cada vez que el componente cambia (revisa si alguna propiedad cambió, alguna señal cambió, etc. -Funciona con ZoneJs o Zoneless)
    log('ngDoCheck', 'Runs every time this component is checked for changes.');
  }

  ngAfterContentInit() {
    //! Sucede luego de que el componente es inicialzado
    log(
      'ngAfterContentInit',
      "Runs once after the component's content has been initialized."
    );
  }

  ngAfterContentChecked() {
    log(
      'ngAfterContentChecked',
      'Runs every time this component content has been checked for changes.'
    );
  }

  ngAfterViewInit() {
    log(
      'ngAfterViewInit',
      "Runs once after the component's view has been initialized."
    );
  }

  ngAfterViewChecked() {
    log(
      'ngAfterViewChecked',
      "Runs every time the component's view has been checked for changes."
    );
  }

  //! Se dispara cada vez que los inputs (input signals o @Input) de un componente cambia
  ngOnChanges() {
    log('ngOnChanges', "Runs every time the component's inputs have changed.");
  }

  ngOnDestroy() {
    log('ngOnDestroy', 'Runs once before the component is destroyed.');
  }

  //! Suele utilizarse con Angular SSR
  //! Se ejecuta cada vez que todos los componentes han sido renderizados
  afterNextRenderEffect = afterNextRender(() => {
    log(
      'afterNextRender',
      'Runs once the next time that all components have been rendered to the DOM.'
    );
  });

  afterRenderEffect = afterRender(() => {
    log('afterRender', 'Runs once before the component is destroyed.');
  });
}
