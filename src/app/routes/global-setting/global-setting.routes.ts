import { GlobalSettingComponent } from './global-setting.component';
import { Routes } from '@angular/router';
import { UserRole } from '@shared/enums';

export const routes: Routes = [
  {
    path: '',
    component: GlobalSettingComponent,
    children: [
      {
        data: { permission: [UserRole.RemoteAdmin] },
        path: 'agents',
        loadChildren: () =>
          import('./agent-management/agent-management.routes').then(m => m.routes),
      },
      {
        data: { permission: [UserRole.RemoteAdmin] },
        path: 'locked-users',
        loadChildren: () =>
          import(
            './locked-users-in-connection-setting/locked-users-in-connection-setting.module'
          ).then(m => m.LockedUsersInConnectionSettingModule),
      },
      {
        data: { permission: [UserRole.RemoteAdmin] },
        path: 'certificate',
        loadChildren: () => import('./certificate/certificate.routes').then(m => m.certRoutes),
      },
      {
        data: { permission: [UserRole.RemoteAdmin] },
        path: 'command',
        loadChildren: () =>
          import('./command-setting/command-list/command-list.component').then(
            m => m.CommandListComponent
          ),
      },
      {
        data: { permission: [UserRole.RemoteAdmin] },
        path: 'login-policy',
        loadChildren: () =>
          import('./login-logout-policy/login-logout-policy.module').then(
            m => m.LoginLogoutPolicyModule
          ),
      },
      {
        path: 'password',
        loadChildren: () =>
          import('./password-setting/password-setting.routes').then(m => m.routes),
      },
      {
        data: { permission: [UserRole.RemoteAdmin] },
        path: 'monitoring',
        loadChildren: () =>
          import('./monitoring/components/monitoring-list.component').then(
            m => m.MonitoringListComponent
          ),
      },
    ],
  },
  { path: '', redirectTo: 'wina-general', pathMatch: 'full' },
];
