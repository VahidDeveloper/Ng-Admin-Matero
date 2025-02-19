import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringListComponent } from './monitoring-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ToastService } from '@mahsan/ng-components';
import { MonitoringService } from '../_services/monitoring.service';
import { MonitoringRefreshTokenService } from '../_services/monitoring-refresh-token.service';
import { MonitoringTokenService } from '../_services/monitoring-token.service';
import { MonitoringToken } from '../_models/monitoring-token';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

describe('MonitoringListComponent', () => {
  let component: MonitoringListComponent;
  let fixture: ComponentFixture<MonitoringListComponent>;
  const mockApi: string[] = ['/api/v1/monitoring', '/api/v1/monitoring/token'];
  const mockToken: MonitoringToken = {
    token: 'apihrjkknnllp',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitoringListComponent],
      imports: [HttpClientTestingModule, CorePipesModule],
      providers: [
        {
          provide: MonitoringService,
          useValue: {
            getAll: jest.fn(() => of(mockApi)),
          },
        },
        {
          provide: MonitoringTokenService,
          useValue: {
            getData: jest.fn(() => of(mockToken)),
          },
        },
        {
          provide: MonitoringRefreshTokenService,
          useValue: {
            save: jest.fn(() => of(mockToken)),
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be test onInit', () => {
    jest.spyOn(component as any, '_getList');
    jest.spyOn(component as any, '_getToken');
    component.ngOnInit();
    expect((component as any)._getList).toHaveBeenCalled();
    expect((component as any)._getToken).toHaveBeenCalled();
  });

  it('should be test refreshToken', () => {
    jest.spyOn(component as any, '_getList');
    component.refreshToken();
    expect(component._currentToken).toEqual(mockToken.token);
    expect((component as any)._getList).toHaveBeenCalled();
  });

  it('should be test _getList', () => {
    (component as any)._getList();
    expect(component._isLoading).toBeFalsy();
  });

  it('should be test _getToken', () => {
    (component as any)._getToken();
    expect(component._currentToken).toEqual(mockToken.token);
    expect(component._isLoading).toBeFalsy();
  });

  it('should be test copyToClipboard', () => {
    Object.defineProperty((component as any)._navigator, 'clipboard', {
      value: {
        writeText: jest.fn(() => new Promise(null)),
      },
    });
    component.copyToClipboard(mockToken.token);
    expect((component as any)._navigator.clipboard.writeText).toHaveBeenCalledWith(mockToken.token);
  });
});
