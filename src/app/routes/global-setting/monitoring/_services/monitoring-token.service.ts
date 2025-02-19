import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WinaRestUrls } from '@phoenix-front-apps/models';
import { MonitoringToken } from '../_models/monitoring-token';
import { GenericCrudService } from '@phoenix-front-apps/wina-services';

/**
 * this service is created to manage monitoring token actions
 */
@Injectable({
  providedIn: 'root',
})
export class MonitoringTokenService extends GenericCrudService<MonitoringToken> {
  constructor(protected _http: HttpClient) {
    super(_http, WinaRestUrls.monitoringToken());
  }
}
