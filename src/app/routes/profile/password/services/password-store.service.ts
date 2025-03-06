import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, tap, switchMap, catchError, finalize, Observable } from 'rxjs';

import { PersonalPassword } from '../types/personal-password';
import { PersonalPasswordService } from './personal-password.service';
import { ConfirmDialogService, ToastService } from '@shared/services';
import { PasswordAddEditComponent } from '../components/add-edit/password-add-edit.component';

export interface PasswordState {
  list: PersonalPassword[];
  count: number;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class PasswordStore extends ComponentStore<PasswordState> {
  apiService = inject(PersonalPasswordService);
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

  readonly filteredPersonalPass$ = this.select(this.state$, (state: PasswordState) => {
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
            tap((res: PersonalPassword[]) =>
              this.patchState({ list: res, count: res.length, isLoading: false })
            )
          )
      ),
      finalize(() => {
        this.patchState({ isLoading: false });
      })
    )
  );

  readonly upsertPassword = this.effect<PersonalPassword | void>(
    (trigger$: Observable<PersonalPassword | void>) => {
      const dialog = (value: PersonalPassword | void) => {
        const dialogRef = this.dialog.open(PasswordAddEditComponent, {
          minWidth: '800px',
          disableClose: true,
          data: value,
        });

        return dialogRef.afterClosed();
      };
      return trigger$.pipe(
        switchMap(value => dialog(value)),
        switchMap((formValue: PersonalPassword) => {
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

  readonly deletePassword = this.effect((cert$: Observable<PersonalPassword>) => {
    return cert$.pipe(
      switchMap(cert =>
        this.confirm
          .confirm(
            this.tr.instant('delete'),
            this.tr.instant('confirms.delete', { name: cert.username })
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
