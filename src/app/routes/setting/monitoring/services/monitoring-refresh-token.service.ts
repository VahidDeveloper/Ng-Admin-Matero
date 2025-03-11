import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WinaRestUrls } from '@shared/models';
import { GenericCrudService } from '@shared/services';
import { MonitoringToken } from '../types/monitoring-token';

/**
 * this service is created to manage monitoring refresh token actions
 */
@Injectable({
  providedIn: 'root',
})
export class MonitoringRefreshTokenService extends GenericCrudService<MonitoringToken> {
  constructor(protected _http: HttpClient) {
    super(_http, WinaRestUrls.monitoringRefreshToken());
  }
}
