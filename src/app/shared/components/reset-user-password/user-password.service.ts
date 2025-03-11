import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { WinaRestUrls } from '@shared/models';
import { LoginConstraint } from '../../interfaces/login-constraint';
import { GenericCrudService } from '../../services/generic-crud.service';

/**
 * a service to reset users' and current user's password.
 */
@Injectable({
  providedIn: 'root',
})
export class UserPasswordService extends GenericCrudService<any> {
  /**
   * constraints data
   */
  private _constraints: Observable<LoginConstraint> | undefined;

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

  getConstraint(): Observable<LoginConstraint> {
    if (!this._constraints) {
      this._constraints = this._http
        .get<LoginConstraint>(WinaRestUrls.winaLoginConstraint(), {})
        .pipe(shareReplay(1));
    }
    return this._constraints;
  }
}
