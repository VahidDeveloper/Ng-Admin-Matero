import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WinaRestUrls } from '@phoenix-front-apps/models';
import { MonitoringToken } from '../_models/monitoring-token';
import { MonitoringRefreshTokenService } from './monitoring-refresh-token.service';

describe('RefreshMonitoringTokenService', () => {
  let service: MonitoringRefreshTokenService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MonitoringRefreshTokenService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test refresh monitoring token', () => {
    const gottenValues = [];
    service.save(null).subscribe(
      data => {
        gottenValues.push(data);
      },
      () => {
        gottenValues.push('error');
      },
      () => {
        gottenValues.push('complete');
      }
    );
    const response = new MonitoringToken();
    const req = httpTestingController.expectOne(WinaRestUrls.monitoringRefreshToken());
    expect(req.request.method).toEqual('POST');
    req.flush(response);
    expect(gottenValues).toEqual([response, 'complete']);
    httpTestingController.verify();
  });
});
