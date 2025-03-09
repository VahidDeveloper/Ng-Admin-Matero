import { Routes } from '@angular/router';
import { SettingComponent } from './setting.component';

export const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      {
        path: 'login-policy',
        loadComponent: () =>
          import('./session-policy/components/session-policy.component').then(
            m => m.SessionPolicyComponent
          ),
      },
      {
        path: 'password',
        loadComponent: () =>
          import('./password-vault/components/list/vault-list.component').then(
            m => m.VaultListComponent
          ),
      },
      {
        path: 'command',
        loadComponent: () =>
          import('./command/components/list/command-list.component').then(
            m => m.CommandListComponent
          ),
      },
      {
        path: 'account-lock',
        loadComponent: () =>
          import('./account-lock/components/account-lock.component').then(
            m => m.AccountLockComponent
          ),
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
