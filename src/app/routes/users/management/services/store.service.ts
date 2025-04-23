import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, tap, switchMap, catchError, finalize, Observable, map } from 'rxjs';

import { UserEntity } from '../types/user';
import { UsersService } from './user.service';
import { ConfirmDialogService, ToastService } from '@shared/services';
import { AddUserComponent } from '../components/add/add-user.component';

export interface LdapState {
  list: UserEntity[];
  count: number;
  ref: MatDialogRef<AddUserComponent> | undefined;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class UserStore extends ComponentStore<LdapState> {
  apiService = inject(UsersService);
  confirm = inject(ConfirmDialogService);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  dialog = inject(MatDialog);

  constructor() {
    super({
      list: [],
      count: 0,
      ref: undefined,
      isLoading: false,
      postLoading: false,
      searchTerm: '',
    });
  }

  readonly setSearchTerm = this.updater<string>((state, searchTerm) => ({
    ...state,
    searchTerm,
  }));

  readonly filteredList$ = this.select(this.state$, (state: LdapState) => {
    if (!state.searchTerm) {
      return state.list;
    }
    const lowerQuery = state.searchTerm.toLowerCase();
    return state.list.filter(item => item.username?.toLowerCase().includes(lowerQuery));
  });

  readonly getList = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.apiService
          .getAll()
          .pipe(
            tap((res: UserEntity[]) =>
              this.patchState({ list: res, count: res.length, isLoading: false })
            )
          )
      ),
      catchError(() => EMPTY),
      finalize(() => {
        this.patchState({ isLoading: false });
      })
    )
  );

  readonly openDialog = this.effect<UserEntity | void>(
    (trigger$: Observable<UserEntity | void>) => {
      const dialog = () => {
        const dialogRef = this.dialog.open(AddUserComponent, {
          minWidth: '800px',
          disableClose: true,
          data: { store: this },
        });
        this.patchState({ ref: dialogRef });
        return dialogRef;
      };
      return trigger$.pipe(map(() => dialog()));
    }
  );

  readonly upsertUser = this.effect<UserEntity | void>(
    (trigger$: Observable<UserEntity | void>) => {
      return trigger$.pipe(
        tap(() => (this.get().isLoading = false)),
        switchMap(formValue => {
          if (formValue) {
            this.patchState({ postLoading: true });

            const message = this.tr.instant(formValue.username ? 'toast.update' : 'toast.create', {
              title: this.tr.instant('user'),
            });

            return this.apiService.update(formValue).pipe(
              tap(() => {
                this.toast.open(this.tr.instant(message), 'success');
                this.getList();
                this.get().ref?.close();
              }),
              catchError(() => EMPTY),
              finalize(() => {
                this.patchState({ postLoading: false });
              })
            );
          }
          return EMPTY;
        })
      );
    }
  );

  readonly deleteUser = this.effect((trigger$: Observable<UserEntity>) => {
    return trigger$.pipe(
      switchMap(user =>
        this.confirm
          .confirm(
            this.tr.instant('delete'),
            this.tr.instant('confirms.delete', { name: user.username })
          )
          .pipe(
            switchMap(confirmed => {
              if (confirmed) {
                this.patchState({ isLoading: true });
                return this.apiService.delete(user.username!).pipe(
                  tap(() => this.getList()),
                  catchError(() => {
                    this.patchState({ isLoading: false });
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
