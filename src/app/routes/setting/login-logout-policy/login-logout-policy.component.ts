import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-logout-policy',
  templateUrl: './login-logout-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
})
export class LoginLogoutPolicyComponent implements OnInit {
  items: any[] = [
    {
      title: this._translatorService.instant('LOGIN_CONSTRAINT_MENU'),
      icon: 'icon-Sign-in-00',
      click: () => {
        this._router.navigate(['login-constraint'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('LOGIN_CONSTRAINT_MENU_description'),
    },
    {
      title: this._translatorService.instant('SESSION_TIMEOUT_MENU'),
      icon: 'icon-User-12',
      click: () => {
        this._router.navigate(['session-timeout'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('SESSION_TIMEOUT_MENU_description'),
    },
  ];

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    const path = this._router.routerState.snapshot.url.split('/').pop()!;
    this.activeCurrentMenu(path);
  }

  /** it set active to current route */
  activeCurrentMenu(path: string): void {
    switch (path) {
      case 'login-constraint':
        this.items[0].active = true;
        break;
      case 'session-timeout':
        this.items[1].active = true;
        break;
    }
  }
}
