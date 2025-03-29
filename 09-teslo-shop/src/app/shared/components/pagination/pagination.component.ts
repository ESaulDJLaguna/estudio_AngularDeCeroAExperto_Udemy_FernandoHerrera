import {
  Component,
  computed,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
  styles: ``,
})
export class PaginationComponent {
  pages = input(0);
  currentPage = input<number>(1);

  /*
  ! Angular recomienda que cuando se tiene una señal que se inicializa con algo que puede cambiar desde el input o cuando realmente no se quiere volver a cambiar porque puede ser que el currentPage desde afuera cambie y no queremos que automáticamente se esté sincronizando de esa manera (porque se van a tener dos sincronizaciones) se recomienda utilizar el linkedSignal.

  ! linkedSignal: es otro primitivo de Angular que nos permite inicializar una señal basado en un input y una vez inicializada, podremos trabajarla con un 'signal'
  */
  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });
}
