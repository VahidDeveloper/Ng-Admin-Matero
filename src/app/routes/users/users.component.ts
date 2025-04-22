import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BreadcrumbComponent } from '@shared/components';

@Component({
  selector: 'app-users',
  template: `
    <router-outlet><breadcrumb /></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, BreadcrumbComponent],
})
export class UsersComponent {
  constructor() {}
}
