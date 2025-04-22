import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';

export const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'management',
        loadComponent: () =>
          import('./management/components/list/user-list.component').then(m => m.UserListComponent),
      },
    ],
  },
  { path: '', redirectTo: 'general', pathMatch: 'full' },
];
