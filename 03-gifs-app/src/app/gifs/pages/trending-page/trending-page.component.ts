import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';

// const imageUrls: string[] = [
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-7.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-8.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-9.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg',
// ];

@Component({
  selector: 'app-trending-page',
  imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit {
  // gifs = signal(imageUrls);
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);

  scrollDivRef = viewChild<ElementRef<HTMLElement>>('groupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    //! scrollTop es exactamente la cantidad de scroll que se ha hecho desde la parte de arriba
    const scrollTop = scrollDiv.scrollTop;
    //! Determinamos cuánta pantalla o cuánto espacio en la pantalla tiene el elemento (sería el viewport)
    const clientHeight = scrollDiv.clientHeight;
    //! Necesitamos determinar cuánto es el scroll posible que se puede hacer en ese elemento. Es decir, indica cuál es el scroll máximo (altura máxima) que ocupa la información (porque está "oculta" por el overflow-y-scroll)
    const scrollHeight = scrollDiv.scrollHeight;

    // debugger;

    //! Usualmante cuando se hace un infinity scroll no se suele llegar al final, se comienza a hacer la petición cuando la persona está cerca del final, por eso son esos 300px
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
    this.scrollStateService.trendingScrollState.set(scrollTop);

    if (isAtBottom) {
      this.gifService.loadTrendingGifs();
    }

    // console.log(isAtBottom);

    // console.log({
    //   scrollTotal: scrollTop + clientHeight,
    //   scrollTop,
    //   clientHeight,
    //   scrollHeight,
    // });
  }
}
