import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PasswordStore } from '../services/password-store.service';
import { PasswordListComponent } from './personal/list/password-list.component';
import { OrgPasswordListComponent } from './org/list/org-password-list.component';

@Component({
  selector: 'app-password-setting',
  templateUrl: './password-setting.component.html',
  providers: [PasswordStore],
  imports: [
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    TranslatePipe,
    MatTooltipModule,
    PasswordListComponent,
    OrgPasswordListComponent,
  ],
})
export class PasswordSettingComponent {
  store = inject(PasswordStore);

  constructor() {
    this.store.getPersonalPasswords();
    this.store.getOrgPasswords();
  }
}
