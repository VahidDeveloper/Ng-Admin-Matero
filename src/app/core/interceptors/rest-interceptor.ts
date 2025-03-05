import { inject } from '@angular/core';
import { mergeMap, of, throwError } from 'rxjs';
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestResponse, csrfInfo } from '@shared/models';
import { ToastService } from '@shared/services';

export function restInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const toast = inject(ToastService);
  let headers = req.headers;

  // Check if the request is targeting /rest/ or /api/
  if (!req.url.includes('/rest/') && !req.url.includes('/api/v1/')) {
    return next(req);
  }

  // Apply CSRF headers if available
  if (csrfInfo.csrfHeader && csrfInfo.csrf) {
    headers = headers.set(csrfInfo.csrfHeader, csrfInfo.csrf);
  }
  headers = headers.set('Accept', 'application/json');

  const alteredReq = req.clone({ headers });

  return next(alteredReq).pipe(
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
