import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLogoutPolicyComponent } from './login-logout-policy.component';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

describe('LoginLogoutPolicyComponent', () => {
  let component: LoginLogoutPolicyComponent;
  let fixture: ComponentFixture<LoginLogoutPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginLogoutPolicyComponent],
      imports: [RouterTestingModule, CorePipesModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginLogoutPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
