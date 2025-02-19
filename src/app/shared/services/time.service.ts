import { BehaviorSubject, interval, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { distinctUntilChanged, skip, tap } from 'rxjs/operators';
import { WinaRestUrls } from '@shared/models';

/**
 * a service associated with server-time.
 * you can get server time either locally or from server.
 */
@Injectable({
  providedIn: 'root',
})
export class TimeService {
  /** in each minute, current-server time would be updated based on time-difference. */
  static readonly intervalToUpdateCurrentTime = 60000; // one minute
  /** you can subscribe to it to get notified of the latest time on server */
  currentTimeStream: Observable<number>;
  /** difference between server-time and local-time */
  private _timeDifference: number | undefined;
  /** it is used to notify the latest time on server. */
  private _currentTime = new BehaviorSubject<number>(0);

  /** each 1 minute, it would update the time locally based on time-difference. */
  constructor(private _http: HttpClient) {
    this.currentTimeStream = this._currentTime.asObservable().pipe(skip(1), distinctUntilChanged());
    interval(TimeService.intervalToUpdateCurrentTime).subscribe(() => {
      if (this._timeDifference != null) {
        // if it is null, it means we have not gotten time from server yet.
        this._currentTime.next(Date.now() + this._timeDifference);
      }
    });
  }

  /** it would return current time locally. */
  getCurrentTimeLocally(): number {
    return this._currentTime.getValue();
  }

  /**
   * it would get current server-time from server. it should be called at least once to find out time-difference.
   * note that in some places like remote-machines connections, we call this REST just to prevent session-timeout.
   */
  getCurrentTimeFromServer(): Observable<number> {
    return this._http.get<number>(WinaRestUrls.timeCurrent()).pipe(
      tap((currentTime: number) => {
        this._timeDifference = currentTime - Date.now();
        this._currentTime.next(currentTime);
      })
    );
  }
}
