import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { NotFoundComponent } from '../../../shared/components/not-found/not-found.component';
import { CountryInformationComponent } from './country-information/country-information.component';

@Component({
  selector: 'app-country-page',
  imports: [NotFoundComponent, CountryInformationComponent],
  templateUrl: './country-page.component.html',
})
export default class CountryPageComponent {
  countryService = inject(CountryService);

  //! Con snapshot estamos solicitando la información como se encuentra EN ESTE MOMENTO (está tomando una "fotografía"), por lo tanto, NO es dinámico (no es reactivo), tomará un nuevo valor solo cuando se sale de la pantalla y se vuelve a entrar.
  countryCode = inject(ActivatedRoute).snapshot.params['code'];
  //! Otra forma de recuperar el parámetro
  // .paramMap.get('code');

  countryResource = rxResource({
    request: () => ({ code: this.countryCode }),
    loader: ({ request }) => {
      return this.countryService.searchCountryByAlphaCode(request.code);
    },
  });
}
