import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environmets/environment';
//! Cuando se importan interfaces se recomienda agregar type para ayudar un poco al transpilador de typescript que no tiene que hacer más trabajo con esa línea
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifs';
const MAX_GIFS = 1;

const loadFromLocalStorage = (): Record<string, Gif[]> => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);

  return gifs;
};

@Injectable({ providedIn: 'root' })
export class GifService {
  //! Necesitamos definir cómo queremos que trabaje nuestro HttpClient, necesitamos proveer este servicio de manera global. Ya que aunque se está inyectando NO se ha definido la instancia. Esto se hace en app.config.ts utilizando provideHttpClient()
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  //! Record: tipado propio de typescript. Lo utilizaremos para generar un objetos de llaves dinámicas que los valores de sus llaves sean del tipo definido en el segundo parámetro de <key, type_objects>
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  constructor() {
    //TODO: DESCOMENTAR
    // this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    //! Cualquier tipo de petición jamás se lanzará hasta que no nos suscribamos a ella
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: MAX_GIFS,
        },
      })
      //! resp es la respuesta del "paso anterior"
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log({ gifs });
      });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return (
      this.http
        .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
          params: {
            api_key: environment.giphyApiKey,
            limit: MAX_GIFS,
            q: query,
          },
        })
        //! pipe: nos sirve para "encadenar" funcionamientos especiales de los observables
        .pipe(
          //! tap: sirve para disparar efectos secundarios. Este tap lo que hará es que cuando nuestro observable emita un valor, va a pasar por TODOS los operadores que se tengan hacia abajo. Pero tap NO permite hacer transformaciones, solo permite hacer efectos secundarios.
          // tap((resp) => console.log({ tap1: resp })),
          // tap((resp) => console.log({ tap2: resp })),
          // tap((resp) => console.log({ tap3: resp }))
          //! map: permite "barrer" cada uno de los elementos de la respuesta y regresar una tranformación totalmente diferente. Como argumento recibe el valor de la respuesta anterior, es decir, lo que venga del operador anterior
          //! Desestructuramos la respuesta (resp) y solo recuperamos data
          map(({ data }) => data),
          map((items) => GifMapper.mapGiphyItemToGifArray(items)),
          tap((items) => {
            console.log({ tap: items });

            this.searchHistory.update((history) => ({
              ...history,
              [query.toLocaleLowerCase()]: items,
            }));
          })
        )
    );
    // .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphyItemToGifArray(resp.data);
    //   console.log({ search: gifs });

    //   //! No es posible hacer esto, porque este return es la respuesta del callback del subscribe NO la respuesta del método searchGifs
    //   //x return gifs;
    // });
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
