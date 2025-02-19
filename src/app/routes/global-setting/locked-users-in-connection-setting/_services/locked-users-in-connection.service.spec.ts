import { TestBed } from '@angular/core/testing';

import { LockedUser } from '../_models/locked-user';
import { LockPolicy } from '../_models/lock-policy';
import { WinaRestUrls } from '@phoenix-front-apps/models';
import { LockedUsersInConnectionService } from './locked-users-in-connection.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('BlockedUsersService', () => {
  let service: LockedUsersInConnectionService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LockedUsersInConnectionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get blocked user list method', () => {
    const gottenValue = [];
    const response = new LockedUser();
    response.hostId = 10;
    response.displayName = 'test';
    response.hostName = null;
    response.connectionId = '10';
    response.os = 'windows';
    service.getAll().subscribe(
      data => {
        gottenValue.push(data);
      },
      () => {
        gottenValue.push('error');
      },
      () => {
        gottenValue.push('complete');
      }
    );
    const req = httpTestingController.expectOne(WinaRestUrls.connectionLock());
    expect(req.request.method).toEqual('GET');
    req.flush(response);
    expect(gottenValue).toEqual([response, 'complete']);
    httpTestingController.verify();
  });

  it('should test unblock user', () => {
    const gottenValue = [];
    const response: Partial<LockedUser> = {
      connectionId: '10',
      username: 'a',
      connectionName: 'test',
    };
    service.unLockConnection(response).subscribe(
      data => {
        gottenValue.push(data);
      },
      () => {
        gottenValue.push('error');
      },
      () => {
        gottenValue.push('complete');
      }
    );
    const req = httpTestingController.expectOne(WinaRestUrls.unLockConnection());
    expect(req.request.method).toEqual('POST');
    req.flush(response);
    expect(gottenValue).toEqual([response, 'complete']);
    httpTestingController.verify();
  });

  it('should test set block policy config', () => {
    const gottenValue = [];
    const response: LockPolicy = {
      lockTimeMinutes: 10,
      maxFailedAttempts: 2,
      resetTimeMinutes: 3,
      active: true,
    };
    service.setLockPolicy(response).subscribe(
      data => {
        gottenValue.push(data);
      },
      () => {
        gottenValue.push('error');
      },
      () => {
        gottenValue.push('complete');
      }
    );
    const req = httpTestingController.expectOne(WinaRestUrls.connectionLockPolicy());
    expect(req.request.method).toEqual('PUT');
    req.flush(response);
    expect(gottenValue).toEqual([response, 'complete']);
    httpTestingController.verify();
  });
});
