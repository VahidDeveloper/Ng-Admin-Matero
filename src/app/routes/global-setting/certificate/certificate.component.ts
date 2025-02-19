import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core/lib/translate.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateComponent implements OnInit {
  items: any[] = [
    {
      title: this._translatorService.instant('CA_CERTIFICATE_MENU'),
      icon: 'icon-Setting-00',
      click: () => {
        this._router.navigate(['remote-machine-ca'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('CA_CERTIFICATE_MENU_DESCRIPTION'),
    },
    {
      title: this._translatorService.instant('TLS_MENU'),
      icon: 'icon-Setting-00',
      click: () => {
        this._router.navigate(['self-signed'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('TLS_MENU_DESCRIPTION'),
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
      case 'remote-machine-ca':
        this.items[0].active = true;
        break;
      case 'self-signed':
        this.items[1].active = true;
        break;
      case 'csr-certificate':
        this.items[2].active = true;
        break;
      case 'pfx-certificate':
        this.items[3].active = true;
        break;
    }
  }
}
