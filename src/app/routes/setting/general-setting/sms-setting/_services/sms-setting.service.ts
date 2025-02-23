import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WinaRestUrls } from '@shared/models';
import { SmsSetting } from '../_models/sms-setting';

/** a service class for test sms */
@Injectable({
  providedIn: 'root',
})
export class SmsSettingService {
  constructor(private _http: HttpClient) {}

  /**
   * it post phone number to api to send test sms to user
   */
  smsTest(smsSetting: SmsSetting): Observable<boolean> {
    return this._http.post<boolean>(WinaRestUrls.testSms(), smsSetting);
  }
}
