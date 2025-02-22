import { TestBed } from '@angular/core/testing';

import { MonitoringService } from './monitoring.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WinaRestUrls } from '@phoenix-front-apps/models';

describe('MonitoringService', () => {
  let service: MonitoringService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MonitoringService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test get monitoring api list', () => {
    const gottenValues = [];
    service.getAll().subscribe(
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
    const response = [];
    const req = httpTestingController.expectOne(WinaRestUrls.monitoring());
    expect(req.request.method).toEqual('GET');
    req.flush(response);
    expect(gottenValues).toEqual([response, 'complete']);
    httpTestingController.verify();
  });
});
