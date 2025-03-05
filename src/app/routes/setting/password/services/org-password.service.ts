import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericCrudService, OrganizationalPassword } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class OrganizationPasswordService extends GenericCrudService<OrganizationalPassword> {
  constructor(private http: HttpClient) {
    super(http, '/api/v1/vaults');
  }
}
