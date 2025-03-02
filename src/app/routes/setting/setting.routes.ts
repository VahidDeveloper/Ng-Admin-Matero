import { Routes } from '@angular/router';
import { SettingComponent } from './setting.component';

export const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      {
        path: 'general',
        loadChildren: () => import('./general-setting/general-setting.routes').then(m => m.routes),
      },
      {
        path: 'login-policy',
        loadChildren: () =>
          import('./login-logout-policy/login-logout-policy.routes').then(m => m.routes),
      },
      {
        path: 'password',
        loadChildren: () => import('./password/password-setting.routes').then(m => m.routes),
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
        loadComponent: () =>
          import('./certificate/components/certificate.component').then(
            m => m.CertificateComponent
          ),
      },
      {
        path: 'monitoring',
        loadComponent: () =>
          import('./monitoring/components/monitoring.component').then(m => m.MonitoringComponent),
      },
    ],
  },
  { path: '', redirectTo: 'general', pathMatch: 'full' },
];
