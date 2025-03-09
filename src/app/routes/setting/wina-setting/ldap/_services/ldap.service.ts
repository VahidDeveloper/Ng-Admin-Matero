import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { LdapServerModel } from '../_models/ldap-server-model';
import { WinaRestUrls, ErrorDisplay, RestApiErrorCodes } from '@shared';

/** a service for ldap servers management */
@Injectable({
  providedIn: 'root',
})
export class LdapService {
  constructor(private _http: HttpClient) {}

  /** get all ldap servers */
  getList(): Observable<LdapServerModel[]> {
    return this._http.get(WinaRestUrls.getLdapServers()).pipe(map((item: any) => item.ldapServers));
  }

  /** delete ldap server with server id */
  deleteServer(id: number): Observable<LdapServerModel> {
    return this._http.post<LdapServerModel>(WinaRestUrls.deleteLdapServers(), {
      id,
    });
  }

  /** update and save ldap server with LdapServerModel */
  updateServer(data: LdapServerModel): Observable<LdapServerModel> {
    return this._http.post<LdapServerModel>(WinaRestUrls.updateLdapServers(), data);
  }

  /** update and save ldap server with LdapServerModel */
  testServerAvailability(data: LdapServerModel): Observable<any> {
    return this._http.post<LdapServerModel>(WinaRestUrls.testLdapServers(), data).pipe(
      catchError((errorObj: ErrorDisplay) => {
        const err = errorObj.errors && errorObj.errors[0];
        if (err?.error?.code === RestApiErrorCodes.certificateErrorCode) {
          throw {
            certificateError: true,
            expectedCert: err.errorParams?.expectedCert,
            actualCert: err.errorParams?.actualCert,
          };
        } else if (err?.error?.code === RestApiErrorCodes.syslogOrMailServerNotAccessibleError) {
          throw {
            serverDown: true,
            location: errorObj.location,
          };
        }
        throw errorObj;
      })
    );
  }
}
