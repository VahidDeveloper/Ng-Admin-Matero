import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericCrudService } from '../generic-crud.service';
import { RemoteApplication } from '@shared/interfaces';
import { WinaRestUrls } from '@shared/models';

/**
 * to manage all connection application operation
 */
@Injectable({
  providedIn: 'root',
})
export class ConnectionApplicationService extends GenericCrudService<RemoteApplication> {
  constructor(protected _http: HttpClient) {
    super(_http, WinaRestUrls.connectionApplications());
  }
}
