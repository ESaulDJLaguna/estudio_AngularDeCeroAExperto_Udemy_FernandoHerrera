import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  //! next: este 'next' es lo que se tiene que mandar a llamar para que siga ejecutando el procedimiento que nosotros queremos
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      // if (event.type === HttpEventType.Response) {
      console.log(req.url, 'returned a response with status', event);
      // }
    })
  );
}
