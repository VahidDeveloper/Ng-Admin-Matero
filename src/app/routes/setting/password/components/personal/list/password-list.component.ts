import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxGrid, MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { StoredPassword } from '@shared';
import { PasswordStore } from '../../../services/password-store.service';

/** a component for management user password history */
@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styles: `
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MtxGrid,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class PasswordListComponent implements OnInit {
  store = inject(PasswordStore);
  tr = inject(TranslateService);
  readonly filteredRow$ = this.store.filteredPersonalPass$;
  count$: Observable<number> = of(0);
  searchTerm$: Observable<string> = of('');
  fetchLoading$: Observable<boolean> = of(false);
  columns: MtxGridColumn<StoredPassword>[] = [
    {
      field: 'id',
      header: this.tr.instant('id'),
      disabled: true,
    },
    {
      field: 'username',
      header: this.tr.instant('username'),
    },
    {
      field: 'domain',
      header: this.tr.instant('domain'),
    },
    {
      field: 'identifierKey',
      header: this.tr.instant('identifierKey'),
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
          icon: 'edit',
          color: 'error' as any,
          click: row => this.store.addPassword(),
        },
        {
          type: 'icon',
          icon: 'delete',
          color: 'error' as any,
          click: row => this.store.deletePassword(row),
        },
      ],
    },
  ];

  constructor() {
    this.searchTerm$ = this.store.select(state => state.searchTerm);
    this.fetchLoading$ = this.store.select(state => state.isLoading);
    this.count$ = this.store.select(state => state.count);
  }

  ngOnInit(): void {}

  updateSearch(event: Event): void {
    this.store.setSearchTerm((event.target as HTMLInputElement).value);
  }

  add() {
    this.store.addPassword();
  }
}
