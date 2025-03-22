import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private baseUrl = 'https://restcountries.com/v3.1';
  private http = inject(HttpClient);

  private _regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[] {
    //! Si se llegara a modificar el arreglo NO se modificaría el arreglo original _regions, por eso son los tres puntos al inicio
    return [...this._regions];
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    if (!region) return of([]);

    console.log({ region });

    const url = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url);
  }

  getCountryByAlphaCode(alphaCode: string): Observable<Country> {
    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;

    return this.http.get<Country>(url);
  }

  getCountryNamesByCodeArray(countryCodes: string[]): Observable<Country[]> {
    if (!countryCodes || countryCodes.length === 0) return of([]);

    //! Definiremos countriesRequests como un arreglo de Observables que van a emitir el pais
    const countriesRequests: Observable<Country>[] = [];

    countryCodes.forEach((code) => {
      //! Recordemos que mientras no nos subscribamos NO pasará nada. Solo se define la petición http que se va a ocupar
      const request = this.getCountryByAlphaCode(code);
      countriesRequests.push(request);
    });

    //! combineLatest nos permite pasar un arreglo de Subscripciones y vamos a poder trabjar con ellas y esperarnos que todas emitan y tener todos los valores cuando cada una de ellas se cumplan con éxito. Si una petición falla todo el Observable fallará
    return combineLatest(countriesRequests);
  }
}
