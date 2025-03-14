import { Component, inject, resource, signal } from '@angular/core';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export default class ByCapitalPageComponent {
  countryService = inject(CountryService);
  query = signal('');

  /*
  ! A diferencia del resouce, rxResource funciona con Observables, por lo que NO se requiere de la conversión a una promesa utilizando firstValueFrom
  */
  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);

      return this.countryService.searchByCapital(request.query);
    },
  });

  //! El 'recurso' es una función que se define mandándole un objeto de configuración. El objeto de configuración tiene:
  //! - request: es una función que nos va a permitir mandar la serie de argumentos que nosotros queremos que pase a la función loader.
  //! - loader: es quién realiza la función asíncrona.
  //! Cada vez que se cambie alguna señal de request (en este caso query()), automáticamente va a volver a ejecutar loader con los nuevos valores.
  // countryResource = resource({
  //   request: () => ({ query: this.query() }),
  //   loader: async ({ request }) => {
  //     if (!request.query) return [];

  //     //! Cuando trabajabmos con resource tenemos que regresar promesas. firstValueFrom() permite transformar cualquier Observable en una promesa
  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(request.query)
  //     );
  //   },
  // });

  /*
  ! FORMA DE TRABAJAR LA RESPUESTA DE LA PETICIÓN SIN UTILIZAR RESOURCE
  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);

  onSearch(query: string) {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.countryService.searchByCapital(query).subscribe({
      next: (countries) => {
        this.isLoading.set(false);
        this.countries.set(countries);
      },
      //! Si queremos que al momento de que haya un error devuelva algo en el subscribe, se puede resolver con catchError en el servicio
      error: (err) => {
        //! err viene del mensaje devuelto por el throwError en el servicio
        this.isLoading.set(false);
        this.countries.set([]);
        this.isError.set(err);
      },
    });
  }
  */
}
