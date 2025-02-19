import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password-setting',
  template: `
    <router-outlet />
  `,
  imports: [RouterModule],
})
export class PasswordSettingComponent implements OnInit {
  items: any[] = [
    {
      title: this._translatorService.instant('CONNECTION_PASSWORD'),
      icon: 'icon-Key-00',
      click: () => {
        this._router.navigate(['connections-pass'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('CONNECTION_PASSWORD_DESCRIPTION'),
    },
    {
      title: this._translatorService.instant('MY_PASSWORDS'),
      icon: 'icon-Key-00',
      click: () => {
        this._router.navigate(['my-pass'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('MY_PASSWORDS_Description'),
    },
    {
      title: this._translatorService.instant('ORGANIZATIONAL_PASSWORD'),
      icon: 'icon-Key-00',
      click: () => {
        this._router.navigate(['organizational-pass'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('organizationalPasswordsDescription'),
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
      case 'connections-pass':
        this.items[0].active = true;
        break;
      case 'my-pass':
        this.items[1].active = true;
        break;
    }
  }
}
