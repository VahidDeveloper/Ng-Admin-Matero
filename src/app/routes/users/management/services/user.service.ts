import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericCrudService } from '@shared/services';
import { UserBriefEntity, UserEntity, UserGroup } from '../types/user';
import { ListServerResponse, RemoteMachine, UsersInfoEntity } from '@shared/interfaces';
import { FilterRemoteMachines, ListServerRequest, WinaRestUrls } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends GenericCrudService<UserEntity> {
  constructor(private http: HttpClient) {
    super(http, '/api/v1/local-users');
  }

  getUsersBrief(ldapList: string[]): Observable<UserBriefEntity[]> {
    const sendObj = { ldapServerList: ldapList };
    const url = WinaRestUrls.usersListBrief();
    const listObserver = this.http.post<UserBriefEntity[]>(url, sendObj);
    if (!ldapList.length) {
      return listObserver.pipe(map(data => this._addUserWithLdap(data)));
    } else {
      return listObserver;
    }
  }

  getLdapServers(): Observable<string[]> {
    const url = WinaRestUrls.ldapServerList();
    return this.http.get<string[]>(url);
  }

  enableOTP(data: Partial<UsersInfoEntity>, ldap: string): Observable<Partial<UserEntity>> {
    const config = {
      username: data.username,
      ldapServer: ldap,
    };
    const url = WinaRestUrls.enableOTP();
    return this.http.post(url, config);
  }

  disableOTP(data: Partial<UsersInfoEntity>, ldap: string): Observable<Partial<UserEntity>> {
    const config = {
      username: data.username,
      ldapServer: ldap,
    };
    const url = WinaRestUrls.disableOTP();
    return this.http.post(url, config);
  }

  lockUser(data: Partial<UsersInfoEntity>, ldap: string): Observable<any> {
    const config = {
      users: [
        {
          username: data.username,
          ldapServer: ldap,
        },
      ],
    };
    const url = WinaRestUrls.lockUser();
    return this.http.post(url, config);
  }

  unlock(data: Partial<UsersInfoEntity>, ldap: string): Observable<any> {
    const config = {
      users: [
        {
          username: data.username,
          ldapServer: ldap,
        },
      ],
    };
    const url = WinaRestUrls.unlockUser();
    return this.http.post(url, config);
  }

  /**
   * it will get information of single user to edit
   */
  getUserInfo(username: string, ldapServer: string): Observable<Partial<UserEntity>> {
    const config = { username, ldapServer };
    const url = WinaRestUrls.getSingleUserInfo();
    return this.http.post(url, config);
  }

  getUsersList(serverName: string): Observable<UsersInfoEntity[]> {
    const url = WinaRestUrls.usersListURL(serverName);
    return this.http.get<UsersInfoEntity[]>(url, {});
  }

  getUserRemoteMachines(
    filter: FilterRemoteMachines,
    listServerRequest: ListServerRequest
  ): Observable<ListServerResponse<RemoteMachine>> {
    const sendObj = {
      ...filter?.getServerObject(),
      ...listServerRequest?.getServerObject(),
    };

    if (sendObj.queryWord) {
      sendObj.searchWord = sendObj.queryWord;
    }
    return this.http.post<ListServerResponse<RemoteMachine>>(
      WinaRestUrls.getUserRemoteMachines(),
      sendObj
    );
  }

  getPermissionGroups(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>(WinaRestUrls.getPermissionGroups());
  }

  getUserPermissionGroups(body: Partial<UserGroup>): Observable<UserGroup[]> {
    return this.http.post<UserGroup[]>(WinaRestUrls.getUserPermissionGroups(), body);
  }

  addOrRemoveUserToGroups(body: Partial<UsersInfoEntity>): Observable<UserGroup[]> {
    return this.http.post<UserGroup[]>(WinaRestUrls.assignUserToGroups(), body);
  }

  private _addUserWithLdap(data: UserBriefEntity[]): UserBriefEntity[] {
    const proxyHandler = {
      get(target: UserBriefEntity, p: PropertyKey): any {
        if (p === 'displayName') {
          return target.displayName + '/' + target.ldapServer;
        } else {
          //TODO:
          // return target[p];
          return '';
        }
      },
    };
    return data.map(ub => new Proxy<UserBriefEntity>(ub, proxyHandler));
  }

  changeRole(username: string, ldapServer: string, isAdmin: boolean): Observable<boolean> {
    return this.http.post<boolean>(WinaRestUrls.changeRole(isAdmin), {
      users: [{ ldapServer, username }],
    });
  }
}
