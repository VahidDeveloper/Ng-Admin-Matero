import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SessionTimeoutPolicyComponent } from './session-timeout-policy.component';
import {
  LibButtonModule,
  LibCardModule,
  LibCheckboxModule,
  LibFormsModule,
  LibLoadingModule,
  LibTextBoxModule,
  LibUtilsModule,
} from '@mahsan/ng-components';
import { ReactiveFormsModule } from '@angular/forms';
import { LibErrorHandlerModule } from '@wina/error-handler';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

@NgModule({
  declarations: [SessionTimeoutPolicyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: SessionTimeoutPolicyComponent }]),
    ReactiveFormsModule,
    LibErrorHandlerModule,
    LibCardModule,
    LibFormsModule,
    LibTextBoxModule,
    LibButtonModule,
    LibLoadingModule,
    LibUtilsModule,
    LibCheckboxModule,
    CorePipesModule,
  ],
})
export class SessionTimeoutPolicyModule {}
