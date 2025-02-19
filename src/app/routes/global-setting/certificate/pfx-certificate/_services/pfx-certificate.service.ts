import { Injectable } from '@angular/core';
import { PFXCertificate } from '../_models/PFX-certificate';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WinaRestUrls } from '@shared/models';

/**
 * a class to manage PFX certificate actions
 */
@Injectable({
  providedIn: 'root',
})
export class PfxCertificateService {
  constructor(private _http: HttpClient) {}

  /**
   * add new PFX certificate
   */
  addNewPFXCertificate(body: PFXCertificate): Observable<boolean> {
    return this._http.post<boolean>(WinaRestUrls.addPFXCertificate(), body);
  }
}
