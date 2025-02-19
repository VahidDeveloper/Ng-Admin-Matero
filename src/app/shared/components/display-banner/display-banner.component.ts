import { inject, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BannerSetting } from '@shared/interfaces';
import { KeyWithCustomTemplate } from '@shared/models';

/**
 * a component to show a banner after the user has logged in.
 * Also, if the user has refreshed the page, this banner would be shown if the user has already logged in.
 */
@Component({
  selector: 'wina-display-banner',
  templateUrl: './display-banner.component.html',
})
export class DisplayBannerComponent implements OnInit {
  tr = inject(TranslateService);
  /** the banner config */
  @Input() bannerSetting: BannerSetting | undefined;
  /** keys which would be shown on the modal */
  _keys: KeyWithCustomTemplate[] = [];

  constructor() {}

  ngOnInit(): void {
    this._getTimeoutConfigIfRequired();
  }

  /**
   * if it is expected to show connectionTimeout or webTimeout, their information would be gotten from server
   */
  private _getTimeoutConfigIfRequired(): void {
    if (this.bannerSetting?.showWebTimeout) {
      this._keys.push({
        key: 'webTimeoutMinutes',
        keyToDisplay: this.tr.instant('WebTimeout'),
      });
    }
    if (
      this.bannerSetting?.showConnectionTimeout &&
      this.bannerSetting.sessionConfig.connectionTimeoutEnabled
    ) {
      this._keys.push({
        key: 'connectionTimeoutMinutes',
        keyToDisplay: this.tr.instant('ConnectionTimeout'),
      });
    }
    this._keys = this._keys.slice();
  }
}
