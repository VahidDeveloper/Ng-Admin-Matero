import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';

export const routes: Routes = [
  {
    path: 'management',
    component: UsersComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./management/components/list/user-list.component').then(m => m.UserListComponent),
      },
      {
        path: 'edit/:username',
        loadComponent: () =>
          import('./management/components/edit/edit-user.component').then(m => m.EditUserComponent),
      },
    ],
  },
];
