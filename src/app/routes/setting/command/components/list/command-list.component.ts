import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MtxGrid, MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { CommandSettingModel } from '@shared';
import { CommandStore } from '../../services/command-store.service';

/**
 * this component is created for show list of commands
 */
@Component({
  templateUrl: './command-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CommandStore],
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatInput,
    MtxGrid,
    TranslatePipe,
    MatDialogModule,
    MatButtonModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
  ],
  styles: `
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
  `,
})
export class CommandListComponent implements OnInit {
  store = inject(CommandStore);
  tr = inject(TranslateService);
  readonly filteredRow$ = this.store.filteredRow$;
  count$: Observable<number> = of(0);
  searchTerm$: Observable<string> = of('');
  fetchLoading$: Observable<boolean> = of(false);
  columns: MtxGridColumn<CommandSettingModel>[] = [
    {
      field: 'id',
      header: this.tr.instant('id'),
      disabled: true,
    },
    {
      field: 'name',
      header: this.tr.instant('name'),
    },
    {
      field: 'description',
      header: this.tr.instant('description'),
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
          click: row => this.store.upsertCommand(row),
        },
        {
          type: 'icon',
          icon: 'delete',
          color: 'error' as any,
          click: row => this.store.deleteCommand(row.id),
        },
      ],
    },
  ];

  constructor() {
    this.searchTerm$ = this.store.select(state => state.searchTerm);
    this.fetchLoading$ = this.store.select(state => state.isLoading);
    this.count$ = this.store.select(state => state.count);
  }

  ngOnInit(): void {
    this.store.getList();
  }

  updateSearch(query: string): void {
    this.store.setSearchTerm(query);
  }

  add() {
    this.store.upsertCommand();
  }
}
