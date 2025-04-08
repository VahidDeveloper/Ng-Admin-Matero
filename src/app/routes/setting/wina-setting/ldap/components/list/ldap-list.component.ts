import {
  OnInit,
  Component,
  ViewChild,
  TemplateRef,
  ChangeDetectionStrategy,
  inject,
  AfterViewInit,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxGrid, MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { LdapStore } from '../../services/store.service';
import { BreadcrumbComponent } from '@shared/components';
import { LdapServerModel } from '../../types/ldap-server-model';

@Component({
  templateUrl: './ldap-list.component.html',
  providers: [LdapStore],
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
    BreadcrumbComponent,
    MatIcon,
  ],
})
export class LdapListComponent implements OnInit, AfterViewInit {
  store = inject(LdapStore);
  tr = inject(TranslateService);

  filteredRow$ = this.store.filteredList$;
  count$: Observable<number> = of(0);
  searchTerm$: Observable<string> = of('');
  fetchLoading$: Observable<boolean> = of(false);

  @ViewChild('booleanTemp', { static: false }) private booleanTemp: TemplateRef<any> | null = null;

  columns: MtxGridColumn<LdapServerModel>[] = [];

  constructor() {
    this.store.getList();
  }

  ngOnInit(): void {
    this.searchTerm$ = this.store.select(state => state.searchTerm);
    this.fetchLoading$ = this.store.select(state => state.isLoading);
    this.count$ = this.store.select(state => state.count);
  }

  ngAfterViewInit() {
    this.columns = [
      {
        field: 'address',
        header: this.tr.instant('address'),
      },
      {
        field: 'port',
        header: this.tr.instant('share.port'),
      },
      {
        field: 'baseDn',
        header: 'baseDn',
      },
      {
        field: 'userDn',
        header: 'userDn',
      },
      {
        field: 'activeDirectory',
        header: 'ActiveDirectory',
        cellTemplate: this.booleanTemp,
      },
      {
        header: this.tr.instant('Tls'),
        field: 'tls',
        cellTemplate: this.booleanTemp,
      },
      {
        field: 'ignoreCert',
        header: this.tr.instant('share.ignore_certificate'),
        cellTemplate: this.booleanTemp,
      },
      {
        field: 'acceptCert',
        header: this.tr.instant('share.accept_certificate'),
        cellTemplate: this.booleanTemp,
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
            class: 'text-blue-50',
            click: row => this.store.openDialog(row),
          },
          {
            type: 'icon',
            icon: 'delete',
            class: 'text-red-50',
            click: row => this.store.deleteServer(row),
          },
        ],
      },
    ];
  }

  updateSearch(event: Event): void {
    this.store.setSearchTerm((event.target as HTMLInputElement).value);
  }

  add() {
    this.store.openDialog();
  }
}
