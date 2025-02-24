import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Menu } from '@core';
import { Token, User } from './interface';
import { WinaRestUrls } from '@shared';
import { RestResponse } from '@shared/models/rest-response';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);

  validate(username: string, password: string) {
    return this.http.post<Token>('/rest/login/wina/validate', { username, password });
  }

  login(username: string, password: string): Observable<RestResponse<Token>> {
    return this.http.post<RestResponse<Token>>(WinaRestUrls.jwtAuthenticateURL(), {
      username,
      password,
    });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  user() {
    return this.http.get<User>('/user');
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/user/menu').pipe(map(res => res.menu));
  }
}
