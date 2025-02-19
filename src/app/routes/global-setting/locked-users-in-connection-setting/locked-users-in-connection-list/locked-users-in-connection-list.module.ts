import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LibErrorHandlerModule } from '@wina/error-handler';
import { MaterialDatatableModule, LibCardModule, LibDatatableModule } from '@mahsan/ng-components';
import { LockedUsersInConnectionListComponent } from './locked-users-in-connection-list.component';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

@NgModule({
  declarations: [LockedUsersInConnectionListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: LockedUsersInConnectionListComponent }]),
    LibErrorHandlerModule,
    LibDatatableModule,
    LibCardModule,
    CorePipesModule,
    MaterialDatatableModule,
  ],
})
export class LockedUsersInConnectionListModule {}
