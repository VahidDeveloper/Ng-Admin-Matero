import { inject } from '@angular/core';
import { mergeMap, of, throwError } from 'rxjs';
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestResponse } from '@shared/models/http/rest-response';
import { ToastService } from '@shared/services';

export function restInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const toast = inject(ToastService);
  if (!req.url.includes('/rest/')) {
    return next(req);
  }

  return next(req).pipe(
    mergeMap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const body: RestResponse = event.body;
        // failure: { code: **, msg: 'failure' }
        // success: { code: 0,  msg: 'success', data: {} }
        if (body.status === 'ERROR') {
          if (body.errors?.length && body.errors[0].error?.description) {
            toast.open(body.errors[0].error?.description, 'error');
          }
          return throwError(() => body.errors);
        }
        return of(
          event.clone({
            body: body.object,
          })
        );
      }
      // Pass down event if everything is OK
      return of(event);
    })
  );
}
