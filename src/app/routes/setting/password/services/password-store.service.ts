import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, tap, switchMap, catchError, finalize, Observable } from 'rxjs';

import { PasswordAddEditComponent } from '../components/personal/add-edit/password-add-edit.component';
import { OrgPasswordAddEditComponent } from '../components/org/add-edit/org-password-add-edit.component';
import { ConfirmDialogService, OrganizationalPassword, ToastService } from '@shared';
import { PersonalPasswordService } from './personal-password.service';
import { PersonalPassword } from '../types/personal-password';
import { OrganizationPasswordService } from './org-password.service';

export interface PasswordState {
  list: PersonalPassword[];
  orgList: OrganizationalPassword[];
  count: number;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class PasswordStore extends ComponentStore<PasswordState> {
  personalPassService = inject(PersonalPasswordService);
  orgPassService = inject(OrganizationPasswordService);
  confirm = inject(ConfirmDialogService);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  dialog = inject(MatDialog);

  constructor() {
    super({
      list: [],
      orgList: [],
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

  readonly filteredOrgPass$ = this.select(this.state$, (state: PasswordState) => {
    if (!state.searchTerm) {
      return state.orgList;
    }
    const lowerQuery = state.searchTerm.toLowerCase();
    return state.orgList.filter(item => item.address?.toLowerCase().includes(lowerQuery));
  });

  readonly getPersonalPasswords = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.personalPassService
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

  readonly getOrgPasswords = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.orgPassService.getAll().pipe(
          tap({
            next: (res: OrganizationalPassword[]) => {
              this.patchState({ orgList: res, count: res.length, isLoading: false });
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

  readonly upsertPersonalPassword = this.effect<PersonalPassword | void>(
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
              ? this.personalPassService.update(formValue) // Edit if ID is present
              : this.personalPassService.save(formValue); // Save if no ID

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
                this.getPersonalPasswords(); // Reload the passwords
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

  readonly upsertOrgPassword = this.effect<OrganizationalPassword | void>(
    (trigger$: Observable<OrganizationalPassword | void>) => {
      const dialog = (value: OrganizationalPassword | void) => {
        const dialogRef = this.dialog.open(OrgPasswordAddEditComponent, {
          minWidth: '800px',
          disableClose: true,
          data: value,
        });

        return dialogRef.afterClosed();
      };
      return trigger$.pipe(
        switchMap(value => dialog(value)),
        switchMap((formValue: OrganizationalPassword) => {
          if (formValue) {
            this.patchState({ postLoading: true });

            // Check if formValue has an ID, indicating edit mode
            const saveOrEdit$ = formValue.id
              ? this.orgPassService.update(formValue) // Edit if ID is present
              : this.orgPassService.save(formValue); // Save if no ID

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
                this.getOrgPasswords(); // Reload the passwords
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
                return this.personalPassService.delete(cert.id!).pipe(
                  tap(() => this.getPersonalPasswords()), // Reload the list after delete
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

  readonly deleteOrgPassword = this.effect((cert$: Observable<OrganizationalPassword>) => {
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
                return this.orgPassService.delete(cert.id!).pipe(
                  tap(() => this.getOrgPasswords()), // Reload the list after delete
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
