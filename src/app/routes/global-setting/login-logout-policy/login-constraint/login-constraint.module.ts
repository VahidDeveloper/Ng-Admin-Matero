import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
} from '@mahsan/ng-components';
import { LibErrorHandlerModule } from '@wina/error-handler';

import { LoginConstraintComponent } from './login-constraint.component';
import { LoginConstraintEditComponent } from './login-constraint-edit/login-constraint-edit.component';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

@NgModule({
  declarations: [LoginConstraintComponent, LoginConstraintEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: LoginConstraintComponent }]),
    LibErrorHandlerModule,
    LibCardModule,
    LibLoadingModule,
    LibKeyValueListModule,
    LibModalModule,
    LibFormsModule,
    ReactiveFormsModule,
    LibButtonModule,
    LibTextBoxModule,
    CorePipesModule,
    LibUtilsModule,
  ],
})
export class LoginConstraintModule {}
