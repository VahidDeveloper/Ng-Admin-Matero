import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MonitoringToken } from '../_models/monitoring-token';
import { GenericCrudService, WinaRestUrls } from '@shared';
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
