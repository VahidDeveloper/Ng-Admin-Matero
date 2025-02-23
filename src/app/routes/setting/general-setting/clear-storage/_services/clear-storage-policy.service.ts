import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WinaRestUrls } from '@shared/models';
import { ClearStorageResponse } from '../_models/clear-storage-response';

/**
 * To get data of elimination of storage
 */
@Injectable({
  providedIn: 'root',
})
export class ClearStoragePolicyService {
  constructor(private _http: HttpClient) {}

  /**
   * number of second in the day = 24 * 60 * 60
   */
  private readonly _secondInDay = 86400;

  /**
   * get time of elimination to show in the key value component
   */
  getStoragePolicyConfig(): Observable<ClearStorageResponse> {
    return this._http.get<ClearStorageResponse>(WinaRestUrls.eliminationSession()).pipe(
      map((data: ClearStorageResponse) => {
        data.timeBaseElimination.elapsedInSeconds = Math.floor(
          data.timeBaseElimination.elapsedInSeconds / this._secondInDay
        );
        data.timeBaseElimination.warning.startThreshold = Math.floor(
          data.timeBaseElimination.warning.startThreshold / this._secondInDay
        );
        data.timeBaseElimination.warning.step = Math.floor(
          data.timeBaseElimination.warning.step / this._secondInDay
        );
        return data;
      })
    );
  }

  /**
   * to update elimination config
   */
  putStoragePolicyConfig(body: ClearStorageResponse) {
    body.timeBaseElimination.elapsedInSeconds = Math.floor(
      body.timeBaseElimination.elapsedInSeconds * this._secondInDay
    );
    body.timeBaseElimination.warning.startThreshold = Math.floor(
      body.timeBaseElimination.warning.startThreshold * this._secondInDay
    );
    body.timeBaseElimination.warning.step = Math.floor(
      body.timeBaseElimination.warning.step * this._secondInDay
    );
    return this._http.post(WinaRestUrls.putEliminationSession(), body);
  }
}
