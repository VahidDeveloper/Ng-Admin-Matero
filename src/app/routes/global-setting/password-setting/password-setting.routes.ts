import { Routes } from '@angular/router';
import { PasswordSettingComponent } from './password-setting.component';
import { PasswordListComponent } from './password-list/password-list.component';
import { OrganizationalPasswordListComponent } from './organizational-password-list/organizational-password-list.component';
import { UserRole } from '@shared';

export const routes: Routes = [
  {
    path: '',
    component: PasswordSettingComponent,
    children: [
      { path: 'my-pass', component: PasswordListComponent },

      {
        path: 'connections-pass',
        component: PasswordListComponent,
        data: { permission: [UserRole.RemoteAdmin] },
      },
      {
        path: 'organizational-pass',
        component: OrganizationalPasswordListComponent,
        data: { permission: [UserRole.RemoteAdmin] },
      },
      {
        path: '',
        redirectTo: 'my-pass',
        pathMatch: 'full',
      },
    ],
  },
];
