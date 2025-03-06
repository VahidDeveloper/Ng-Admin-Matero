import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService, WinaRestUrls } from '@shared';

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
