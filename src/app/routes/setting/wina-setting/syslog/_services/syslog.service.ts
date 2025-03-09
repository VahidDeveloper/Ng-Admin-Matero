import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SyslogServerModel } from '../_models/syslog-server';
import { ErrorDisplay, RestApiErrorCodes, WinaRestUrls } from '@shared/models';

/** a service for syslog servers management */
@Injectable({
  providedIn: 'root',
})
export class SyslogService {
  constructor(private _http: HttpClient) {}

  /** get all syslog servers */
  getList(): Observable<SyslogServerModel[]> {
    return this._http.get<SyslogServerModel[]>(WinaRestUrls.getSyslogServers());
  }

  /** get all syslog servers categories */
  getSyslogCategories(): Observable<string[]> {
    return this._http.get<string[]>(WinaRestUrls.getSyslogCategories());
  }

  /** delete syslog server with server id */
  deleteServer(id: number): Observable<SyslogServerModel> {
    return this._http.post<SyslogServerModel>(WinaRestUrls.deleteSyslogServers(), { id });
  }

  /** update and save  syslog server with SyslogServerModel */
  updateServer(data: SyslogServerModel): Observable<SyslogServerModel> {
    return this._http.post<SyslogServerModel>(WinaRestUrls.updateSyslogServers(), data);
  }

  /** update and save  syslog server with SyslogServerModel */
  testServerAvailability(data: SyslogServerModel): Observable<SyslogServerModel> {
    return this._http.post<SyslogServerModel>(WinaRestUrls.testSyslogServers(), data).pipe(
      catchError((errorObj: ErrorDisplay) => {
        const err = errorObj.errors && errorObj.errors[0];
        if (err?.error?.code === RestApiErrorCodes.certificateErrorCode) {
          throw {
            certificateError: true,
            expectedCert: err.errorParams.expectedCert,
            actualCert: err.errorParams.actualCert,
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
