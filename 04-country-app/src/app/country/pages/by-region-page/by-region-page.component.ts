import { Component, inject, linkedSignal, signal } from '@angular/core';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { Region } from '../../types/region.type';
import { CountryService } from '../../services/country.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
})
export default class ByRegionPageComponent {
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  //! Con snapshot solo toma una "FOTO", por lo que al regresar a la vista anterior aunque cambia el queryParam NO cambia la vista, por eso se utiliza el queryParamMap ya que este sí es reactivo
  // queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? null;
  queryParam = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params) => params.get('region'))
    )
  );

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  selectedRegion = linkedSignal<Region | null>(
    () => this.regions.find((region) => region === this.queryParam()) ?? null
  );

  regionResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {
      if (!request.region) {
        this.router.navigate(['/country/by-region']);
        return of([]);
      }

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          region: request.region,
        },
      });

      return this.countryService.searchByRegion(request.region);
    },
  });
}
