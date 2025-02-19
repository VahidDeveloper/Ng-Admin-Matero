import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteMachinesSelectorComponent } from './remote-machines-selector.component';
import { LibGridListModule, LibLoadingModule, LibUtilsModule } from '@mahsan/ng-components';
import { FilterRemoteMachinesModule } from '../filter-remote-machines/filter-remote-machines.module';

/**
 * module to enable selecting remote-machines.
 * note that it is a temporary module and should be removed or moved.
 * in fact, there is an issue which would modularize remote module;
 * after that issue is merged, this module should be changed too.
 */
@NgModule({
  declarations: [RemoteMachinesSelectorComponent],
  exports: [RemoteMachinesSelectorComponent],
  imports: [
    CommonModule,
    LibGridListModule,
    LibUtilsModule,
    LibLoadingModule,
    FilterRemoteMachinesModule,
  ],
})
export class RemoteMachinesSelectorModule {}
