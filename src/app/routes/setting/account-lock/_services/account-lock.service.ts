import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WinaRestUrls } from '@shared/models';
import { LockedUser } from '../_models/locked-user';
import { LockPolicy } from '../_models/lock-policy';
import { GenericCrudService } from '@shared/services';

/**
 * this service is created to do some action in locked users in connection module
 * like show list of locked users in connection
 * and do locked policy and etc..
 */

@Injectable({
  providedIn: 'root',
})
export class AccountLockService extends GenericCrudService<LockedUser> {
  constructor(protected _http: HttpClient) {
    super(_http, WinaRestUrls.connectionLock());
  }

  /**
   * to unLock user in a connection
   */
  unLockConnection(blockUser: LockedUser): Observable<LockedUser> {
    return this._http.post<LockedUser>(WinaRestUrls.unLockConnection(), blockUser);
  }

  /**
   * set lock policy
   */
  setLockPolicy(blockPolicy: LockPolicy): Observable<LockPolicy> {
    return this._http.put<LockPolicy>(WinaRestUrls.connectionLockPolicy(), blockPolicy);
  }

  /**
   * get default connection lock policy
   */
  getDefaultLockPolicy(): Observable<LockPolicy> {
    return this._http.get<LockPolicy>(WinaRestUrls.connectionLockPolicy());
  }
}
