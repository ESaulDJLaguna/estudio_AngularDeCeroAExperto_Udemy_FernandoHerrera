import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  gifService = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    //! La idea de los servicios es tener todo lo que necesitamos ya procesado
    this.gifService.searchGifs(query).subscribe((resp) => {
      this.gifs.set(resp);
    });
  }
}
