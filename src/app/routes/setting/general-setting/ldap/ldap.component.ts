import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ldap',
  template: `
    <router-outlet />
  `,
  imports: [RouterModule],
})
export class LdapComponent {
  constructor(private _activatedRoute: ActivatedRoute) {}
}
