import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoginConstraint } from '@shared/interfaces';
import { WinaRestUrls } from '@shared/models';

/**
 * login constraint config service
 */
@Injectable({
  providedIn: 'root',
})
export class LoginConstraintConfigService {
  /**
   * constraints data
   */
  private _constraints: Observable<LoginConstraint> | undefined;

  /**
   * http client
   */
  constructor(private _http: HttpClient) {}

  /**
   * get constraint from serve or read it from cache
   */
  getConstraint(): Observable<LoginConstraint> {
    if (!this._constraints) {
      this._constraints = this._http
        .get<LoginConstraint>(WinaRestUrls.winaLoginConstraint(), {})
        .pipe(shareReplay(1));
    }
    return this._constraints;
  }

  /**
   * to save new edition from edit mode
   * @param data:get data and save new edition
   */
  saveConstraint(data: LoginConstraint): Observable<boolean> {
    this._constraints = undefined;
    return this._http.post<boolean>(WinaRestUrls.winaSaveLoginConstraint(), {
      ...data,
    });
  }
}
