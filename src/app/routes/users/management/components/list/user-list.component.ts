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

import { UserEntity } from '../../types/user';
import { MatTooltip } from '@angular/material/tooltip';
import { UserStore } from '../../services/store.service';

@Component({
  templateUrl: './user-list.component.html',
  providers: [UserStore],
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
    MatIcon,
    MatTooltip,
  ],
})
export class UserListComponent implements OnInit, AfterViewInit {
  store = inject(UserStore);
  tr = inject(TranslateService);

  filteredRow$ = this.store.filteredList$;
  count$: Observable<number> = of(0);
  searchTerm$: Observable<string> = of('');
  fetchLoading$: Observable<boolean> = of(false);

  @ViewChild('remoteAdmin', { static: false }) private remoteAdmin: TemplateRef<any> | null = null;
  @ViewChild('lockState', { static: false }) private lockState: TemplateRef<any> | null = null;
  @ViewChild('otpState', { static: false }) private otpState: TemplateRef<any> | null = null;

  columns: MtxGridColumn<UserEntity>[] = [];
  translation: any = {
    userType: {
      admin: this.tr.instant('share.admin'),
      regularUser: this.tr.instant('share.regular_user'),
    },
    otpState: {
      ACTIVE: this.tr.instant('pages.users.activated_by_user'),
      MANDATORY: this.tr.instant('pages.users.activated_by_admin'),
    },
    lockState: {
      LOCK: this.tr.instant('pages.users.locked'),
      LOCKED_BY_ADMIN: this.tr.instant('pages.users.locked_by_admin'),
    },
  };
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
        field: 'username',
        header: this.tr.instant('username'),
      },
      {
        field: 'displayName',
        header: this.tr.instant('pages.users.display_name'),
      },
      {
        field: 'email',
        header: this.tr.instant('email'),
      },
      {
        field: 'remoteAdmin',
        header: this.tr.instant('pages.users.remote_admin'),
        cellTemplate: this.remoteAdmin,
      },
      {
        field: 'otpState',
        header: this.tr.instant('pages.users.otp_state'),
        cellTemplate: this.otpState,
      },
      {
        field: 'lockState',
        header: this.tr.instant('pages.users.lock_state'),
        cellTemplate: this.lockState,
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
