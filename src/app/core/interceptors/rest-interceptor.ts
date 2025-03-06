import { inject } from '@angular/core';
import { mergeMap, of, throwError } from 'rxjs';
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestResponse, csrfInfo } from '@shared/models';
import { ToastService } from '@shared/services';

export function restInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const toast = inject(ToastService);

  if (!req.url.includes('/rest/') && !req.url.includes('/api/v1/')) {
    return next(req);
  }

  return next(req).pipe(
    mergeMap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const body: RestResponse = event.body;
        if (body.status === 'ERROR') {
          if (body.errors && body.errors.length && body.errors[0].error) {
            toast.open(body.errors[0].error?.description ?? '', 'error');
          }
          return throwError(() => body.errors);
        }
        return of(event.clone({ body: body.object }));
      }

      return of(event);
    })
  );
}
