import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

import { SettingsService } from '@core';
import { csrfInfo } from '@shared/models';

export function settingsInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const settings = inject(SettingsService);

  let headers = req.headers;

  if (csrfInfo.csrfHeader && csrfInfo.csrf) {
    headers = headers.append(csrfInfo.csrfHeader, csrfInfo.csrf);
  }
  headers = headers.set('Accept-Language', settings.getTranslateLang());
  headers = headers.set('Accept', 'application/json');

  const alteredReq = req.clone({ headers });

  return next(alteredReq);
}
