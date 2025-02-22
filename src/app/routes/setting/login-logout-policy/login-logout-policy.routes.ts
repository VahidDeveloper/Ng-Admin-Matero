import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginLogoutPolicyComponent } from './login-logout-policy.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginLogoutPolicyComponent,
    children: [
      {
        path: 'login-constraint',
        loadComponent: () =>
          import('./login-constraint/login-constraint.component').then(
            m => m.LoginConstraintComponent
          ),
      },
      {
        path: 'session-timeout',
        loadComponent: () =>
          import('./session-timeout-policy/session-timeout-policy.component').then(
            m => m.SessionTimeoutPolicyComponent
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
