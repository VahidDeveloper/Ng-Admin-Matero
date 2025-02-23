import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LicenseInfo } from '../_models/license-info';
import { WinaRestUrls } from '@shared/models';

/** a service for manage wina licenses */
@Injectable({
  providedIn: 'root',
})
export class LicenseService {
  constructor(private _http: HttpClient) {}

  /** it get license information */
  getLicenceInfo(): Observable<LicenseInfo> {
    return this._http.get<LicenseInfo>(WinaRestUrls.getAppLicenseInfo());
  }

  /** it register new license information */
  registerLicense(license: string): Observable<LicenseInfo> {
    return this._http.post<LicenseInfo>(WinaRestUrls.setAppLicense(), {
      license,
    });
  }
}
