import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MtxGrid, MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LockedUser } from '../../_models/locked-user';
import { AccountLockStore } from '../../_services/account-lock-store.service';

/**
 * this component is created to show list of blocked users
 */
@Component({
  selector: 'app-account-lock-list',
  templateUrl: './account-lock-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MtxGrid, AsyncPipe, MatFormField, MatInput, TranslatePipe],
  styles: `
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
  `,
})
export class AccountLockListComponent {
  store = inject(AccountLockStore);
  tr = inject(TranslateService);
  readonly filteredRow$ = this.store.filteredRow$;
  count$: Observable<number> = of(0);
  searchTerm$: Observable<string> = of('');
  /**
   * a flag to show loading on get data
   */
  fetchLoading$: Observable<boolean> = of(false);

  /**
   * columns data needed for data-table
   */
  columns: MtxGridColumn<LockedUser>[] = [
    {
      field: 'username',
      header: this.tr.instant('username'),
      sortable: true,
      disabled: true,
    },
    {
      field: 'connectionName',
      header: this.tr.instant('connection_name'),
    },
    {
      field: 'ldapServer',
      header: this.tr.instant('ldap_server'),
    },
    {
      field: 'ipAddress',
      header: this.tr.instant('ip_address'),
    },
    {
      field: 'protocol',
      header: this.tr.instant('protocol'),
    },
    {
      field: 'os',
      header: this.tr.instant('os'),
    },
    {
      header: this.tr.instant('operation'),
      field: 'operation',
      minWidth: 140,
      width: '140px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'lock_open',
          tooltip: this.tr.instant('unlock'),
          pop: {
            title: this.tr.instant('confirm_delete'),
            closeText: this.tr.instant('close'),
            okText: this.tr.instant('ok'),
          },
          click: row => this.unlock(row),
        },
      ],
    },
  ];

  constructor() {
    this.searchTerm$ = this.store.select(state => state.searchTerm);
    this.fetchLoading$ = this.store.select(state => state.isLoading);
    this.count$ = this.store.select(state => state.count);
  }

  updateSearch(event: Event): void {
    this.store.setSearchTerm((event.target as HTMLInputElement).value);
  }

  unlock(user: LockedUser) {
    this.store.unlockUser(user);
  }
}
