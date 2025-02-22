import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WinaRestUrls } from '@phoenix-front-apps/models';
import { MonitoringTokenService } from './monitoring-token.service';

describe('MonitoringTokenService', () => {
  let service: MonitoringTokenService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MonitoringTokenService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test get monitoring token', () => {
    const gottenValues = [];
    service.getData().subscribe(
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
    const response = '';
    const req = httpTestingController.expectOne(WinaRestUrls.monitoringToken());
    expect(req.request.method).toEqual('GET');
    req.flush(response);
    expect(gottenValues).toEqual([response, 'complete']);
    httpTestingController.verify();
  });
});
