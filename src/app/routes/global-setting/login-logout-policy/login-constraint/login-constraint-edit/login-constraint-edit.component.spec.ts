import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LibButtonModule } from '@mahsan/ng-components';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginConstraint } from '@phoenix-front-apps/models';
import { LoginConstraintEditComponent } from './login-constraint-edit.component';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

describe('AppLoginConstraintEditComponent', () => {
  let component: LoginConstraintEditComponent;
  let fixture: ComponentFixture<LoginConstraintEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, LibButtonModule, CorePipesModule],
      declarations: [LoginConstraintEditComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginConstraintEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create form should called in the first rendering ', () => {
    jest.spyOn(component, 'createForm');
    jest.spyOn(component, 'watcherForm');
    component.ngOnInit();
    expect(component.createForm).toHaveBeenCalled();
    expect(component.watcherForm).toHaveBeenCalled();
  });

  it('should ', () => {
    const data: LoginConstraint = {
      captchaIpThreshold: 100,
      captchaSessionThreshold: 100,
      defaultOtpMedia: 'email',
      lockMinutes: 10,
      lockThreshold: 5,
      minPassLength: 8,
      otpResendMax: 10,
      otpRetryMax: 10,
      otpValidTimeSeconds: 120,
      tokenRetryMax: 10,
    };
    jest.spyOn(component.editItemsChange, 'emit');
    component.editForm.valueChanges.pipe = jest.fn(() => of(data));
    component.watcherForm();
    expect(component.editItemsChange.emit).toHaveBeenCalledWith(data);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
