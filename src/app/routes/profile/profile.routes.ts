import { Routes } from '@angular/router';

import { ProfileLayoutComponent } from './layout/layout.component';
import { ProfileOverviewComponent } from './overview/overview.component';
import { ProfileSettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
    children: [
      { path: '', component: ProfileOverviewComponent },
      { path: 'settings', component: ProfileSettingsComponent },
    ],
  },
];
