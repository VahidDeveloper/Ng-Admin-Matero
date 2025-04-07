import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, tap, switchMap, catchError, finalize, Observable, map } from 'rxjs';

import { SyslogService } from './syslog.service';
import { SyslogServerModel } from '../types/type';
import { ConfirmDialogService, ToastService } from '@shared/services';
import { AddEditSyslogComponent } from '../components/add-edit/add-edit-syslog.component';

export interface SyslogState {
  list: SyslogServerModel[];
  categories: string[];
  count: number;
  ref: MatDialogRef<AddEditSyslogComponent> | undefined;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class SyslogStore extends ComponentStore<SyslogState> {
  apiService = inject(SyslogService);
  confirm = inject(ConfirmDialogService);
  toast = inject(ToastService);
  tr = inject(TranslateService);
  dialog = inject(MatDialog);

  constructor() {
    super({
      list: [],
      categories: [],
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

  readonly filteredList$ = this.select(this.state$, (state: SyslogState) => {
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
        this.apiService.getList().pipe(
          tap((res: SyslogServerModel[]) =>
            this.patchState({ list: res, count: res.length, isLoading: false })
          ),
          switchMap(() =>
            this.apiService.getSyslogCategories().pipe(
              tap((res: string[]) => {
                this.patchState({ categories: res });
              })
            )
          )
        )
      ),
      catchError(() => EMPTY),
      finalize(() => {
        this.patchState({ isLoading: false });
      })
    )
  );

  readonly testServerAvailability = this.effect<SyslogServerModel>(server$ =>
    server$.pipe(
      tap(() => this.patchState({ postLoading: true })), // Indicate loading state
      switchMap(server =>
        this.apiService.testServerAvailability(server).pipe(
          tap(() => {
            this.toast.open(this.tr.instant('toast.connection_success'), 'success');
          }),
          catchError(() => EMPTY),
          finalize(() => this.patchState({ postLoading: false }))
        )
      )
    )
  );

  readonly openDialog = this.effect<SyslogServerModel | void>(
    (trigger$: Observable<SyslogServerModel | void>) => {
      const dialog = (value: SyslogServerModel | void) => {
        const dialogRef = this.dialog.open(AddEditSyslogComponent, {
          minWidth: '800px',
          disableClose: true,
          data: { value, store: this },
        });
        this.patchState({ ref: dialogRef });
        return dialogRef;
      };
      return trigger$.pipe(map(value => dialog(value)));
    }
  );

  readonly upsertServer = this.effect<SyslogServerModel | void>(
    (trigger$: Observable<SyslogServerModel | void>) => {
      return trigger$.pipe(
        tap(() => (this.get().isLoading = false)),
        switchMap(formValue => {
          if (formValue) {
            this.patchState({ postLoading: true });

            const message = this.tr.instant(formValue.id ? 'toast.update' : 'toast.create', {
              title: this.tr.instant('pages.wina_setting.syslog.server'),
            });

            return this.apiService.updateServer(formValue).pipe(
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

  readonly deleteServer = this.effect((cert$: Observable<SyslogServerModel>) => {
    return cert$.pipe(
      switchMap(server =>
        this.confirm
          .confirm(
            this.tr.instant('delete'),
            this.tr.instant('confirms.delete', { name: server.address })
          )
          .pipe(
            switchMap(confirmed => {
              if (confirmed) {
                this.patchState({ isLoading: true });
                return this.apiService.deleteServer(server.id!).pipe(
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
