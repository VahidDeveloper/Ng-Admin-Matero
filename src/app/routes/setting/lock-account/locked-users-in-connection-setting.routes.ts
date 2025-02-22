import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LockedUsersInConnectionSettingComponent } from './locked-users-in-connection-setting.component';

export const routes: Routes = [
  {
    path: '',
    component: LockedUsersInConnectionSettingComponent,
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('./list/locked-users-in-connection-list.component').then(
            m => m.LockedUsersInConnectionListComponent
          ),
      },
      {
        path: 'policy',
        loadComponent: () =>
          import('./policy/locked-users-in-connection-policy.component').then(
            m => m.LockedUsersInConnectionPolicyComponent
          ),
      },
      {
        path: '',
        redirectTo: 'policy',
        pathMatch: 'full',
      },
    ],
  },
];
