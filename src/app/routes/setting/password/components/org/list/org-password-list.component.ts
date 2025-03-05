import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxGrid, MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { OrganizationalPassword, StoredPassword } from '@shared';
import { PasswordStore } from '../../../services/password-store.service';

@Component({
  selector: 'app-org-password-list',
  templateUrl: './org-password-list.component.html',
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
export class OrgPasswordListComponent implements OnInit {
  store = inject(PasswordStore);
  tr = inject(TranslateService);
  readonly filteredRow$ = this.store.filteredOrgPass$;
  count$: Observable<number> = of(0);
  searchTerm$: Observable<string> = of('');
  fetchLoading$: Observable<boolean> = of(false);
  columns: MtxGridColumn<OrganizationalPassword>[] = [
    {
      field: 'id',
      header: this.tr.instant('id'),
      disabled: true,
    },
    {
      field: 'address',
      header: this.tr.instant('address'),
    },
    {
      field: 'readonly',
      header: this.tr.instant('readonly'),
    },
    {
      field: 'ssl',
      header: this.tr.instant('ssl'),
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
          click: row => this.store.upsertOrgPassword(row),
        },
        {
          type: 'icon',
          icon: 'delete',
          color: 'error' as any,
          click: row => this.store.deleteOrgPassword(row),
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
    this.store.upsertOrgPassword();
  }
}
