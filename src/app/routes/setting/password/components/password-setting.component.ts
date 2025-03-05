import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CaCertificateComponent } from '../../certificate/components/ca/ca-certificate.component';
import { SelfSignedCertificateComponent } from '../../certificate/components/self-signed/self-signed-certificate.component';
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
export class PasswordSettingComponent implements OnInit {
  store = inject(PasswordStore);
  constructor() {}

  ngOnInit(): void {
    this.store.getPersonalPasswords();
    this.store.getOrgPasswords();
  }

  /** it set active to current route */
}
