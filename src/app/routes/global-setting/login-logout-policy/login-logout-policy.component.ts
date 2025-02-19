import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { VerticalMenuModel } from '@mahsan/ng-components';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb, BreadcrumbItem } from '@phoenix-front-apps/ng-core';
import { TranslateService } from '@phoenix-front-apps/ng-core';
@Component({
  selector: 'app-login-logout-policy',
  templateUrl: './login-logout-policy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginLogoutPolicyComponent implements OnInit {
  @Breadcrumb() breadcrumb: BreadcrumbItem = {
    text: this._translatorService.instant('LOGIN_LOGOUT_MENU'),
  };
  items: VerticalMenuModel[] = [
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
    const path = this._router.routerState.snapshot.url.split('/').pop();
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
