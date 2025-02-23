import { Routes } from '@angular/router';

import { WinaGeneralSettingComponent } from './general-setting.component';

export const routes: Routes = [
  {
    path: '',
    component: WinaGeneralSettingComponent,
    children: [
      {
        path: 'clear-storage',
        loadChildren: () => import('./clear-storage/clear-storage.routes').then(m => m.routes),
      },
      {
        path: 'vide-conversion-time',
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
        loadChildren: () => import('./ldap/ldap.routes').then(m => m.routes),
      },
      {
        path: 'sms',
        loadChildren: () =>
          import('./sms-setting/sms-setting.component').then(m => m.SmsSettingComponent),
      },
      {
        path: 'syslog',
        loadChildren: () => import('./syslog/syslog.routes').then(m => m.routes),
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
      { path: '', redirectTo: 'clear-storage', pathMatch: 'full' },
    ],
  },
];
