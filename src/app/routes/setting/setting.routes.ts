import { SettingComponent } from './setting.component';
import { Routes } from '@angular/router';
import { UserRole } from '@shared/enums';

export const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      {
        path: 'general',
        loadChildren: () =>
          import('./agent-management/agent-management.routes').then(m => m.routes),
      },
      {
        path: 'login-policy',
        loadChildren: () =>
          import('./login-logout-policy/login-logout-policy.routes').then(m => m.routes),
      },
      {
        path: 'password',
        loadChildren: () =>
          import('./password-setting/password-setting.routes').then(m => m.routes),
      },
      {
        path: 'command',
        loadComponent: () =>
          import('./command-setting/command-list/command-list.component').then(
            m => m.CommandListComponent
          ),
      },
      {
        path: 'lock-account',
        loadChildren: () =>
          import('./lock-account/locked-users-in-connection-setting.routes').then(m => m.routes),
      },
      {
        path: 'certificate',
        loadChildren: () => import('./certificate/certificate.routes').then(m => m.certRoutes),
      },
      {
        path: 'monitoring',
        loadComponent: () =>
          import('./monitoring/components/monitoring-list.component').then(
            m => m.MonitoringListComponent
          ),
      },
    ],
  },
  { path: '', redirectTo: 'general', pathMatch: 'full' },
];
