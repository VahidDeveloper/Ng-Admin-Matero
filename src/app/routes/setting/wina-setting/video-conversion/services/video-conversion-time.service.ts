import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericCrudService } from '@shared';
import { VideoConversionTime } from '../types/video-conversion-time';

@Injectable({
  providedIn: 'root',
})
export class VideoConversionTimeService extends GenericCrudService<VideoConversionTime> {
  constructor(protected http: HttpClient) {
    super(http, '/api/v1/encoder-config');
  }
}
