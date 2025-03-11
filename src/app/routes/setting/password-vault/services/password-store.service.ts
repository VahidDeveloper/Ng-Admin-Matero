import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, tap, switchMap, catchError, finalize, Observable } from 'rxjs';

import { PasswordVault } from '../types/type';
import { PasswordVaultService } from './password-vault.service';
import { ConfirmDialogService, ToastService } from '@shared/services';
import { AddEditPasswordVaultComponent } from '../components/add-edit/add-edit-password-vault.component';

export interface PasswordState {
  list: PasswordVault[];
  count: number;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class PasswordVaultStore extends ComponentStore<PasswordState> {
  apiService = inject(PasswordVaultService);
  confirm = inject(ConfirmDialogService);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  dialog = inject(MatDialog);

  constructor() {
    super({
      list: [],
      count: 0,
      isLoading: false,
      postLoading: false,
      searchTerm: '',
    });
  }

  readonly setSearchTerm = this.updater<string>((state, searchTerm) => ({
    ...state,
    searchTerm,
  }));

  readonly filteredVault$ = this.select(this.state$, (state: PasswordState) => {
    if (!state.searchTerm) {
      return state.list;
    }
    const lowerQuery = state.searchTerm.toLowerCase();
    return state.list.filter(item => item.address?.toLowerCase().includes(lowerQuery));
  });

  readonly getList = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.apiService.getAll().pipe(
          tap({
            next: (res: PasswordVault[]) => {
              this.patchState({ list: res, count: res.length, isLoading: false });
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

  readonly upsertVault = this.effect<PasswordVault | void>(
    (trigger$: Observable<PasswordVault | void>) => {
      const dialog = (value: PasswordVault | void) => {
        const dialogRef = this.dialog.open(AddEditPasswordVaultComponent, {
          minWidth: '800px',
          disableClose: true,
          data: value,
        });

        return dialogRef.afterClosed();
      };
      return trigger$.pipe(
        switchMap(value => dialog(value)),
        switchMap((formValue: PasswordVault) => {
          if (formValue) {
            this.patchState({ postLoading: true });

            // Check if formValue has an ID, indicating edit mode
            const saveOrEdit$ = formValue.id
              ? this.apiService.update(formValue) // Edit if ID is present
              : this.apiService.save(formValue); // Save if no ID

            const message = formValue.id
              ? this.tr.instant('toast.update', {
                  title: this.tr.instant('password'),
                }) // Update message if editing
              : this.tr.instant('toast.create', {
                  title: this.tr.instant('password'),
                });

            return saveOrEdit$.pipe(
              tap(() => {
                this.toast.open(this.tr.instant(message), 'success');
                this.getList(); // Reload the passwords
              }),
              catchError(() => EMPTY),
              finalize(() => this.patchState({ isLoading: false }))
            );
          }
          return EMPTY;
        })
      );
    }
  );

  readonly deleteVault = this.effect((cert$: Observable<PasswordVault>) => {
    return cert$.pipe(
      switchMap(cert =>
        this.confirm
          .confirm(
            this.tr.instant('delete'),
            this.tr.instant('confirms.delete', { name: cert.address })
          )
          .pipe(
            switchMap(confirmed => {
              if (confirmed) {
                this.patchState({ isLoading: true });
                return this.apiService.delete(cert.id!).pipe(
                  tap(() => this.getList()), // Reload the list after delete
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
