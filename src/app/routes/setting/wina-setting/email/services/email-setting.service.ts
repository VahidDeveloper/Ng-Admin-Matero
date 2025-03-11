import { EMPTY, throwError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { EmailConfig } from '../types/email-config';
import { WinaRestUrls, ErrorDisplay, RestApiErrorCodes, RestApiError } from '@shared';

/**  a service class for set and test otp email configs */
@Injectable({
  providedIn: 'root',
})
export class EmailSettingService {
  constructor(private _http: HttpClient) {}

  /** it fetch otp email config from server */
  getEmailConfig(): Observable<EmailConfig> {
    return this._http.get<EmailConfig>(WinaRestUrls.getEmailConfig());
  }

  /** it fetch otp email config from server */
  updateEmailConfig(entity: EmailConfig): Observable<EmailConfig> {
    return this._http.post<EmailConfig>(WinaRestUrls.updateEmailConfig(), entity);
  }

  /** it fetch otp email config from server */
  testEmailSenderConfig(mailAddress: string, entity: EmailConfig): Observable<any> {
    const serverObj = {
      mailConfig: entity,
      mailAddress: mailAddress || 'dummy-email@example.com',
    };
    return this._http.post<any>(WinaRestUrls.testEmailAddress(), serverObj).pipe(
      catchError((error: RestApiError[]) => {
        const err = error[0];
        if (err.error?.code === RestApiErrorCodes.certificateErrorCode) {
          throw {
            certificateError: true,
            expectedCert: err.errorParams.expectedCert,
            actualCert: err.errorParams.actualCert,
          };
        } else if (err.error?.code === RestApiErrorCodes.syslogOrMailServerNotAccessibleError) {
          throw {
            serverDown: true,
          };
        }
        return throwError(() => error);
      })
    );
  }
}
