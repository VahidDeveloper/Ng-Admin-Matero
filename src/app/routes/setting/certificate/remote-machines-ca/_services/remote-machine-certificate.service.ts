import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CACertificate } from '../_models/CA-certificate';
import { WinaRestUrls } from '@shared/models';

/**
 * this class is create to do some action to
 * manage remote machine certificate
 */
@Injectable({
  providedIn: 'root',
})
export class RemoteMachineCertificateService {
  constructor(private _http: HttpClient) {}

  /**
   * get all CA certificate list
   */
  getCaCertificate(): Observable<CACertificate[]> {
    return this._http.get<CACertificate[]>(WinaRestUrls.getCaCertificateList());
  }

  /**
   * to add new CA certificate
   */
  addCaCertificate(body: CACertificate): Observable<CACertificate> {
    return this._http.post<CACertificate>(WinaRestUrls.addCaCertificate(), body);
  }

  /**
   * to delete a CA certificate
   */
  deleteCaCertificate(body: CACertificate): Observable<boolean> {
    return this._http.post<boolean>(WinaRestUrls.deleteCaCertificate(), body);
  }
}
