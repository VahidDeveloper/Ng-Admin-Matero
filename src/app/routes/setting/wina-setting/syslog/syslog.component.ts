import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BreadcrumbComponent } from '@shared/components';

@Component({
  selector: 'app-syslog',
  template: `
    <breadcrumb />
    <router-outlet />
  `,
  imports: [RouterModule, BreadcrumbComponent],
})
export class SyslogComponent {
  constructor() {}
}
