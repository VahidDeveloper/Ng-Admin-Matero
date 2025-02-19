import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  LibButtonModule,
  LibCardModule,
  LibFormsModule,
  LibKeyValueListModule,
  LibLoadingModule,
  LibModalModule,
  LibTextBoxModule,
  LibUtilsModule,
  LibVerticalMenuModule,
} from '@mahsan/ng-components';
import { RouterModule } from '@angular/router';
import { LibErrorHandlerModule } from '@wina/error-handler';

import { LoginLogoutPolicyComponent } from './login-logout-policy.component';
import { LoginLogoutPolicyRoutingModule } from './login-logout-policy-routing.module';
import { AppRouterModule } from '@phoenix-front-apps/ng-core';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

@NgModule({
  declarations: [LoginLogoutPolicyComponent],
  imports: [
    CommonModule,
    LoginLogoutPolicyRoutingModule,
    ReactiveFormsModule,
    LibCardModule,
    LibFormsModule,
    LibErrorHandlerModule,
    LibKeyValueListModule,
    LibTextBoxModule,
    LibButtonModule,
    LibLoadingModule,
    LibModalModule,
    LibVerticalMenuModule,
    RouterModule,
    AppRouterModule,
    CorePipesModule,
    LibUtilsModule,
  ],
})
export class LoginLogoutPolicyModule {}
