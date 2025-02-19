import { Injectable } from '@angular/core';
import { UserRole } from '@shared/enums';
import { UserBriefInfo } from '@shared/models';

/**
 * keep current user information like role and name , ...
 * its value will be set after login
 */
@Injectable({
  providedIn: 'root',
})
export class WinaUserIdentityService {
  private _currentUserInfo: UserBriefInfo | undefined;

  get username(): string | undefined {
    return this._currentUserInfo?.username;
  }

  get userRole(): UserRole | undefined {
    return this._currentUserInfo?.role;
  }

  get userImage(): string | undefined {
    return this._currentUserInfo?.userImage;
  }

  set currentUserInfo(value: UserBriefInfo) {
    if (value) {
      sessionStorage.setItem('userInfo', JSON.stringify(value));
    } else {
      sessionStorage.removeItem('userInfo');
    }
    this._currentUserInfo = value;
  }

  constructor() {
    const value = sessionStorage.getItem('userInfo');
    if (value) {
      this._currentUserInfo = JSON.parse(value);
    }
  }

  /** it checks route data permission by current user role type */
  hasPermission(permission: string | string[]): boolean {
    if (!permission) {
      return true;
    }
    if (typeof permission === 'string') {
      return this.userRole?.toLowerCase() === permission.toLowerCase();
    } else if (Array.isArray(permission)) {
      if (permission.length === 0) {
        return true;
      }
      for (const item of permission) {
        if (this.userRole?.toLowerCase() === item.toLowerCase()) {
          return true;
        }
      }
      return false;
    } else {
      throw Error('invalid value for parameter: permission');
    }
  }
}
