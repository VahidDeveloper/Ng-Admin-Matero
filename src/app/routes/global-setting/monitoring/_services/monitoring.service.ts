import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WinaRestUrls } from '@phoenix-front-apps/models';
import { GenericCrudService } from '@phoenix-front-apps/wina-services';

/**
 * this service is created to manage monitoring actions
 */
@Injectable({
  providedIn: 'root',
})
export class MonitoringService extends GenericCrudService<string> {
  constructor(protected _http: HttpClient) {
    super(_http, WinaRestUrls.monitoring());
  }
}
