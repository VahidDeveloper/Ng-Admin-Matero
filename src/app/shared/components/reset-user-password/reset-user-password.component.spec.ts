import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoginConstraint } from '@phoenix-front-apps/models';
import { MatComponentsModule, LibFormsModule, ToastService } from '@mahsan/ng-components';
import { ResetUserPasswordComponent } from './reset-user-password.component';
import {
  LoginConstraintConfigService,
  UserPasswordService,
} from '@phoenix-front-apps/wina-services';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

describe('ResetUserPasswordComponent', () => {
  let component: ResetUserPasswordComponent;
  let fixture: ComponentFixture<ResetUserPasswordComponent>;
  let userPasswordService: UserPasswordService;
  let toastService: ToastService;
  let formBuilder: FormBuilder;
  let loginConstraintConfigService: LoginConstraintConfigService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetUserPasswordComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, LibFormsModule, MatComponentsModule, CorePipesModule],
      providers: [
        {
          provide: UserPasswordService,
          useValue: {},
        },
        {
          provide: LoginConstraintConfigService,
          useValue: {
            getConstraint: jest.fn(() => of({ minPassLength: 8 }).pipe(delay(100))),
          },
        },
      ],
    }).compileComponents();
    userPasswordService = TestBed.inject(UserPasswordService);
    toastService = TestBed.inject(ToastService);
    formBuilder = TestBed.inject(FormBuilder);
    loginConstraintConfigService = TestBed.inject(LoginConstraintConfigService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetUserPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit test: minPassLength validation shoule be added', fakeAsync(() => {
    component.currentUser = true;

    loginConstraintConfigService.getConstraint = jest.fn(() =>
      of({ ...new LoginConstraint(), minPassLength: 8 }).pipe(delay(0))
    );
    component.ngOnInit();
    tick();
    component['_form'].patchValue({
      oldPassword: '123',
      newPassword: '123A!',
    });
    expect(component['_form'].valid).toBeFalsy();

    component['_form'].patchValue({
      oldPassword: '123',
      newPassword: '123456Aa@!',
    });
    expect(component['_form'].valid).toBeTruthy();
  }));

  it('submitForm test 1: currentUser = true. submitForm should be called whenever the form is valid', () => {
    component.currentUser = true;
    component['_doResetPassword'] = jest.fn();
    component['_generateForm']();
    component['_form'].markAllAsTouched = jest.fn();

    // test 1: empty fields
    component['_form'].patchValue({
      oldPassword: '',
      newPassword: '',
    });
    component.submitForm();
    expect(component['_doResetPassword']).toHaveBeenCalledTimes(0);
    expect(component['_form'].markAllAsTouched).toHaveBeenCalledTimes(1);

    // test 2: newPassword does not follow password pattern
    component['_form'].patchValue({
      oldPassword: 'asdfr',
      newPassword: 'mmm',
    });
    component.submitForm();
    expect(component['_doResetPassword']).toHaveBeenCalledTimes(0);
    expect(component['_form'].markAllAsTouched).toHaveBeenCalledTimes(2);

    // test 3: all fields are valid
    component['_form'].patchValue({
      oldPassword: 'asdfr',
      newPassword: '123456Aa@!',
    });
    component.submitForm();
    expect(component['_doResetPassword']).toHaveBeenCalledTimes(1);
    expect(component['_form'].markAllAsTouched).toHaveBeenCalledTimes(2);
  });

  it('submitForm test 2: currentUser = false. submitForm should be called whenever the form is valid', () => {
    component.currentUser = false;
    component['_doResetPassword'] = jest.fn();
    component['_generateForm']();
    component['_form'].markAllAsTouched = jest.fn();

    // test 1: empty fields
    component['_form'].patchValue({
      newPassword: '',
      newPasswordRepeat: '',
    });
    component.submitForm();
    expect(component['_doResetPassword']).toHaveBeenCalledTimes(0);
    expect(component['_form'].markAllAsTouched).toHaveBeenCalledTimes(1);

    // test 2: newPassword does not match newPasswordRepeat
    component['_form'].patchValue({
      newPassword: '123456A!',
      newPasswordRepeat: 'asd',
    });
    component.submitForm();
    expect(component['_doResetPassword']).toHaveBeenCalledTimes(0);
    expect(component['_form'].markAllAsTouched).toHaveBeenCalledTimes(2);

    // test 3: newPassword does not follow password pattern
    component['_form'].patchValue({
      newPassword: 'abcd',
      newPasswordRepeat: 'abcd',
    });
    component.submitForm();
    expect(component._form.valid).toEqual(false);
    expect(component['_doResetPassword']).toHaveBeenCalledTimes(0);
    expect(component['_form'].markAllAsTouched).toHaveBeenCalledTimes(3);

    // test 4: all fields are valid
    component['_form'].patchValue({
      newPassword: '123456Aa@!',
      newPasswordRepeat: '123456Aa@!',
    });
    component.submitForm();
    expect(component['_doResetPassword']).toHaveBeenCalledTimes(1);
    expect(component['_form'].markAllAsTouched).toHaveBeenCalledTimes(3);
  });

  it('_doResetPassword test 1: currentUser = true. resetCurrentUserPassword should be called', fakeAsync(() => {
    component.currentUser = true;
    component['_generateForm']();
    toastService.showSuccessToast = jest.fn();
    userPasswordService.resetCurrentUserPassword = jest.fn(() => of(true).pipe(delay(0)));
    userPasswordService.save = jest.fn(() => of(true).pipe(delay(0)));
    component['_form'].patchValue({
      newPassword: '123456A!',
      oldPassword: '123456',
    });
    component['_doResetPassword']();
    expect(userPasswordService.resetCurrentUserPassword).toHaveBeenCalledWith('123456', '123456A!');
    expect(userPasswordService.save).not.toHaveBeenCalled();
    expect(component._isLoading).toBeTruthy();
    tick();
    expect(toastService.showSuccessToast).toHaveBeenCalled();
  }));

  it('_doResetPassword test 2: currentUser = false. resetUserPassword should be called', fakeAsync(() => {
    component.currentUser = false;
    component['_generateForm']();
    toastService.showSuccessToast = jest.fn();
    userPasswordService.resetCurrentUserPassword = jest.fn(() => of(true).pipe(delay(0)));
    userPasswordService.save = jest.fn(() => of(true).pipe(delay(0)));
    component.username = 'a.kazemi';
    component['_form'].patchValue({
      newPassword: '123456A!',
      newPasswordRepeat: '123456A!',
    });
    component['_doResetPassword']();
    expect(userPasswordService.save).toHaveBeenCalledWith({
      ...component._form.value,
      username: 'a.kazemi',
    });
    expect(userPasswordService.resetCurrentUserPassword).not.toHaveBeenCalled();
    expect(component._isLoading).toBeTruthy();
    tick();
    expect(toastService.showSuccessToast).toHaveBeenCalled();
  }));
});
