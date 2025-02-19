import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LockedUsersInConnectionSettingComponent } from './locked-users-in-connection-setting.component';

const routes: Routes = [
  {
    path: '',
    component: LockedUsersInConnectionSettingComponent,
    children: [
      {
        path: 'list',
        loadChildren: () =>
          import('./locked-users-in-connection-list/locked-users-in-connection-list.module').then(
            m => m.LockedUsersInConnectionListModule
          ),
      },
      {
        path: 'block-policy',
        loadChildren: () =>
          import(
            './locked-users-in-connection-policy/locked-users-in-connection-policy.module'
          ).then(m => m.LockedUsersInConnectionPolicyModule),
      },
      {
        path: '',
        redirectTo: 'block-policy',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LockedUsersInConnectionSettingRoutingModule {}
