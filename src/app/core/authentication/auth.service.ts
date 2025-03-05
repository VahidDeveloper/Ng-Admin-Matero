import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '@shared/services';
import { filterObject, isEmptyObject } from './helpers';
import { LoginStatus } from '@shared/models/http/login-status';
import { csrfInfo, ErrorDisplay, UserBriefInfo } from '@shared/models';
import {
  BehaviorSubject,
  catchError,
  iif,
  map,
  merge,
  Observable,
  of,
  share,
  switchMap,
  tap,
} from 'rxjs';

import { LoginService } from './login.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginService = inject(LoginService);
  private readonly tokenService = inject(TokenService);
  private readonly store = inject(LocalStorageService);

  private user$ = new BehaviorSubject<UserBriefInfo>({} as UserBriefInfo);
  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );

  init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }

  login(username: string, password: string) {
    return this.loginService.validate(username, password).pipe(
      tap(response => {
        this.user$.next(response.userInfo);
        this.store.set('userinfo', response.userInfo);
      }),
      switchMap(() => {
        return this.loginService.login(username, password);
      }),
      tap(response => {
        this.tokenService.set(response);
      }),
      map(() => this.check()),
      catchError((data: ErrorDisplay) => {
        throw data;
      })
    );
  }

  loginStatus(): Observable<LoginStatus> {
    return this.loginService
      .loginStatus()
      .pipe(tap(loginInfo => this._setCsrf(loginInfo.csrfToken, loginInfo.csrfHeader)));
  }

  refresh() {
    return this.loginService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap(token => this.tokenService.set(token)),
        map(() => this.check())
      );
  }

  logout() {
    return this.loginService.logout().pipe(
      tap(() => this.tokenService.clear()),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }

  private assignUser() {
    if (!this.check()) {
      return of({} as UserBriefInfo).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return of(this.store.get('userinfo')).pipe(tap(value => this.user$.next(value)));
  }

  /**
   * it would set csrf based on the specified arguments
   */
  private _setCsrf = (csrfToken: string, csrfHeader: string): void => {
    csrfInfo.csrf = csrfToken;
    csrfInfo.csrfHeader = csrfHeader;
    localStorage.setItem('csrf_token', csrfToken);
    localStorage.setItem('csrf_header', csrfHeader);
  };
}
