import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { SessionStore } from '../services/session-store.service';
import { LoginConstraintComponent } from './login-constraint/login-constraint.component';
import { SessionTimeoutPolicyComponent } from './session-timeout-policy/session-timeout-policy.component';

@Component({
  templateUrl: './session-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SessionStore],
  imports: [
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    TranslatePipe,
    MatTooltipModule,
    LoginConstraintComponent,
    SessionTimeoutPolicyComponent,
  ],
})
export class SessionPolicyComponent implements OnInit {
  store = inject(SessionStore);

  constructor() {}

  ngOnInit(): void {
    this.store.getLoginConfig();
    this.store.getSessionConfig();
  }
}
