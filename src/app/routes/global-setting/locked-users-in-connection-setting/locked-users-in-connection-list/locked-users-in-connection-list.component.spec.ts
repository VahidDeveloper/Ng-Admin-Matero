import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LockedUser } from '../_models/locked-user';
import { MatComponentsModule, ToastService } from '@mahsan/ng-components';
import { LockedUsersInConnectionListComponent } from './locked-users-in-connection-list.component';
import { LockedUsersInConnectionService } from '../_services/locked-users-in-connection.service';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

describe('LockedUsersInConnectionListComponent', () => {
  let component: LockedUsersInConnectionListComponent;
  let fixture: ComponentFixture<LockedUsersInConnectionListComponent>;
  let blockedUserService: LockedUsersInConnectionService;
  let toastService: ToastService;
  const blockedUsers: LockedUser = {
    os: 'windows',
    connectionId: '10',
    ldapServer: 'wina.local',
    protocol: '',
    remoteAdmin: true,
    hostName: 'test',
    displayName: 'a',
    hostId: 10,
    connectionName: 'test',
    username: 'a',
    ipAddress: '192.168.10.63',
  };
  const serverResponseStub: LockedUser[] = [blockedUsers];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LockedUsersInConnectionListComponent],
      imports: [HttpClientTestingModule, MatComponentsModule, CorePipesModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: LockedUsersInConnectionService,
          useValue: {
            getAll: jest.fn(() => of(serverResponseStub)),
            unLockConnection: jest.fn(() => of()),
          },
        },
        {
          provide: ToastService,
          useValue: {
            showSuccessToast: jest.fn(() => of(true)),
          },
        },
      ],
    }).compileComponents();
    blockedUserService = TestBed.inject(LockedUsersInConnectionService);
    toastService = TestBed.inject(ToastService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedUsersInConnectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be test onInit', () => {
    jest.spyOn(component as any, '_getBlockedUser');
    component.ngOnInit();
    expect((component as any)._getBlockedUser).toHaveBeenCalled();
  });

  it('should be call get Blocked users', fakeAsync(() => {
    (component as any)._getBlockedUser();
    tick();
    expect(component.rows).toEqual(serverResponseStub);
    expect(component._isLoading).toEqual(false);
  }));

  it('should test reloadList', () => {
    jest.spyOn(component as any, '_getBlockedUser');
    component.reloadList();
    expect((component as any)._getBlockedUser).toHaveBeenCalled();
  });

  it('should be call unBlockUser', fakeAsync(() => {
    const user: Partial<LockedUser> = {
      connectionId: '10',
      username: 'a',
      connectionName: 'test',
    };
    jest.spyOn(blockedUserService, 'unLockConnection').mockReturnValue(of(user));
    (component as any)._unBlockUser(user);
    tick();
    expect(component._isLoading).toEqual(false);
    expect(toastService.showSuccessToast).toHaveBeenCalled();
  }));
});
