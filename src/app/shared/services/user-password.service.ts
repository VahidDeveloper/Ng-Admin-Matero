import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WinaRestUrls } from '@shared/models';
import { GenericCrudService } from './generic-crud.service';

/**
 * a service to reset users' and current user's password.
 */
@Injectable({
  providedIn: 'root',
})
export class UserPasswordService extends GenericCrudService<any> {
  constructor(protected _http: HttpClient) {
    super(_http, `${WinaRestUrls.resetUserPassword()}`);
  }

  /**
   * it would reset current user's password. it is used in user's profile page
   */
  resetCurrentUserPassword(oldPassword: string, newPassword: string): Observable<boolean> {
    return this._http.post<boolean>(WinaRestUrls.resetCurrentUserPassword(), {
      oldPassword,
      newPassword,
    });
  }
}
