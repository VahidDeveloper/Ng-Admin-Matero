import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '@shared/services';
import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';

export enum STATUS {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  const toast = inject(ToastService);
  const errorPages = [STATUS.FORBIDDEN, STATUS.NOT_FOUND, STATUS.INTERNAL_SERVER_ERROR];

  const getMessage = (error: HttpErrorResponse) => {
    if (error.error.status === 'ERROR') {
      const errList = error.error.errors!;
      if (errList.length && errList[0].error.description) {
        return errList[0].error.description;
      }
      return error.error.message;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.error?.msg) {
      return error.error.msg;
    }
    return `${error.status} ${error.statusText}`;
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (errorPages.includes(error.status)) {
        router
          .navigateByUrl(`/${error.status}`, {
            skipLocationChange: true,
          })
          .then();
      } else {
        console.error('ERROR', error);
        toast.open(getMessage(error), 'error');
        if (error.status === STATUS.UNAUTHORIZED) {
          router.navigateByUrl('/auth/login').then();
        }
      }

      return throwError(() => error);
    })
  );
}
