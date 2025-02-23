import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
/** a component for set system global settings */
@Component({
  selector: 'app-general-setting',
  templateUrl: './general-setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
})
export class WinaGeneralSettingComponent implements OnInit {
  items: any[] = [
    {
      title: this._translatorService.instant('STORAGE_SETTING_MENU'),
      icon: 'icon-Big-data-00',
      click: () => {
        this._router.navigate(['clear-storage'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('STORAGE_SETTING_MENU_help'),
    },
    {
      title: this._translatorService.instant('VIDE0_CONVERSION_SETTING_MENU'),
      icon: 'icon-Setting-00',
      click: () => {
        this._router
          .navigate(['vide-conversion-time'], { relativeTo: this._activatedRoute })
          .then();
      },
      description: this._translatorService.instant('VIDE0_CONVERSION_SETTING_MENU_help'),
    },
    {
      title: this._translatorService.instant('EMAIL_SETTING_MENU'),
      icon: 'icon-Mail-00',
      click: () => {
        this._router.navigate(['email'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('EMAIL_SETTING_MENU_help'),
    },
    {
      title: this._translatorService.instant('SMS_SETTING_MENU'),
      icon: 'icon-Chat-01',
      click: () => {
        this._router.navigate(['sms'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('SMS_SETTING_MENU_help'),
    },
    {
      title: this._translatorService.instant('LDAP_SETTING_MENU'),
      icon: 'icon-Sign-out-00',
      click: () => {
        this._router.navigate(['ldap'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('LDAP_SETTING_MENU_help'),
    },
    {
      title: this._translatorService.instant('SYSLOG_SETTING_MENU'),
      icon: 'icon-File-01',
      click: () => {
        this._router.navigate(['syslog'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('SYSLOG_SETTING_MENU_help'),
    },
    {
      title: this._translatorService.instant('LICENSE_SETTING_MENU'),
      icon: 'icon-User-08',
      click: () => {
        this._router.navigate(['license'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('LICENSE_SETTING_MENU_help'),
    },
    {
      title: this._translatorService.instant('BANNER_SETTING_MENU'),
      icon: 'icon-User-11',
      click: () => {
        this._router.navigate(['banner'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('BANNER_SETTING_MENU_help'),
    },
  ];

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    const path = this._router.routerState.snapshot.url.split('/')[3];
    this.activeCurrentMenu(path);
  }

  /** it set active to current route */
  activeCurrentMenu(path: string): void {
    switch (path) {
      case 'clear-storage':
        this.items[0].active = true;
        break;
      case 'email':
        this.items[1].active = true;
        break;
      case 'sms':
        this.items[2].active = true;
        break;
      case 'ldap':
        this.items[3].active = true;
        break;
      case 'syslog':
        this.items[4].active = true;
        break;
      case 'license':
        this.items[5].active = true;
        break;
      case 'versions':
        this.items[6].active = true;
        break;
      case 'banner':
        this.items[7].active = true;
        break;
    }
  }
}
