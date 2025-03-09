import { Routes } from '@angular/router';

import { WinaSettingComponent } from './wina-setting.component';

export const routes: Routes = [
  {
    path: '',
    component: WinaSettingComponent,
    children: [
      {
        path: 'storage',
        loadComponent: () =>
          import('./clear-storage/clear-storage-policy.component').then(
            m => m.ClearStoragePolicyComponent
          ),
      },
      {
        path: 'video-conversion',
        loadComponent: () =>
          import('./video-conversion-time/video-conversion-time.component').then(
            m => m.VideoConversionTimeComponent
          ),
      },
      {
        path: 'email',
        loadComponent: () =>
          import('./email-setting/email-setting.component').then(m => m.EmailSettingComponent),
      },
      {
        path: 'ldap',
        loadComponent: () => import('./ldap/ldap.component').then(m => m.LdapComponent),
      },
      {
        path: 'sms',
        loadComponent: () =>
          import('./sms-setting/sms-setting.component').then(m => m.SmsSettingComponent),
      },
      {
        path: 'syslog',
        loadComponent: () => import('./syslog/syslog.component').then(m => m.SyslogComponent),
      },
      {
        path: 'license',
        loadComponent: () => import('./license/license.component').then(m => m.LicenseComponent),
      },
      {
        path: 'banner',
        loadComponent: () =>
          import('./banner/banner-setting.component').then(m => m.BannerComponent),
      },
      { path: '', redirectTo: 'storage', pathMatch: 'full' },
    ],
  },
];
