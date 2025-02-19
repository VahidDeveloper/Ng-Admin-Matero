import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LockedUsersInConnectionSettingComponent } from './locked-users-in-connection-setting.component';
import { LockedUsersInConnectionSettingRoutingModule } from './locked-users-in-connection-setting-routing.module';

import { LibErrorHandlerModule } from '@wina/error-handler';
import { AppRouterModule } from '@phoenix-front-apps/ng-core';
import { LibCardModule, LibVerticalMenuModule } from '@mahsan/ng-components';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

@NgModule({
  declarations: [LockedUsersInConnectionSettingComponent],
  imports: [
    CommonModule,
    LockedUsersInConnectionSettingRoutingModule,
    LibVerticalMenuModule,
    LibErrorHandlerModule,
    LibCardModule,
    AppRouterModule,
    CorePipesModule,
  ],
})
export class LockedUsersInConnectionSettingModule {}
