import { ajax } from 'rxjs/ajax';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Token } from './interface';
import { RestResponse } from '@shared/models/rest-response';
import { UserBriefInfo, WinaRestUrls } from '@shared/models';

interface ValidateRes {
  loggedIn: boolean;
  userInfo: UserBriefInfo;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);

  validate(username: string, password: string): Observable<RestResponse<ValidateRes>> {
    return this.http.post<RestResponse<ValidateRes>>(WinaRestUrls.firstLevelLoginURL, {
      username,
      password,
    });
  }

  login(username: string, password: string): Observable<RestResponse<Token>> {
    return this.http.post<RestResponse<Token>>(WinaRestUrls.jwtAuthenticateURL(), {
      username,
      password,
    });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>(WinaRestUrls.resetJwtTokenURL(), params);
  }

  logout() {
    return this.http.post<any>(WinaRestUrls.logoutURL(), {});
  }

  user() {
    return this.http.get<UserBriefInfo>(WinaRestUrls.getUser());
  }

  menu() {
    return ajax('data/menu.json?_t=' + Date.now()).pipe(
      map((response: any) => response.response.menu)
    );
  }
}
