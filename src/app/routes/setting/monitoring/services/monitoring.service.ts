import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WinaRestUrls } from '@shared/models';
import { GenericCrudService } from '@shared/services';

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
