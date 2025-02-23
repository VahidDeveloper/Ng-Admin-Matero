import { Routes } from '@angular/router';
import { ClearStoragePolicyComponent } from './clear-storage-policy.component';

export const routes: Routes = [
  { path: '', component: ClearStoragePolicyComponent },
  {
    path: 'edit',
    loadComponent: () =>
      import('./edit/edit-clear-storage.component').then(m => m.EditClearStorageComponent),
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];
