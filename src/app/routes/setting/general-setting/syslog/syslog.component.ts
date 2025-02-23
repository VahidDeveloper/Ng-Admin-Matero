import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@shared';

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
