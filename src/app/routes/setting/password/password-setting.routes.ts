import { Routes } from '@angular/router';
import { PasswordSettingComponent } from './password-setting.component';
import { PasswordListComponent } from './list/password-list.component';
import { OrganizationalPasswordListComponent } from './organizational-list/organizational-password-list.component';
import { UserRole } from '@shared';

export const routes: Routes = [
  {
    path: '',
    component: PasswordSettingComponent,
    children: [
      { path: 'personal', component: PasswordListComponent },

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
        redirectTo: 'personal',
        pathMatch: 'full',
      },
    ],
  },
];
