import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PasswordVault } from '../types/type';
import { GenericCrudService } from '@shared/services';

@Injectable({
  providedIn: 'root',
})
export class PasswordVaultService extends GenericCrudService<PasswordVault> {
  constructor(private http: HttpClient) {
    super(http, '/api/v1/vaults');
  }
}
