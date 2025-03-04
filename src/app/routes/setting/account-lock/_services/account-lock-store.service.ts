import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, tap, switchMap, catchError, finalize } from 'rxjs';

import { ToastService } from '@shared';
import { LockPolicy } from '../_models/lock-policy';
import { LockedUser } from '../_models/locked-user';
import { AccountLockService } from './account-lock.service';

export interface AccountLockState {
  list: any[];
  policy: LockPolicy | undefined;
  count: number;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class AccountLockStore extends ComponentStore<AccountLockState> {
  private readonly service = inject(AccountLockService);
  private readonly toast = inject(ToastService);
  private readonly tr = inject(TranslateService);

  constructor() {
    super({
      list: [],
      count: 0,
      policy: undefined,
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
    return state.list.filter(item => item.name.toLowerCase().includes(lowerQuery));
  });

  readonly getPolicy = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.service.getDefaultLockPolicy().pipe(
          tap((res: LockPolicy) => this.patchState({ policy: res, isLoading: false })),
          catchError(() => {
            this.patchState({ isLoading: false });
            return EMPTY;
          })
        )
      )
    )
  );

  readonly setPolicy = this.effect<LockPolicy>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ postLoading: true })),
      switchMap(formValue =>
        this.service.setLockPolicy(formValue).pipe(
          tap(() => {
            this.patchState({ postLoading: false });
            this.toast.open(
              this.tr.instant('pages.setting.account_lock.update_policy_toast'),
              'success'
            );
          })
        )
      ),
      catchError(() => {
        this.patchState({ postLoading: false });
        return EMPTY;
      })
    )
  );

  readonly getList = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.service.getAll().pipe(
          tap((res: LockedUser[]) =>
            this.patchState({
              list: res,
              count: res.length,
              isLoading: false,
            })
          ),
          catchError(() => {
            this.patchState({ isLoading: false });
            return EMPTY;
          })
        )
      )
    )
  );

  readonly unlockUser = this.effect<LockedUser>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ postLoading: true })),
      switchMap(user =>
        this.service.unLockConnection(user).pipe(
          tap((res: LockedUser) => {
            this.getList(); // Refresh list
            this.toast.open(
              this.tr.instant('toasts.submit', {
                title: this.tr.instant('pages.setting.account_lock.policy'),
                name: res.displayName,
              }),
              'success'
            );
          }),
          catchError(() => EMPTY),
          finalize(() => this.patchState({ postLoading: false }))
        )
      )
    )
  );
}
