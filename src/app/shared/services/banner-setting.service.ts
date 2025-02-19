import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WinaRestUrls } from '@shared/models';
import { BannerSetting } from '@shared/interfaces';

/**
 * service to get or update banner-display config.
 */
@Injectable({
  providedIn: 'root',
})
export class BannerSettingService {
  constructor(private _http: HttpClient) {}

  /** get banner-display setting from server */
  getBannerSetting(): Observable<BannerSetting> {
    return this._http.get<BannerSetting>(WinaRestUrls.bannerDisplayConfig());
  }

  /** update banner-display server */
  updateBannerSetting(config: BannerSetting): Observable<boolean> {
    return this._http.post<boolean>(WinaRestUrls.bannerDisplayConfig(), config);
  }
}
