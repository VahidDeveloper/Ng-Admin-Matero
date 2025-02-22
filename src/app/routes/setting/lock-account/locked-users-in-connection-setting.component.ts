import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-locked-users-in-connection-setting',
  templateUrl: './locked-users-in-connection-setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
})
export class LockedUsersInConnectionSettingComponent implements OnInit {
  items: any[] = [
    {
      title: this._translatorService.instant('ACCOUNT_LOCK_IN_CONNECTION_MENU'),
      icon: 'icon-Setting-00',
      click: () => {
        this._router.navigate(['block-policy'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('ACCOUNT_LOCK_IN_CONNECTION_MENU_help'),
    },
    {
      title: this._translatorService.instant('LOCKED_USER_IN_CONNECTION_MENU'),
      icon: 'icon-Menu-05',
      click: () => {
        this._router.navigate(['list'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('LOCKED_USER_IN_CONNECTION_MENU_help'),
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
      case 'block-policy':
        this.items[0].active = true;
        break;
      case 'list':
        this.items[1].active = true;
        break;
    }
  }
}
