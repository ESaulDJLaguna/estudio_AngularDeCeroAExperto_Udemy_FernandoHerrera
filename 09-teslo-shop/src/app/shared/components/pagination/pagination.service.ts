import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private activatedRoute = inject(ActivatedRoute);

  /*
  ! Si no se inicializa con un valor inicial, toSignal sería de tipo 'number | undefined'. Podría ser 'undefined' porque podría no tenerse el queryParam 'page' porque son opcionales.

  ! Por lo tanto, agregando el objeto, podemos inializar toSignal
  */
  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params) => (params.get('page') ? +params.get('page')! : 1)),
      map((page) => (isNaN(page) ? 1 : page))
    ),
    {
      initialValue: 1,
    }
  );
}
