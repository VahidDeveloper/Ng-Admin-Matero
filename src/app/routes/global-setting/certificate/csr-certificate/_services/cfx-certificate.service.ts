import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WinaRestUrls } from '@shared/models';
import { CSRCertificate } from '../_models/CSR-certificate';

/**
 * a class to manage CSR certificate actions
 */
@Injectable({
  providedIn: 'root',
})
export class CfxCertificateService {
  constructor(private _http: HttpClient) {}

  /**
   * get CSR certificate
   */
  getCSRCertificate(): Observable<CSRCertificate> {
    return this._http.get<CSRCertificate>(WinaRestUrls.getCSRCertificate());
  }

  /**
   * add new CSR certificate
   */
  addNewCSRCertificate(body: Partial<CSRCertificate>): Observable<CSRCertificate> {
    return this._http.post<CSRCertificate>(WinaRestUrls.addCSRCertificate(), body);
  }

  /**
   * delete CSR certificate
   */
  deleteCSRCertificate(): Observable<boolean> {
    return this._http.post<boolean>(WinaRestUrls.deleteCSRCertificate(), {});
  }

  /**
   * complete CSR certificate
   */
  completeCSRCertificate(body: { certificate: string }): Observable<boolean> {
    return this._http.post<boolean>(WinaRestUrls.completeCSRCertificate(), body);
  }
}
