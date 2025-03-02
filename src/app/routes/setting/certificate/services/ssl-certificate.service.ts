import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SslPolicy } from '../_models/ssl-policy';
import { WinaRestUrls } from '@shared/models';

/**
 * a class to manage ssl certificate policy actions
 */
@Injectable({
  providedIn: 'root',
})
export class SslCertificateService {
  constructor(private _http: HttpClient) {}

  /**
   * to get default ssl policy
   */
  getDefaultPolicy(): Observable<SslPolicy> {
    return this._http.get<SslPolicy>(WinaRestUrls.getDefaultSSlPolicy());
  }

  /**
   * to add new ssl policy
   */
  addSSlConfig(body: SslPolicy): Observable<SslPolicy> {
    return this._http.post<SslPolicy>(WinaRestUrls.addSSlPolicy(), body);
  }
}
