import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LockPolicy } from '../_models/lock-policy';
import { ToastService } from '@mahsan/ng-components';
import { LockedUsersInConnectionService } from '../_services/locked-users-in-connection.service';
import { LockedUsersInConnectionPolicyComponent } from './locked-users-in-connection-policy.component';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

describe('LockedUsersInConnectionPolicyComponent', () => {
  let component: LockedUsersInConnectionPolicyComponent;
  let fixture: ComponentFixture<LockedUsersInConnectionPolicyComponent>;
  let lockedUserService: LockedUsersInConnectionService;
  let toastService: ToastService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LockedUsersInConnectionPolicyComponent],
      imports: [HttpClientTestingModule, CorePipesModule],
      providers: [
        FormBuilder,
        {
          provide: LockedUsersInConnectionService,
          useValue: {
            setLockPolicy: jest.fn(() => of()),
            getDefaultLockPolicy: jest.fn(() => of()),
          },
        },
        {
          provide: ToastService,
          useValue: {
            showSuccessToast: jest.fn(() => of(true)),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    lockedUserService = TestBed.inject(LockedUsersInConnectionService);
    toastService = TestBed.inject(ToastService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedUsersInConnectionPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be test onInit', () => {
    jest.spyOn(component as any, '_getDefaultBlockPolicy');
    component.ngOnInit();
    expect((component as any)._getDefaultBlockPolicy).toHaveBeenCalled();
  });

  it('should be call _getDefaultBlockPolicy', fakeAsync(() => {
    const blockPolicy: LockPolicy = {
      active: true,
      resetTimeMinutes: 1,
      maxFailedAttempts: 2,
      lockTimeMinutes: 10,
    };
    jest.spyOn(lockedUserService, 'getDefaultLockPolicy').mockReturnValue(of(blockPolicy));
    (component as any)._getDefaultBlockPolicy();
    tick();
    expect(component._fetchLoading).toEqual(false);
    expect(component._form.value).toEqual(blockPolicy);
  }));

  it('should be call submit', fakeAsync(() => {
    const blockPolicy: LockPolicy = {
      active: true,
      resetTimeMinutes: 1,
      maxFailedAttempts: 2,
      lockTimeMinutes: 10,
    };
    component._form.setValue(blockPolicy);
    jest.spyOn(lockedUserService, 'setLockPolicy').mockReturnValue(of(blockPolicy));
    component.submit();
    tick();
    expect(component._form.valid).toBeTruthy();
    expect(component._isLoading).toEqual(false);
    expect(toastService.showSuccessToast).toHaveBeenCalled();
  }));

  it('should be test submit not valid form', fakeAsync(() => {
    const blockPolicy: LockPolicy = {
      active: true,
      resetTimeMinutes: null,
      maxFailedAttempts: null,
      lockTimeMinutes: null,
    };
    component._form.setValue(blockPolicy);
    jest.spyOn(lockedUserService, 'setLockPolicy').mockReturnValue(of(blockPolicy));
    component.submit();
    tick();
    expect(component._isLoading).toEqual(false);
    expect(component._form.valid).toBeFalsy();
    expect(toastService.showSuccessToast).not.toHaveBeenCalled();
  }));
});
