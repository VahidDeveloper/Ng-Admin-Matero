import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { AccountLockStore } from '../_services/account-lock-store.service';
import { AccountLockListComponent } from './list/account-lock-list.component';
import { AccountLockPolicyComponent } from './policy/account-lock-policy.component';

@Component({
  selector: 'app-account-locked',
  templateUrl: './account-lock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AccountLockStore],
  imports: [
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    TranslatePipe,
    MatTooltipModule,
    AccountLockPolicyComponent,
    AccountLockListComponent,
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
export class AccountLockComponent implements OnInit {
  store = inject(AccountLockStore);

  constructor() {}

  ngOnInit(): void {
    this.store.getList();
    this.store.getPolicy();
  }
}
