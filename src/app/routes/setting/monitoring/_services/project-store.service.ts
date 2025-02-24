import { tr } from 'date-fns/locale';
import { Inject, inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { MonitoringService } from '../_services/monitoring.service';
import { MonitoringTokenService } from '../_services/monitoring-token.service';
import { MonitoringRefreshTokenService } from '../_services/monitoring-refresh-token.service';
import { TranslateService } from '@ngx-translate/core';
import { MonitoringToken } from '../_models/monitoring-token';
import { EMPTY, tap, switchMap, catchError, finalize, from } from 'rxjs';
import { ToastService } from '@shared';
import { DOCUMENT } from '@angular/common';

export interface MonitoringListState {
  row: { label: string }[];
  token?: string;
  count?: number;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class MonitoringListStore extends ComponentStore<MonitoringListState> {
  readonly baseUrl = 'https://192.168.112.121';
  monitoringService = inject(MonitoringService);
  monitoringTokenService = inject(MonitoringTokenService);
  monitoringRefreshTokenService = inject(MonitoringRefreshTokenService);
  translate = inject(TranslateService);
  toast = inject(ToastService);
  constructor(@Inject(DOCUMENT) private _document: Document) {
    super({
      row: [],
      count: 0,
      token: undefined,
      isLoading: false,
      postLoading: false,
      searchTerm: '',
    });
  }

  readonly setSearchTerm = this.updater<string>((state, searchTerm) => ({
    ...state,
    searchTerm,
  }));

  readonly filteredRow$ = this.select(this.state$, state => {
    if (!state.searchTerm) {
      return state.row;
    }
    const lowerQuery = state.searchTerm.toLowerCase();
    return state.row.filter(item => item.label.toLowerCase().includes(lowerQuery));
  });

  // Effect to load token and then list
  readonly loadTokenAndList = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.monitoringTokenService.getData().pipe(
          tap({
            next: (res: MonitoringToken) => {
              this.patchState({ token: res.token });
            },
            error: (err: any) => {
              const errorMsg = this.translate.instant('AnErrorOccurredDuringCurrentUserToken');
              this.toast.open(errorMsg, 'error');
            },
          }),
          switchMap(() =>
            this.monitoringService.getAll().pipe(
              tap({
                next: (res: string[]) => {
                  const row = res.map(item => ({
                    label: this.baseUrl + item,
                  }));
                  this.patchState({ row, count: row.length });
                },
                error: (err: any) => {
                  const errorMsg = this.translate.instant('AnErrorOccurredDuringMonitoringApiList');
                  this.toast.open(errorMsg, 'error');
                },
              }),
              catchError(() => EMPTY)
            )
          ),
          catchError(() => EMPTY),
          finalize(() => {
            this.patchState({ isLoading: false });
          })
        )
      )
    )
  );

  // Effect to refresh token then reload list
  readonly refreshTokenEffect = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ postLoading: true })),
      switchMap(() =>
        this.monitoringRefreshTokenService.save({} as MonitoringToken).pipe(
          tap({
            next: (res: MonitoringToken) => {
              this.patchState({ token: res.token });
              // After refresh, reload the list.
              this.loadTokenAndList();
            },
            error: (err: any) => {
              const errorMsg = this.translate.instant('refreshMonitoringTokenError');

              this.toast.open(errorMsg, 'error');
            },
          }),
          catchError(() => EMPTY),
          finalize(() => {
            this.patchState({ postLoading: false });
          })
        )
      )
    )
  );

  readonly copyEffect = this.effect<string | undefined>(data$ =>
    data$.pipe(
      switchMap(data => {
        // Use provided data; if not provided, fall back to the current token in state
        const textToCopy = data || this.get().token;
        if (!textToCopy) {
          // If still no value is available, complete without doing anything.
          return EMPTY;
        }
        // Attempt to write the text to the clipboard.
        const clipboardPromise =
          this._document.defaultView?.navigator.clipboard.writeText(textToCopy);
        if (!clipboardPromise) {
          return EMPTY;
        }
        return from(clipboardPromise).pipe(
          tap(() => console.log('Text copied to clipboard successfully.', textToCopy)),
          catchError(err => {
            console.error('Error copying to clipboard:', err);
            return EMPTY;
          })
        );
      })
    )
  );
}
