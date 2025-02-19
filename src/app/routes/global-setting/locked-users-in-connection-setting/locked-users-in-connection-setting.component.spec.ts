import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { LockedUsersInConnectionSettingComponent } from './locked-users-in-connection-setting.component';
import { CorePipesModule } from '@phoenix-front-apps/ng-core';

describe('LockedUsersInConnectionSettingComponent', () => {
  let component: LockedUsersInConnectionSettingComponent;
  let fixture: ComponentFixture<LockedUsersInConnectionSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LockedUsersInConnectionSettingComponent],
      imports: [RouterTestingModule, CorePipesModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedUsersInConnectionSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
