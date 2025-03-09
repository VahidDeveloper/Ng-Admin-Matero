import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoConversionTime } from '../_models/video-conversion-time';
import { WinaRestUrls } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class VideoConversionTimeService {
  constructor(private _http: HttpClient) {}

  setEncoderConfig(videoConversionTimeSetting: VideoConversionTime): Observable<boolean> {
    return this._http.put<boolean>(WinaRestUrls.setEncoderConfig(), videoConversionTimeSetting);
  }

  getEncoderConfig(): Observable<boolean> {
    return this._http.get<boolean>(WinaRestUrls.getEncoderConfig());
  }
}
