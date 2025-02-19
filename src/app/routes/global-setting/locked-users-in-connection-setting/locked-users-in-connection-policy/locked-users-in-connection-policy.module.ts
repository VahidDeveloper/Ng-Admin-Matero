import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import {
  LibButtonModule,
  LibCardModule,
  LibFormsModule,
  LibLoadingModule,
  LibSwitchModule,
  LibUtilsModule,
} from '@mahsan/ng-components';
import { LibErrorHandlerModule } from '@wina/error-handler';
import { LockedUsersInConnectionPolicyComponent } from './locked-users-in-connection-policy.component';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

@NgModule({
  declarations: [LockedUsersInConnectionPolicyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: LockedUsersInConnectionPolicyComponent }]),
    LibCardModule,
    LibErrorHandlerModule,
    LibFormsModule,
    LibSwitchModule,
    ReactiveFormsModule,
    LibLoadingModule,
    LibButtonModule,
    CorePipesModule,
    LibUtilsModule,
  ],
})
export class LockedUsersInConnectionPolicyModule {}
