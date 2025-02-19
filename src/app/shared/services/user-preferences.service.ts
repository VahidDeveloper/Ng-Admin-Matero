import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RemoteMachinesListViewEnum } from '@shared/enums';
import { WinaRestUrls } from '@shared/models';
import { UserPreferences } from '@shared/interfaces';
import { ToastService } from '@shared/services';
import { TranslateService } from '@ngx-translate/core';

/** A service which will be used in storing and retrieving users preferences. */
@Injectable({ providedIn: 'root' })
export class UserPreferencesService {
  /** by listening to this, you can find out changes in user preference. */
  userPreferenceStream: Observable<Readonly<UserPreferences | undefined>>;
  /** you can change user-preference by this subject */
  private _userPreferences = new BehaviorSubject<UserPreferences | undefined>(undefined);
  private _defaultPreference: UserPreferences = {
    pingBeforeConnection: true,
    favoriteNodes: [],
    initPageInRemote: RemoteMachinesListViewEnum.Grid,
  };
  private readonly toast = inject(ToastService);

  /** Constructor */
  constructor(
    private _http: HttpClient,
    private _translatorService: TranslateService
  ) {
    this.userPreferenceStream = this._userPreferences.asObservable();
  }

  /**
   * it would return latest user-preference.
   */
  get currentUserPreference(): UserPreferences | undefined {
    return this._userPreferences.getValue();
  }

  /**
   * a method which returns user preferences.
   * NOTE is caches the data in first fetching.
   */
  getUserPreferenceFromServer(): Observable<UserPreferences> {
    return this._http.get(WinaRestUrls.getUserPreferencesURL()).pipe(
      tap(
        (data: any) => {
          data
            ? this._userPreferences.next(JSON.parse(data))
            : this._userPreferences.next(this._defaultPreference);
        },
        catchError(error => {
          this._userPreferences.next(this._defaultPreference);
          throw error;
        })
      )
    );
  }

  /** it will set user preferences. */
  saveUserPreferenceOnServer(userPreference: UserPreferences): Observable<boolean> {
    return this._http.post<boolean>(WinaRestUrls.setUserPreferencesURL(), {
      preferenceJson: JSON.stringify(userPreference),
    });
  }

  /**
   * it would set pingBeforeConnection flag in user-preference.
   */
  changePingBeforeConnection(pingBeforeConnection: boolean): Observable<boolean> {
    const preference = this.currentUserPreference ?? ({} as UserPreferences);
    return this._changeUserPreference({
      ...preference,
      pingBeforeConnection,
    });
  }

  /**
   * it would set favoriteNodes in user-preference.
   */
  setFavoriteNodes(favoriteNodes: number[]): Observable<boolean> {
    const preference = this.currentUserPreference ?? ({} as UserPreferences);
    return this._changeUserPreference({
      ...preference,
      favoriteNodes,
    });
  }

  /**
   * it would set initPageInRemote in user-preference.
   */
  setInitPageInRemote(initPageInRemote: RemoteMachinesListViewEnum): Observable<boolean> {
    const preference = this.currentUserPreference ?? ({} as UserPreferences);
    return this._changeUserPreference({
      ...preference,
      initPageInRemote,
    });
  }

  /**
   * it would change user-preference by subscribing to saveUserPreferenceOnServer method.
   * in near future, user-preference would be stored in States.
   */
  private _changeUserPreference(userPreference: UserPreferences): Observable<boolean> {
    this._userPreferences.next(userPreference);
    return this.saveUserPreferenceOnServer(userPreference).pipe(
      tap(() =>
        this.toast.open(
          this._translatorService.instant('userPreferencesWasSetSuccessfully'),
          'success'
        )
      ),
      catchError(error => {
        this.toast.open(
          this._translatorService.instant('errorOccurredWhileSettingUserPreferences'),
          'warning'
        );
        throw error;
      })
    );
  }
}
