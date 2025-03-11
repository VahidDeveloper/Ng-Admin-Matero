import { finalize, tap } from 'rxjs';
import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';

import { MessageService } from '@shared/services';

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const messenger = inject(MessageService);
  const started = Date.now();

  let ok: string;

  // extend server response observable with logging
  return next(req).pipe(
    tap({
      // Succeeds when there is a response; ignore other events
      next: event => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
      // Operation failed; error is an HttpErrorResponse
      error: error => (ok = 'failed'),
    }),
    // Log when response observable either completes or errors
    finalize(() => {
      const elapsed = Date.now() - started;
      const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
      messenger.add(msg);
    })
  );
}
