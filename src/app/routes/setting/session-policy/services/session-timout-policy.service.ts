import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionTimeoutPolicy } from '@shared/interfaces';
import { WinaRestUrls } from '@shared/models';

/** a service for update session timeout policy setting */
@Injectable({
  providedIn: 'root',
})
export class SessionTimoutPolicyService {
  constructor(private _http: HttpClient) {}

  /** get session timeout policy configs */
  getSetting(): Observable<SessionTimeoutPolicy> {
    return this._http.get<SessionTimeoutPolicy>(WinaRestUrls.getSessionTimeoutPolicy());
  }

  /** update and save session timeout policy */
  updateSetting(data: SessionTimeoutPolicy): Observable<boolean> {
    return this._http.post<boolean>(WinaRestUrls.updateSessionTimeoutPolicy(), data);
  }
}
