import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTimeoutPolicyComponent } from './session-timeout-policy.component';

import {
  MatComponentsModule,
  LibButtonModule,
  LibCardModule,
  LibCheckboxModule,
  LibFormsModule,
  LibLoadingModule,
  LibUtilsModule,
} from '@mahsan/ng-components';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionTimeoutPolicy } from '@phoenix-front-apps/models';
import { SessionTimoutPolicyService } from '@phoenix-front-apps/wina-services';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

const serverResponseStub: SessionTimeoutPolicy = {
  connectionTimeoutEnabled: false,
  connectionTimeoutMinutes: 200,
  webTimeoutMinutes: 100,
};

describe('SessionTimeoutPolicyComponent', () => {
  let component: SessionTimeoutPolicyComponent;
  let fixture: ComponentFixture<SessionTimeoutPolicyComponent>;
  let service: SessionTimoutPolicyService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionTimeoutPolicyComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        LibCardModule,
        LibFormsModule,
        LibLoadingModule,
        LibButtonModule,
        LibCheckboxModule,
        LibUtilsModule,
        MatComponentsModule,
        CorePipesModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTimeoutPolicyComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SessionTimoutPolicyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call be onInit', () => {
    jest.spyOn(component as any, '_getSessionConfig');
    jest.spyOn(service, 'getSetting').mockReturnValue(of(serverResponseStub));
    component.ngOnInit();
    expect((component as any)._getSessionConfig).toHaveBeenCalled();
    expect(component._form.value).toEqual(serverResponseStub);
  });

  it('submit form case1: when form is invalid', () => {
    jest.spyOn(component._form, 'markAllAsTouched');
    component.saveChanges();
    expect(component._form.status).toEqual('INVALID');
    expect(component._form.markAllAsTouched).toHaveBeenCalled();
  });

  it('submit form case2: when form is valid and update setting', () => {
    jest.spyOn(component as any, '_updateSetting');
    component._form.patchValue(serverResponseStub);
    component.saveChanges();
    expect(component._form.status).toEqual('VALID');
    expect((component as any)._updateSetting).toHaveBeenCalled();
  });

  it('update session setting successfully', () => {
    jest.spyOn(service, 'updateSetting').mockReturnValue(of(true));
    jest.spyOn((component as any)._toastService, 'showSuccessToast');
    (component as any)._updateSetting();
    component.saveChanges();
    expect(component._updateLoading).toEqual(false);
    expect((component as any)._toastService.showSuccessToast).toHaveBeenCalled();
  });
});
