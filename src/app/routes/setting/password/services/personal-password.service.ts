import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericCrudService } from '@shared';
import { PersonalPassword } from '../types/personal-password';

@Injectable({
  providedIn: 'root',
})
export class PersonalPasswordService extends GenericCrudService<PersonalPassword> {
  constructor(private http: HttpClient) {
    super(http, '/api/v1/vaults/user');
  }
}
