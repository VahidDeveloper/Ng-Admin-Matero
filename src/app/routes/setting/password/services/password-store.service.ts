import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, tap, switchMap, catchError, finalize, Observable } from 'rxjs';

import { PasswordAddEditComponent } from '../components/personal/add-edit/password-add-edit.component';
import { OrgPasswordAddEditComponent } from '../components/org/add-edit/org-password-add-edit.component';
import {
  ConfirmDialogService,
  OrganizationalPassword,
  StoredPassword,
  StoredPasswordService,
  ToastService,
} from '@shared';

export interface PasswordState {
  list: StoredPassword[];
  orgList: OrganizationalPassword[];
  count: number;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class PasswordStore extends ComponentStore<PasswordState> {
  service = inject(StoredPasswordService);
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
        this.service.getPersonalStoredPasswords().pipe(
          tap({
            next: (res: StoredPassword[]) => {
              this.patchState({ list: res, count: res.length, isLoading: false });
            },
          }),
          catchError(() => EMPTY),
          finalize(() => {
            this.patchState({ isLoading: false });
          })
        )
      ),
      catchError(() => EMPTY)
    )
  );

  readonly getOrgPasswords = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.service.getOrganizationalPasswords().pipe(
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

  readonly addPassword = this.effect(trigger$ => {
    const openEditDialog = () => {
      const dialogRef = this.dialog.open(PasswordAddEditComponent, {
        minWidth: '600px',
        disableClose: true,
      });

      return dialogRef.afterClosed();
    };

    return trigger$.pipe(
      switchMap(() =>
        openEditDialog().pipe(
          switchMap((newCert: StoredPassword) => {
            if (newCert) {
              // If the user submits the form, proceed with the update
              this.patchState({ isLoading: true });
              return this.service.addEditStoredPassword(true, newCert).pipe(
                tap(() => {
                  this.toast.open(
                    this.tr.instant('toast.create', {
                      title: this.tr.instant('pages.settign.certificate.title'),
                      name: newCert.username,
                    }),
                    'success'
                  );
                  this.getPersonalPasswords();
                }),
                catchError(e => {
                  this.patchState({ isLoading: false });
                  return EMPTY;
                })
              );
            } else {
              return EMPTY; // If the user cancels the dialog, do nothing
            }
          })
        )
      )
    );
  });

  readonly addOrgPassword = this.effect(trigger$ => {
    const openEditDialog = () => {
      const dialogRef = this.dialog.open(OrgPasswordAddEditComponent, {
        minWidth: '600px',
        disableClose: true,
      });

      return dialogRef.afterClosed();
    };

    return trigger$.pipe(
      switchMap(() =>
        openEditDialog().pipe(
          switchMap((newCert: OrganizationalPassword) => {
            if (newCert) {
              // If the user submits the form, proceed with the update
              this.patchState({ isLoading: true });
              return this.service.addOrganizationalPassword(newCert).pipe(
                tap(() => {
                  this.toast.open(
                    this.tr.instant('toast.create', {
                      title: this.tr.instant('pages.setting.certificate.title'),
                    }),
                    'success'
                  );
                  this.getOrgPasswords();
                }),
                catchError(e => {
                  this.patchState({ isLoading: false });
                  return EMPTY;
                })
              );
            } else {
              return EMPTY; // If the user cancels the dialog, do nothing
            }
          })
        )
      )
    );
  });

  readonly deletePassword = this.effect(
    (cert$: Observable<StoredPassword | OrganizationalPassword>) => {
      return cert$.pipe(
        switchMap(cert =>
          this.confirm
            .confirm(this.tr.instant('delete'), this.tr.instant('confirms.delete', { name: cert }))
            .pipe(
              switchMap(confirmed => {
                if (confirmed) {
                  this.patchState({ isLoading: true });
                  return this.service.deleteStoredPassword(true, cert.id!).pipe(
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
    }
  );

  readonly deleteOrgPassword = this.effect((cert$: Observable<OrganizationalPassword>) => {
    return cert$.pipe(
      switchMap(cert =>
        this.confirm
          .confirm(this.tr.instant('delete'), this.tr.instant('confirms.delete', { name: cert.id }))
          .pipe(
            switchMap(confirmed => {
              if (confirmed) {
                this.patchState({ isLoading: true });
                return this.service.deleteOrganizationalPassword(cert.id!).pipe(
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
