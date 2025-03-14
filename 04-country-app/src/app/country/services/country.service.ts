import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interface';
import { map, Observable, catchError, throwError, delay, of, tap } from 'rxjs';
import { CountryMapper } from '../mappers/country.mapper';
import { Country } from '../interfaces/country.interface';
import { Region } from '../types/region.type';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry: Record<string, Country[]> = {};
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    console.log(`Llegando al servidor por ${query}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      //! El primer operador dentro de pipe es el valor del observable: get<RESTCountry[]>.

      //! Si se agregaran más 'map', cada 'map' va a recibir el valor de retorno de anterior, es decir, si hubiera un segundo 'map' este recibiría un Country[], porque es la respuesta de CountryMapper.mapRestCountryArrayToCountryArray(restCountries). Si hubiera un tercer map recibiría el nuevo tipo que devolvió el segundo 'map' y así sucesivamente.
      map((restCountries) =>
        CountryMapper.mapRestCountryArrayToCountryArray(restCountries)
      ),
      tap((countries) => this.queryCacheCapital.set(query, countries)),
      /*
        ! catchError nos sirve para atrapar el error que devuelve la petición.

        ! catchError debe regresar un Observable o lanzar un error para detener la ejecución.
      */
      catchError((error) => {
        console.log('Error fetching: ', error);

        //! throwError: genera un valor de un Observable que hasta ahí llega, es decir, va a detener la operación y ya no continuará con los siguientes operadores.
        return throwError(
          () => new Error(`No se pudo obtener países con ese query: ${query}`)
        );
      })
    );
  }

  searchByCountry(query: string): Observable<Country[]> {
    const url = `${API_URL}/name/${query}`;

    query = query.toLocaleLowerCase();

    if (this.queryCacheCountry[query]) {
      //! Recordemos que of() regresa un observable, por lo que se pueden aplicar operadores de rxjs, así que aplicaremos un delay
      return of(this.queryCacheCountry[query] ?? []).pipe(delay(1000));
    }

    return this.http.get<RESTCountry[]>(url).pipe(
      map((restCountries) =>
        CountryMapper.mapRestCountryArrayToCountryArray(restCountries)
      ),
      tap((countries) => (this.queryCacheCountry[query] = countries)),
      //! Nos va a permitir relentizar la petición
      delay(2000),
      catchError((error) => {
        console.log('Error fetching: ', error);

        return throwError(
          () => new Error(`No se pudo obtener países con ese query: ${query}`)
        );
      })
    );
  }

  searchByRegion(region: Region): Observable<Country[]> {
    const url = `${API_URL}/region/${region}`;

    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    return this.http.get<RESTCountry[]>(url).pipe(
      map((restCountries) => {
        return CountryMapper.mapRestCountryArrayToCountryArray(restCountries);
      }),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      delay(1000),
      catchError((error) => {
        return throwError(
          () =>
            new Error(`No se pudo obtener países con esta región: ${region}`)
        );
      })
    );
  }

  searchCountryByAlphaCode(code: string) {
    const url = `${API_URL}/alpha/${code}`;

    return this.http.get<RESTCountry[]>(url).pipe(
      map((restCountries) =>
        CountryMapper.mapRestCountryArrayToCountryArray(restCountries)
      ),
      map((countries) => countries.at(0)),
      catchError((error) => {
        return throwError(
          () => new Error(`No se pudo obtener países con ese código: ${code}`)
        );
      })
    );
  }
}
