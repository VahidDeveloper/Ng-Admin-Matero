import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, tap, switchMap, catchError, finalize, Observable } from 'rxjs';

import { LockPolicy } from '../_models/lock-policy';
import { LockedUser } from '../_models/locked-user';
import { AccountLockService } from './account-lock.service';
import { ConfirmDialogService, ToastService } from '@shared';

export interface AccountLockState {
  list: any[];
  policy: LockPolicy | undefined;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class AccountLockStore extends ComponentStore<AccountLockState> {
  service = inject(AccountLockService);
  confirm = inject(ConfirmDialogService);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  dialog = inject(MatDialog);

  constructor() {
    super({
      list: [],
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
          tap({
            next: (res: LockPolicy) => {
              this.patchState({ policy: res });
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
  );

  readonly setPolicy = this.effect<any>((trigger$: Observable<any>) =>
    trigger$.pipe(
      switchMap(({ formValue }) => {
        this.patchState({ postLoading: true });
        return this.service.setLockPolicy(formValue).pipe(
          tap({
            next: () => {
              this.toast.open(
                this.tr.instant('toast.submit', {
                  title: this.tr.instant('pages.setting.account_lock.self_signed'),
                  name: formValue.name,
                }),
                'success'
              );
            },
          }),
          finalize(() => {
            this.patchState({ postLoading: false });
          })
        );
      })
    )
  );

  readonly getList = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.service.getAll().pipe(
          tap({
            next: (res: LockedUser[]) => {
              this.patchState({ list: res, isLoading: false });
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
  );

  readonly unlockUser = this.effect((user$: Observable<LockedUser>) => {
    return user$.pipe(
      switchMap(user =>
        this.confirm
          .confirm(
            this.tr.instant('delete'),
            this.tr.instant('pages.setting.account_lock.ca_delete', { name: user.displayName })
          )
          .pipe(
            switchMap(confirmed => {
              if (confirmed) {
                this.patchState({ postLoading: true });
                return this.service.unLockConnection(user).pipe(
                  tap(() => this.getList()), // Reload the list after delete
                  catchError(() => {
                    this.patchState({ postLoading: false });
                    return EMPTY;
                  })
                );
              } else {
                return EMPTY;
              }
            })
          )
      )
    );
  });
}
