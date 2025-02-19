import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatComponentsModule, ModalService } from '@mahsan/ng-components';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoginConstraint } from '@phoenix-front-apps/models';
import { LoginConstraintConfigService } from '@phoenix-front-apps/wina-services';
import { LoginConstraintComponent } from './login-constraint.component';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

describe('AppLoginConstraintComponent', () => {
  let component: LoginConstraintComponent;
  let fixture: ComponentFixture<LoginConstraintComponent>;
  let loginConstraintService: LoginConstraintConfigService;
  let modalService: ModalService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatComponentsModule, CorePipesModule],
      declarations: [LoginConstraintComponent],
      providers: [
        {
          provide: LoginConstraintConfigService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    loginConstraintService = TestBed.inject(LoginConstraintConfigService);
    modalService = TestBed.inject(ModalService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('in the ngOninit getConstraintList should called', () => {
    jest.spyOn(component, 'getConstraintList');
    component.ngOnInit();
    expect(component.getConstraintList).toHaveBeenCalled();
  });
  it('getConstraint from service should called when getConstraintList called ', () => {
    const sampleData: LoginConstraint = {
      captchaSessionThreshold: 100,
      captchaIpThreshold: 10,
      defaultOtpMedia: 'email' as any,
      lockMinutes: 10,
      lockThreshold: 5,
      minPassLength: 8,
      otpResendMax: 10,
      otpRetryMax: 10,
      otpValidTimeSeconds: 120,
      tokenRetryMax: 10,
    };
    loginConstraintService.getConstraint = jest.fn(() => of(sampleData));
    component.getConstraintList();
    expect(loginConstraintService.getConstraint).toHaveBeenCalled();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
