import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LibButtonModule, LibFormsModule, LibTextBoxModule } from '@mahsan/ng-components';
import { LibErrorHandlerModule } from '@wina/error-handler';
import { ResetUserPasswordComponent } from './reset-user-password.component';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

@NgModule({
  declarations: [ResetUserPasswordComponent],
  exports: [ResetUserPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibErrorHandlerModule,
    LibButtonModule,
    LibTextBoxModule,
    LibFormsModule,
    CorePipesModule,
  ],
})
export class ResetUserPasswordModule {}
