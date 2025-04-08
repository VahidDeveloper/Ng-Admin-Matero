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

import { SyslogServerModel } from '../../types/type';
import { BreadcrumbComponent } from '@shared/components';
import { SyslogStore } from '../../services/store.service';

@Component({
  templateUrl: './syslog-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SyslogStore],
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
    BreadcrumbComponent,
  ],
})
export class SyslogListComponent implements OnInit {
  store = inject(SyslogStore);
  tr = inject(TranslateService);

  filteredRow$ = this.store.filteredList$;
  count$: Observable<number> = of(0);
  searchTerm$: Observable<string> = of('');
  fetchLoading$: Observable<boolean> = of(false);

  columns: MtxGridColumn<SyslogServerModel>[] = [
    {
      field: 'address',
      header: this.tr.instant('share.id'),
      disabled: true,
    },
    {
      field: 'port',
      header: this.tr.instant('address'),
    },
    {
      field: 'protocol',
      header: this.tr.instant('share.protocol'),
    },
    {
      field: 'ssl',
      header: this.tr.instant('ssl'),
    },
    {
      field: 'ignoreCert',
      header: this.tr.instant('share.ignore_certificate'),
    },
    {
      field: 'subCategories',
      header: this.tr.instant('pages.wina_setting.syslog.categories'),
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
          click: row => this.store.openDialog(row),
        },
        {
          type: 'icon',
          icon: 'delete',
          color: 'error' as any,
          click: row => this.store.deleteServer(row),
        },
      ],
    },
  ];

  constructor() {
    this.store.getList();
  }

  ngOnInit(): void {
    this.searchTerm$ = this.store.select(state => state.searchTerm);
    this.fetchLoading$ = this.store.select(state => state.isLoading);
    this.count$ = this.store.select(state => state.count);
  }

  updateSearch(event: Event): void {
    this.store.setSearchTerm((event.target as HTMLInputElement).value);
  }

  add() {
    this.store.openDialog();
  }
}
