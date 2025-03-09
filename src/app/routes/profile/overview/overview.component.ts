import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

import { PasswordListComponent } from '../password/components/list/password-list.component';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  imports: [MatCardModule, MatTabsModule, PasswordListComponent],
})
export class ProfileOverviewComponent {}
