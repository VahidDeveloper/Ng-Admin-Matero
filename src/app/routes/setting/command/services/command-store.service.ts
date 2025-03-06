import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStore } from '@ngrx/component-store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, tap, switchMap, catchError, finalize, Observable } from 'rxjs';

import { AddEditCommandComponent } from '../components/add-edit/add-edit-command.component';
import {
  CommandSettingModel,
  CommandSettingService,
  ConfirmDialogService,
  ToastService,
} from '@shared';
import { CACertificate } from '../../certificate/types/CA-certificate';

export interface CommandState {
  list: CommandSettingModel[];
  count: number;
  isLoading: boolean;
  postLoading: boolean;
  searchTerm: string;
}

@Injectable()
export class CommandStore extends ComponentStore<CommandState> {
  service = inject(CommandSettingService);
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

  readonly filteredRow$ = this.select(this.state$, state => {
    if (!state.searchTerm) {
      return state.list;
    }
    const lowerQuery = state.searchTerm.toLowerCase();
    return state.list.filter(item => item.name.toLowerCase().includes(lowerQuery));
  });

  readonly getList = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.service.getCommandList().pipe(
          tap({
            next: (res: CommandSettingModel[]) => {
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

  readonly upsertCommand = this.effect<CommandSettingModel | void>(
    (trigger$: Observable<CommandSettingModel | void>) =>
      trigger$.pipe(
        switchMap(command => {
          const dialogRef = this.dialog.open(AddEditCommandComponent, {
            minWidth: '600px',
            disableClose: true,
            data: command || null, // Pass data if editing, null if adding
          });

          return dialogRef.afterClosed();
        }),
        switchMap((formValue: CommandSettingModel | undefined) => {
          if (formValue) {
            this.patchState({ isLoading: true });

            return this.service.addOrEditCommand(formValue).pipe(
              tap(() => {
                this.toast.open(
                  this.tr.instant(
                    formValue.id
                      ? this.tr.instant('toast.update', {
                          title: this.tr.instant('commands'),
                        }) // Update message if editing
                      : this.tr.instant('toast.create', {
                          title: this.tr.instant('commands'),
                        })
                  ),
                  'success'
                );
                this.getList();
              }),
              catchError(e => {
                this.patchState({ isLoading: false });
                this.toast.open(e.message, 'error');
                return EMPTY;
              }),
              finalize(() => this.patchState({ isLoading: false }))
            );
          }
          return EMPTY; // If the dialog is closed without submitting
        })
      )
  );

  readonly deleteCommand = this.effect((trigger$: Observable<number>) => {
    return trigger$.pipe(
      switchMap(id =>
        this.confirm
          .confirm('', this.tr.instant('confirms.delete', { name: this.tr.instant('commands') }))
          .pipe(
            switchMap(confirmed => {
              if (confirmed) {
                this.patchState({ isLoading: true });
                return this.service.deleteCommand(id).pipe(
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
