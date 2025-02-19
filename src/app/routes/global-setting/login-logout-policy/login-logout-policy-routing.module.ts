import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginLogoutPolicyComponent } from './login-logout-policy.component';

const routes: Routes = [
  {
    path: '',
    component: LoginLogoutPolicyComponent,
    children: [
      {
        path: 'login-constraint',
        loadChildren: () =>
          import('./login-constraint/login-constraint.module').then(m => m.LoginConstraintModule),
      },
      {
        path: 'session-timeout',
        loadChildren: () =>
          import('./session-timeout-policy/session-timeout-policy.module').then(
            m => m.SessionTimeoutPolicyModule
          ),
      },
      {
        path: '',
        redirectTo: 'login-constraint',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
})
export class LoginLogoutPolicyRoutingModule {}
