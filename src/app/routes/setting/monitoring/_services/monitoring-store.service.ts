import { DOCUMENT } from '@angular/common';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { Inject, inject, Injectable } from '@angular/core';
import { MonitoringToken } from '../_models/monitoring-token';
import { EMPTY, tap, switchMap, catchError, finalize, from } from 'rxjs';

import { MonitoringService } from './monitoring.service';
import { MonitoringTokenService } from './monitoring-token.service';
import { MonitoringRefreshTokenService } from './monitoring-refresh-token.service';

export interface MonitoringListState {
  list: { label: string }[];
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

  constructor(@Inject(DOCUMENT) private _document: Document) {
    super({
      list: [],
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
      return state.list;
    }
    const lowerQuery = state.searchTerm.toLowerCase();
    return state.list.filter(item => item.label.toLowerCase().includes(lowerQuery));
  });

  // Effect to load token and then list
  readonly loadTokenAndList = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.monitoringTokenService.getData().pipe(
          tap((res: MonitoringToken) => this.patchState({ token: res.token })),
          switchMap(() =>
            this.monitoringService.getAll().pipe(
              tap({
                next: (res: string[]) => {
                  const list = res.map(item => ({
                    label: this.baseUrl + item,
                  }));
                  this.patchState({ list, count: list.length });
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
          tap((res: MonitoringToken) => {
            this.patchState({ token: res.token });
            // After refresh, reload the list.
            this.loadTokenAndList();
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
          catchError(err => {
            console.error('Error copying to clipboard:', err);
            return EMPTY;
          })
        );
      })
    )
  );
}
